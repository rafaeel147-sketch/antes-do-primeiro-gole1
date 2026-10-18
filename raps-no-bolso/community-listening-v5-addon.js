// RAPS no Bolso V5 — escuta comunitária estruturada e síntese agregada.
// Sem servidor. Não interpreta respostas clinicamente e não cria perfil individual.
(() => {
  const PART_DB = 'raps-no-bolso-participacao';
  const EVAL_DB = 'raps-no-bolso-avaliacao';
  const STORE = 'registros';
  const DB_VERSION = 1;

  const roleLabels = {
    usuario:'Usuário do SUS',
    familiar:'Familiar/rede de apoio',
    trabalhador:'Trabalhador',
    pesquisador:'Pesquisador/estudante',
    outro:'Outro papel',
    nao_informar:'Prefiro não informar'
  };
  const barrierLabels = {
    achar_servico:'Encontrar o serviço adequado',
    espera:'Tempo de espera',
    informacao:'Informação insuficiente/confusa',
    transporte:'Deslocamento/transporte',
    acolhimento:'Acolhimento/comunicação',
    continuidade:'Continuidade do cuidado',
    acessibilidade:'Acessibilidade',
    horario:'Horário/funcionamento',
    nenhuma:'Nenhuma destas',
    outra:'Outra'
  };
  const missingLabels = {
    acesso:'Como acessar o serviço',
    localizar:'Onde localizar serviços',
    direitos:'Direitos no SUS',
    horarios_contatos:'Horários e contatos',
    crise:'O que fazer em crise/urgência',
    aod:'Álcool e outras drogas/redução de danos',
    participacao:'Participação social/Ouvidoria',
    nenhuma:'Não senti falta de informação',
    outra:'Outra',
    nao_informar:'Prefiro não informar'
  };
  const experienceLabels = {
    facil:'Fácil',
    parcial:'Com alguma dificuldade',
    dificil:'Difícil',
    nao_se_aplica:'Não se aplica',
    nao_informar:'Prefiro não informar'
  };

  function esc(value='') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function uid() {
    return `escuta-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function avg(values) {
    const nums = values.map(Number).filter(Number.isFinite);
    return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : null;
  }
  function pct(part,total) {
    return total ? Math.round((part/total)*100) : 0;
  }
  function countBy(rows, getter) {
    const result = {};
    for (const row of rows) {
      const values = getter(row);
      for (const value of (Array.isArray(values) ? values : [values])) {
        if (value == null || value === '') continue;
        result[value] = (result[value] || 0) + 1;
      }
    }
    return result;
  }
  function labelCounts(counts, labels) {
    return Object.fromEntries(Object.entries(counts).map(([k,v]) => [labels[k] || k, v]));
  }

  function openDb(name) {
    return new Promise((resolve,reject) => {
      const req = indexedDB.open(name, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath:'id' });
          store.createIndex('type','type',{unique:false});
          store.createIndex('createdAt','createdAt',{unique:false});
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function allRecords(name) {
    const db = await openDb(name);
    return new Promise((resolve,reject) => {
      const tx = db.transaction(STORE,'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function saveListening(record) {
    const consent = window.RAPSResearchV5?.getConsentMeta?.();
    if (!consent) throw new Error('consent-required');
    const db = await openDb(PART_DB);
    const enriched = {...record,...consent};
    return new Promise((resolve,reject) => {
      const tx = db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(enriched);
      tx.oncomplete = () => { db.close(); resolve(enriched); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function clearListening() {
    const db = await openDb(PART_DB);
    return new Promise((resolve,reject) => {
      const tx = db.transaction(STORE,'readwrite');
      const store = tx.objectStore(STORE);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return;
        if (cursor.value?.type === 'community-listening') cursor.delete();
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  pages['escuta-comunitaria'] = () => `
    <div class="page">
      ${pageHead(
        'Escuta comunitária',
        'Registre percepções sobre acesso, informação e experiência com a RAPS sem diagnóstico automático, interpretação clínica ou identificação obrigatória.',
        'Escuta estruturada • participação voluntária'
      )}
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel success">
            <h2>Para que serve?</h2>
            <p>Esta escuta procura padrões de barreiras e necessidades de informação para melhorar o RAPS no Bolso e organizar pautas de participação social. Ela não avalia clinicamente a pessoa e não define diagnóstico.</p>
          </section>
          <section class="panel warning">
            <h2>Não inclua dados pessoais ou clínicos</h2>
            <p>Não escreva nome, CPF, CNS, prontuário, diagnóstico, medicação, endereço residencial ou detalhes que identifiquem outra pessoa. Use categorias gerais e descreva apenas o necessário.</p>
          </section>
          <section class="panel">
            <h2>Responder à escuta</h2>
            <form id="communityListeningForm" class="participation-form">
              <label>Você participa desta escuta como
                <select name="role" required>
                  <option value="">Escolha</option>
                  <option value="usuario">Usuário do SUS</option>
                  <option value="familiar">Familiar/rede de apoio</option>
                  <option value="trabalhador">Trabalhador</option>
                  <option value="pesquisador">Pesquisador/estudante</option>
                  <option value="outro">Outro papel</option>
                  <option value="nao_informar">Prefiro não informar</option>
                </select>
              </label>
              <label>Contexto geral <span class="optional">opcional</span>
                <select name="serviceContext">
                  <option value="">Não informar</option>
                  <option value="raps">RAPS em geral</option>
                  <option value="caps">CAPS</option>
                  <option value="ubs">UBS / Atenção Básica</option>
                  <option value="upa">UPA / urgência</option>
                  <option value="ambulatorio">Ambulatório</option>
                  <option value="controle-social">Conselho / participação social</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
              <fieldset>
                <legend>Quais dificuldades de acesso você percebe? <span class="optional">marque quantas quiser</span></legend>
                <div class="choice-grid">
                  ${Object.entries(barrierLabels).map(([value,label]) => `<label class="check-row"><input type="checkbox" name="barriers" value="${esc(value)}"> <span>${esc(label)}</span></label>`).join('')}
                </div>
              </fieldset>
              <label>Como você avalia a facilidade de acesso no contexto que pensou?
                <select name="accessExperience" required>
                  <option value="">Escolha</option>
                  <option value="facil">Fácil</option>
                  <option value="parcial">Com alguma dificuldade</option>
                  <option value="dificil">Difícil</option>
                  <option value="nao_se_aplica">Não se aplica</option>
                  <option value="nao_informar">Prefiro não informar</option>
                </select>
              </label>
              <label>Que tipo de informação mais fez falta?
                <select name="missingInfo" required>
                  <option value="">Escolha</option>
                  ${Object.entries(missingLabels).map(([value,label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('')}
                </select>
              </label>
              <label>Se quiser, detalhe a informação que faltou <span class="optional">opcional</span>
                <textarea name="missingDetail" rows="3" maxlength="500" placeholder="Fale da informação ou do caminho; não inclua dados pessoais ou clínicos."></textarea>
              </label>
              <label>O que ajudou? <span class="optional">opcional</span>
                <textarea name="helped" rows="3" maxlength="500"></textarea>
              </label>
              <label>Que melhoria você sugere? <span class="optional">opcional</span>
                <textarea name="suggestion" rows="3" maxlength="700"></textarea>
              </label>
              <button class="btn" type="submit">Salvar escuta neste aparelho</button>
            </form>
            <div id="communityListeningFeedback" class="form-feedback" aria-live="polite"></div>
          </section>
          <section class="panel danger">
            <h2>Apagar registros de escuta</h2>
            <p>Apaga somente as respostas de escuta comunitária deste aparelho; não apaga sugestões, propostas ou avaliações do aplicativo.</p>
            <button id="clearCommunityListening" class="mini-action danger-action" type="button">Apagar escutas locais</button>
          </section>
        </div>
        <div class="side-stack">
          <section class="panel soft">
            <h3>Sem identificação obrigatória</h3>
            <p>O formulário trabalha com categorias gerais. “Prefiro não informar” está disponível para o papel da pessoa e para itens de percepção.</p>
          </section>
          ${sideBox('Depois da escuta','Veja apenas indicadores agregados, sem texto livre por padrão.',[['pesquisa-painel-agregado','Abrir síntese agregada'],['pesquisa-participativa','Voltar à pesquisa e participação']])}
        </div>
      </div>
    </div>`;

  pages['pesquisa-painel-agregado'] = () => `
    <div class="page">
      ${pageHead(
        'Síntese agregada',
        'Indicadores calculados apenas a partir dos registros locais deste aparelho. A exportação agregada exclui textos livres, IDs de registros e localização precisa.',
        'Análise local • minimização de dados'
      )}
      <section class="panel success">
        <div class="panel-heading">
          <div><h2>Resumo para análise</h2><p>Use estes indicadores para observar padrões sem começar pela leitura de relatos individuais.</p></div>
          <div class="hero-actions">
            <button class="btn secondary" id="exportAggregateJson" type="button">Exportar agregado JSON</button>
            <button class="btn secondary" id="exportAggregateCsv" type="button">Exportar agregado CSV</button>
          </div>
        </div>
      </section>
      <section id="v5AggregateMetrics" class="metrics-grid" aria-live="polite">
        <div class="metric-card"><small>Carregando</small><strong>…</strong></div>
      </section>
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel"><h2>Escuta comunitária</h2><div id="v5ListeningSummary"><p>Carregando...</p></div></section>
          <section class="panel"><h2>Avaliação do aplicativo</h2><div id="v5EvaluationSummary"><p>Carregando...</p></div></section>
          <section class="panel"><h2>Participação social</h2><div id="v5ParticipationSummary"><p>Carregando...</p></div></section>
        </div>
        <div class="side-stack">
          <section class="panel warning">
            <h3>O que a exportação agregada não inclui</h3>
            <ul class="tip-list"><li>texto livre;</li><li>IDs de registros;</li><li>fotos;</li><li>CPF/CNS/nome;</li><li>GPS ou localização precisa;</li></ul>
          </section>
          <section class="panel soft">
            <h3>Importante</h3>
            <p>Estes números descrevem somente o conjunto de registros salvos neste aparelho. Não representam automaticamente a população da RAPS nem uma amostra científica.</p>
          </section>
        </div>
      </div>
    </div>`;

  async function buildAggregate() {
    const [evalRows, partRows] = await Promise.all([
      allRecords(EVAL_DB).catch(()=>[]),
      allRecords(PART_DB).catch(()=>[])
    ]);
    const quick = evalRows.filter(r=>r.type==='quick');
    const tests = evalRows.filter(r=>r.type==='test');
    const pulses = evalRows.filter(r=>r.type==='pulse');
    const evaluative = [...quick,...tests];
    const completion = evaluative.filter(r=>(r.completed || r.outcome)==='sim').length;
    const nextRows = evaluative.filter(r=>r.nextStep);
    const nextYes = nextRows.filter(r=>r.nextStep==='sim').length;
    const listening = partRows.filter(r=>r.type==='community-listening');
    const nonListening = partRows.filter(r=>r.type!=='community-listening');

    return {
      schema:'raps-v5-aggregate-1',
      generatedAt:new Date().toISOString(),
      scope:'local-device-only',
      evaluation:{
        total:evalRows.length,
        byType:{quick:quick.length,pulse:pulses.length,test:tests.length},
        completionYesPct:pct(completion,evaluative.length),
        nextStepYesPct:pct(nextYes,nextRows.length),
        clarityMean:avg(evaluative.map(r=>r.clarity)),
        easeMean:avg(evaluative.map(r=>r.ease))
      },
      communityListening:{
        total:listening.length,
        byRole:labelCounts(countBy(listening,r=>r.role),roleLabels),
        byAccessExperience:labelCounts(countBy(listening,r=>r.accessExperience),experienceLabels),
        barriers:labelCounts(countBy(listening,r=>r.barriers || []),barrierLabels),
        missingInformation:labelCounts(countBy(listening,r=>r.missingInfo),missingLabels),
        byServiceContext:countBy(listening,r=>r.serviceContext || 'não informado')
      },
      participation:{
        total:nonListening.length,
        byType:countBy(nonListening,r=>r.type),
        byStatus:countBy(nonListening,r=>r.status || 'sem status')
      },
      privacy:{
        freeTextIncluded:false,
        recordIdsIncluded:false,
        photosIncluded:false,
        preciseLocationIncluded:false,
        personalIdentifiersExpected:false
      }
    };
  }

  function metricCards(data) {
    const clarity = data.evaluation.clarityMean;
    const ease = data.evaluation.easeMean;
    return `
      <div class="metric-card"><small>Avaliações locais</small><strong>${data.evaluation.total}</strong><span>feedbacks, respostas rápidas e testes</span></div>
      <div class="metric-card"><small>Conclusão</small><strong>${data.evaluation.completionYesPct}%</strong><span>respostas avaliativas com conclusão “sim”</span></div>
      <div class="metric-card"><small>Próximo passo</small><strong>${data.evaluation.nextStepYesPct}%</strong><span>entendimento declarado</span></div>
      <div class="metric-card"><small>Clareza média</small><strong>${clarity == null ? '—' : clarity.toFixed(1)}</strong><span>escala de 1 a 5</span></div>
      <div class="metric-card"><small>Facilidade média</small><strong>${ease == null ? '—' : ease.toFixed(1)}</strong><span>escala de 1 a 5</span></div>
      <div class="metric-card"><small>Escutas comunitárias</small><strong>${data.communityListening.total}</strong><span>registros estruturados locais</span></div>
      <div class="metric-card"><small>Registros de participação</small><strong>${data.participation.total}</strong><span>fora da escuta estruturada</span></div>`;
  }

  function countList(title, counts) {
    const entries = Object.entries(counts || {}).sort((a,b)=>b[1]-a[1]);
    if (!entries.length) return `<p><strong>${esc(title)}:</strong> sem registros.</p>`;
    return `<div><strong>${esc(title)}</strong><ul class="tip-list">${entries.map(([k,v])=>`<li>${esc(k)}: <strong>${v}</strong></li>`).join('')}</ul></div>`;
  }

  async function hydrateAggregate() {
    if (currentRoute() !== 'pesquisa-painel-agregado') return;
    try {
      const data = await buildAggregate();
      const metrics = document.getElementById('v5AggregateMetrics');
      if (metrics) metrics.innerHTML = metricCards(data);
      const listening = document.getElementById('v5ListeningSummary');
      if (listening) listening.innerHTML = [
        countList('Papel',data.communityListening.byRole),
        countList('Experiência de acesso',data.communityListening.byAccessExperience),
        countList('Barreiras',data.communityListening.barriers),
        countList('Informação faltante',data.communityListening.missingInformation)
      ].join('');
      const evaluation = document.getElementById('v5EvaluationSummary');
      if (evaluation) evaluation.innerHTML = `<p><strong>${data.evaluation.total}</strong> registro(s) de avaliação local. Conclusão “sim”: <strong>${data.evaluation.completionYesPct}%</strong>. Próximo passo claro: <strong>${data.evaluation.nextStepYesPct}%</strong>.</p>`;
      const participation = document.getElementById('v5ParticipationSummary');
      if (participation) participation.innerHTML = countList('Tipos de registro',data.participation.byType);
      window.__rapsV5LastAggregate = data;
    } catch (error) {
      const metrics = document.getElementById('v5AggregateMetrics');
      if (metrics) metrics.innerHTML = '<div class="panel danger">Não foi possível calcular a síntese local.</div>';
      console.error(error);
    }
  }

  function download(content,name,type) {
    const blob = new Blob([content],{type});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function flattenAggregateCsv(data) {
    const rows = [['grupo','indicador','categoria','valor']];
    const pushCounts = (group,indicator,counts) => {
      Object.entries(counts || {}).forEach(([category,value]) => rows.push([group,indicator,category,String(value)]));
    };
    rows.push(['avaliacao','total','',String(data.evaluation.total)]);
    rows.push(['avaliacao','conclusao_sim_pct','',String(data.evaluation.completionYesPct)]);
    rows.push(['avaliacao','proximo_passo_sim_pct','',String(data.evaluation.nextStepYesPct)]);
    rows.push(['avaliacao','clareza_media','',data.evaluation.clarityMean == null ? '' : String(data.evaluation.clarityMean)]);
    rows.push(['avaliacao','facilidade_media','',data.evaluation.easeMean == null ? '' : String(data.evaluation.easeMean)]);
    pushCounts('escuta','papel',data.communityListening.byRole);
    pushCounts('escuta','experiencia_acesso',data.communityListening.byAccessExperience);
    pushCounts('escuta','barreira',data.communityListening.barriers);
    pushCounts('escuta','informacao_faltante',data.communityListening.missingInformation);
    pushCounts('participacao','tipo',data.participation.byType);
    const cell = value => `"${String(value ?? '').replace(/"/g,'""')}"`;
    return '\ufeff' + rows.map(row=>row.map(cell).join(';')).join('\n');
  }

  document.addEventListener('submit', async event => {
    if (event.target.id !== 'communityListeningForm') return;
    event.preventDefault();
    const form = event.target;
    const fd = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; button.textContent = 'Salvando...'; }
    try {
      const barriers = fd.getAll('barriers').map(String);
      await saveListening({
        id:uid(),
        type:'community-listening',
        createdAt:new Date().toISOString(),
        role:String(fd.get('role') || ''),
        serviceContext:String(fd.get('serviceContext') || ''),
        barriers,
        accessExperience:String(fd.get('accessExperience') || ''),
        missingInfo:String(fd.get('missingInfo') || ''),
        missingDetail:String(fd.get('missingDetail') || '').trim(),
        helped:String(fd.get('helped') || '').trim(),
        suggestion:String(fd.get('suggestion') || '').trim()
      });
      form.reset();
      document.getElementById('communityListeningFeedback').innerHTML = '<div class="panel success">✓ Escuta salva somente neste aparelho. Nenhuma interpretação clínica foi produzida.</div>';
    } catch (error) {
      document.getElementById('communityListeningFeedback').innerHTML = '<div class="panel danger">Não foi possível salvar a escuta neste navegador.</div>';
      console.error(error);
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Salvar escuta neste aparelho'; }
    }
  });

  document.addEventListener('click', async event => {
    if (event.target.closest('#clearCommunityListening')) {
      if (confirm('Apagar todas as respostas de escuta comunitária deste aparelho?')) {
        await clearListening();
        document.getElementById('communityListeningFeedback').innerHTML = '<div class="panel success">Escutas locais apagadas.</div>';
      }
      return;
    }
    if (event.target.closest('#exportAggregateJson')) {
      const data = await buildAggregate();
      download(JSON.stringify(data,null,2),'raps-v5-agregado.json','application/json');
      return;
    }
    if (event.target.closest('#exportAggregateCsv')) {
      const data = await buildAggregate();
      download(flattenAggregateCsv(data),'raps-v5-agregado.csv','text/csv;charset=utf-8');
      return;
    }
    if (event.target.closest('[data-route]')) setTimeout(hydrateAggregate,0);
  });

  window.addEventListener('popstate',()=>setTimeout(hydrateAggregate,0));
  const root = document.getElementById('conteudo');
  if (root) new MutationObserver(()=>setTimeout(hydrateAggregate,0)).observe(root,{childList:true,subtree:true});
  setTimeout(hydrateAggregate,0);

  window.__rapsV5Aggregate = { build:buildAggregate };
})();