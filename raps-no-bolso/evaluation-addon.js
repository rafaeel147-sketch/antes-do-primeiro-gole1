// Avaliação e validação do RAPS no Bolso.
// MVP sem servidor: respostas ficam somente neste navegador/aparelho.
// Não coleta nome, diagnóstico, prontuário ou relato clínico.

(() => {
  const DB_NAME = 'raps-no-bolso-avaliacao';
  const STORE = 'registros';
  const DB_VERSION = 1;
  const ACTIVE_TEST_KEY = 'raps-avaliacao-teste-ativo';

  if (!menuItems.some(([r]) => r === 'avaliacao')) {
    const fontesIndex = menuItems.findIndex(([r]) => r === 'fontes');
    const item = ['avaliacao','📊','Ajude a melhorar','Feedback e validação do RAPS no Bolso'];
    if (fontesIndex >= 0) menuItems.splice(fontesIndex, 0, item);
    else menuItems.push(item);
  }

  const testTasks = [
    ['caminho','Encontrar qual porta do SUS procurar em uma situação'],
    ['direito','Localizar um direito e descobrir como agir'],
    ['aod','Encontrar orientação sobre recaída ou abstinência'],
    ['participacao','Registrar uma melhoria em Participe do SUS'],
    ['ouvsus','Descobrir como fazer uma manifestação na OuvSUS'],
    ['outro','Outra tarefa definida pela oficina']
  ];

  function esc(value='') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function uid(prefix='a') {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function fmtDate(value) {
    try { return new Date(value).toLocaleString('pt-BR'); } catch { return esc(value); }
  }
  function secondsLabel(seconds=0) {
    const s=Math.max(0,Math.round(Number(seconds)||0));
    const min=Math.floor(s/60), rest=s%60;
    return min ? `${min} min ${rest}s` : `${rest}s`;
  }
  function evalBreadcrumb(title){
    return `<div class="breadcrumb">${link('inicio','Início')} <span>›</span> ${link('avaliacao','Ajude a melhorar')} <span>›</span> <span>${title}</span></div>`;
  }
  function evalHead(title, summary){
    return `<section class="page-head">${evalBreadcrumb(title)}<div class="eyebrow">Avaliação e melhoria contínua</div><h1>${title}</h1><p class="summary">${summary}</p></section>`;
  }
  function localNotice(){
    return `<section class="panel soft"><strong>🔒 Dados locais nesta versão</strong><p>As respostas ficam somente neste navegador/aparelho. Não são enviadas ao Ministério da Saúde, Secretaria, CAPS, Conselho ou qualquer servidor. Não informe nome, diagnóstico, prontuário nem detalhes clínicos no campo de observação.</p></section>`;
  }
  function researchNotice(){
    return `<section class="panel warning"><h3>Uso em pesquisa</h3><p>Este protótipo organiza testes de usabilidade. Se os resultados forem usados em pesquisa com participantes, a instituição responsável deve definir previamente governança dos dados, consentimento e avaliar as exigências éticas aplicáveis, inclusive CEP/Conep quando couber.</p></section>`;
  }

  pages['avaliacao'] = () => `
    <div class="page">
      ${pageHead('Ajude a melhorar','Avaliar não é dar uma nota ao projeto: é descobrir se a pessoa encontra o que precisa, entende a informação e consegue concluir uma tarefa.','Pesquisa, avaliação e cocriação')}
      <section class="panel success eval-intro">
        <div class="callout"><span class="callout-icon">📊</span><div><h2>Transformar uso em melhoria</h2><p>Esta área registra barreiras de navegação e compreensão para orientar novas versões do RAPS no Bolso. Nenhuma resposta desta versão sai do aparelho automaticamente.</p></div></div>
      </section>
      <section class="nav-grid" aria-label="Opções de avaliação">
        <a class="nav-card" href="?p=avaliacao-rapida" data-route="avaliacao-rapida"><span class="icon-square">✓</span><span><strong>Feedback rápido</strong><p>Clareza, facilidade, conclusão e o que faltou.</p></span><span class="go">›</span></a>
        <a class="nav-card" href="?p=avaliacao-teste" data-route="avaliacao-teste"><span class="icon-square">⏱</span><span><strong>Teste guiado</strong><p>Use em oficinas para medir tarefa, tempo e barreiras.</p></span><span class="go">›</span></a>
        <a class="nav-card" href="?p=avaliacao-painel" data-route="avaliacao-painel"><span class="icon-square">▦</span><span><strong>Painel local</strong><p>Indicadores, registros e exportação para análise.</p></span><span class="go">›</span></a>
      </section>
      <div class="content-grid eval-info-grid">
        <div class="content-stack">
          <section class="panel"><h2>O que vale a pena medir?</h2><div class="metric-explain"><div><strong>Conclusão da tarefa</strong><p>A pessoa conseguiu fazer o que precisava?</p></div><div><strong>Compreensão</strong><p>Ela entendeu a informação e o próximo passo?</p></div><div><strong>Facilidade</strong><p>Encontrou o caminho sem se perder?</p></div><div><strong>Tempo</strong><p>Quanto demorou para concluir a tarefa?</p></div><div><strong>Barreiras</strong><p>O que precisa mudar na interface ou conteúdo?</p></div></div></section>
          ${localNotice()}
        </div>
        <div class="side-stack">${researchNotice()}</div>
      </div>
    </div>`;

  pages['avaliacao-rapida'] = () => {
    const origin = new URLSearchParams(location.search).get('origem') || '';
    const moduleOptions = menuItems.filter(([r])=>!['inicio','fontes','avaliacao'].includes(r)).map(([r,,t])=>`<option value="${esc(r)}" ${origin===r?'selected':''}>${esc(t)}</option>`).join('');
    return `
    <div class="page">
      ${evalHead('Feedback rápido','Leva menos de um minuto. Use para registrar se a informação ajudou e onde ainda há dificuldade.')}
      <div class="content-grid"><div class="content-stack">
        ${localNotice()}
        <section class="panel"><h2>Como foi usar esta parte do RAPS no Bolso?</h2>
          <form id="quickEvalForm" class="eval-form">
            <label>Qual área você acabou de usar?<select name="module" required><option value="">Escolha</option>${moduleOptions}<option value="geral">Uso geral do aplicativo</option></select></label>
            <fieldset><legend>Você conseguiu encontrar o que procurava?</legend><div class="choice-row"><label><input type="radio" name="completed" value="sim" required> Sim</label><label><input type="radio" name="completed" value="parcial"> Mais ou menos</label><label><input type="radio" name="completed" value="nao"> Não</label></div></fieldset>
            <fieldset><legend>A informação ficou clara?</legend><div class="rating-row" aria-label="Clareza de 1 a 5">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="clarity" value="${n}" required><span>${n}</span></label>`).join('')}</div><div class="rating-hints"><span>Confusa</span><span>Muito clara</span></div></fieldset>
            <fieldset><legend>Foi fácil encontrar o caminho nesta tela?</legend><div class="rating-row" aria-label="Facilidade de 1 a 5">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="ease" value="${n}" required><span>${n}</span></label>`).join('')}</div><div class="rating-hints"><span>Difícil</span><span>Muito fácil</span></div></fieldset>
            <fieldset><legend>Depois de ler, você sabe qual é o próximo passo?</legend><div class="choice-row"><label><input type="radio" name="nextStep" value="sim" required> Sim</label><label><input type="radio" name="nextStep" value="parcial"> Mais ou menos</label><label><input type="radio" name="nextStep" value="nao"> Não</label></div></fieldset>
            <label>O que faltou ou confundiu? <span class="optional">opcional</span><textarea name="note" rows="3" maxlength="500" placeholder="Fale da tela, texto ou navegação. Não inclua informação clínica pessoal."></textarea></label>
            <button class="btn" type="submit">Salvar feedback neste aparelho</button>
          </form>
          <div id="quickEvalFeedback" class="form-feedback" aria-live="polite"></div>
        </section>
      </div><div class="side-stack"><section class="panel"><h3>Escala</h3><p><strong>1</strong> significa muita dificuldade e <strong>5</strong> significa muita facilidade ou clareza. O objetivo não é “tirar nota alta”; respostas baixas mostram onde melhorar.</p></section></div></div>
    </div>`;
  };

  pages['avaliacao-teste'] = () => {
    const active = getActiveTest();
    if (active) {
      const elapsed = Math.max(0, Math.round((Date.now() - active.startedAt)/1000));
      return `
      <div class="page">
        ${evalHead('Concluir teste guiado','Registre o resultado da tarefa sem identificar a pessoa participante.')}
        <div class="content-grid"><div class="content-stack">
          <section class="panel success test-active-card"><div class="eyebrow">Teste em andamento</div><h2>${esc(active.taskLabel)}</h2><p>Código anônimo da sessão: <strong>${esc(active.code)}</strong></p><p>Tempo aproximado até abrir esta tela: <strong>${secondsLabel(elapsed)}</strong>.</p></section>
          <section class="panel"><h2>Resultado da tarefa</h2>
            <form id="finishTestForm" class="eval-form">
              <fieldset><legend>A tarefa foi concluída?</legend><div class="choice-row"><label><input type="radio" name="outcome" value="sim" required> Sim</label><label><input type="radio" name="outcome" value="parcial"> Parcialmente</label><label><input type="radio" name="outcome" value="nao"> Não</label></div></fieldset>
              <fieldset><legend>Precisou de ajuda de outra pessoa?</legend><div class="choice-row"><label><input type="radio" name="help" value="nao" required> Não</label><label><input type="radio" name="help" value="pouca"> Um pouco</label><label><input type="radio" name="help" value="muita"> Muita ajuda</label></div></fieldset>
              <div class="form-grid two"><label>Quantos obstáculos/erros foram observados?<input type="number" name="errors" min="0" max="20" step="1" value="0" required></label><label>Principal barreira<select name="barrier" required><option value="nenhuma">Nenhuma</option><option value="nao-achou">Não encontrou a opção</option><option value="texto">Texto difícil/confuso</option><option value="rota">Navegação/rota confusa</option><option value="acessibilidade">Barreira de acessibilidade</option><option value="tecnico">Erro técnico</option><option value="conteudo">Informação que precisava não estava disponível</option><option value="outra">Outra</option></select></label></div>
              <fieldset><legend>Clareza da informação</legend><div class="rating-row">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="clarity" value="${n}" required><span>${n}</span></label>`).join('')}</div></fieldset>
              <fieldset><legend>Facilidade de navegação</legend><div class="rating-row">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="ease" value="${n}" required><span>${n}</span></label>`).join('')}</div></fieldset>
              <fieldset><legend>Ao final, ficou claro qual seria o próximo passo?</legend><div class="choice-row"><label><input type="radio" name="nextStep" value="sim" required> Sim</label><label><input type="radio" name="nextStep" value="parcial"> Mais ou menos</label><label><input type="radio" name="nextStep" value="nao"> Não</label></div></fieldset>
              <label>Observação do teste <span class="optional">opcional</span><textarea name="note" rows="4" maxlength="700" placeholder="Ex.: demorou para perceber o botão. Não registre nome ou informação clínica."></textarea></label>
              <div class="hero-actions"><button class="btn" type="submit">Concluir e salvar teste</button><button class="btn secondary" id="cancelTest" type="button">Cancelar teste</button></div>
            </form>
            <div id="testFeedback" class="form-feedback" aria-live="polite"></div>
          </section>
          ${researchNotice()}
        </div><div class="side-stack"><section class="panel"><h3>O que será salvo?</h3><p>Tarefa, resultado, tempo, quantidade de obstáculos, clareza, facilidade, necessidade de ajuda, próximo passo e observação opcional.</p></section></div></div>
      </div>`;
    }

    return `
    <div class="page">
      ${evalHead('Teste guiado','Modo para oficinas e validação de usabilidade. Uma tarefa é definida, o cronômetro começa e o resultado é registrado ao final.')}
      <div class="content-grid"><div class="content-stack">
        ${localNotice()}
        <section class="panel"><h2>Iniciar uma sessão</h2>
          <form id="startTestForm" class="eval-form">
            <label>Tarefa de teste<select name="task" required><option value="">Escolha uma tarefa</option>${testTasks.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>
            <label>Se escolheu “outra”, descreva a tarefa <span class="optional">opcional</span><input name="customTask" maxlength="180" placeholder="Ex.: encontrar onde registrar uma sugestão"></label>
            <section class="panel soft compact-panel"><strong>Como funciona</strong><ol><li>Inicie o teste.</li><li>Entregue o aparelho à pessoa e peça que tente concluir a tarefa sem orientação inicial.</li><li>O cronômetro fica ativo durante a navegação.</li><li>Ao terminar ou desistir, toque em “Concluir teste” na barra inferior.</li></ol></section>
            <button class="btn" type="submit">Iniciar teste e cronômetro</button>
          </form>
          <div id="testFeedback" class="form-feedback" aria-live="polite"></div>
        </section>
        ${researchNotice()}
      </div><div class="side-stack"><section class="panel"><h3>Sem identificação</h3><p>O sistema cria apenas um código aleatório para diferenciar sessões. Não peça nome, CPF, prontuário ou diagnóstico.</p></section></div></div>
    </div>`;
  };

  pages['avaliacao-painel'] = () => `
    <div class="page">
      ${evalHead('Painel local','Indicadores calculados a partir dos feedbacks e testes salvos somente neste aparelho.')}
      ${localNotice()}
      <section id="evalMetrics" class="metrics-grid" aria-live="polite"><div class="metric-card"><small>Carregando</small><strong>…</strong></div></section>
      <div class="content-grid eval-panel-grid"><div class="content-stack">
        <section class="panel"><div class="panel-heading"><div><h2>Registros locais</h2><p>Use os filtros e exporte os resultados para análise.</p></div><div class="hero-actions"><button class="btn secondary" id="exportEvalCsv" type="button">Exportar CSV</button><button class="btn secondary" id="exportEvalJson" type="button">Exportar JSON</button></div></div><div id="evalRecords" class="eval-records"><p>Carregando...</p></div></section>
      </div><div class="side-stack">
        <section class="panel"><h3>Indicadores recomendados</h3><ul class="tip-list"><li>Taxa de conclusão de tarefa.</li><li>Percentual que identifica o próximo passo.</li><li>Média de clareza e facilidade.</li><li>Tempo médio por tarefa.</li><li>Quantidade de obstáculos.</li><li>Barreiras mais frequentes.</li><li>Mudanças implementadas após os testes.</li></ul></section>
        <section class="panel danger"><h3>Limpar dados de teste</h3><p>Apaga somente os registros de avaliação deste aparelho.</p><button class="mini-action danger-action" id="clearEvalData" type="button">Apagar todos os dados locais</button></section>
      </div></div>
    </div>`;

  function openDb(){
    return new Promise((resolve,reject)=>{
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(STORE)){
          const store=db.createObjectStore(STORE,{keyPath:'id'});
          store.createIndex('type','type',{unique:false});
          store.createIndex('createdAt','createdAt',{unique:false});
        }
      };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
  }
  async function saveRecord(record){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete=()=>{db.close();resolve(record)};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  async function allRecords(){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const request=tx.objectStore(STORE).getAll();
      request.onsuccess=()=>resolve(request.result.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))));
      request.onerror=()=>reject(request.error);
      tx.oncomplete=()=>db.close();
    });
  }
  async function clearRecords(){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }

  function getActiveTest(){
    try { return JSON.parse(sessionStorage.getItem(ACTIVE_TEST_KEY)||'null'); } catch { return null; }
  }
  function setActiveTest(value){
    if(value) sessionStorage.setItem(ACTIVE_TEST_KEY,JSON.stringify(value));
    else sessionStorage.removeItem(ACTIVE_TEST_KEY);
  }
  function taskLabel(value, custom=''){
    if(value==='outro' && custom.trim()) return custom.trim();
    return testTasks.find(([v])=>v===value)?.[1] || 'Tarefa de teste';
  }

  function avg(values){
    const nums=values.map(Number).filter(Number.isFinite);
    return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0;
  }
  function pct(part,total){ return total ? Math.round((part/total)*100) : 0; }
  function barrierLabel(value){
    return ({'nenhuma':'Nenhuma','nao-achou':'Não encontrou a opção','texto':'Texto difícil/confuso','rota':'Navegação/rota confusa','acessibilidade':'Barreira de acessibilidade','tecnico':'Erro técnico','conteudo':'Informação ausente','outra':'Outra'})[value] || value || '—';
  }
  function completedLabel(value){ return ({sim:'Sim',parcial:'Parcial',nao:'Não'})[value] || value || '—'; }

  function renderMetrics(rows){
    const quick=rows.filter(r=>r.type==='quick');
    const pulse=rows.filter(r=>r.type==='pulse');
    const tests=rows.filter(r=>r.type==='test');
    const evaluative=[...quick,...tests];
    const completionBase=[...quick,...tests];
    const completed=completionBase.filter(r=>(r.completed||r.outcome)==='sim').length;
    const nextBase=evaluative.filter(r=>r.nextStep);
    const nextYes=nextBase.filter(r=>r.nextStep==='sim').length;
    const clarity=avg(evaluative.map(r=>r.clarity));
    const ease=avg(evaluative.map(r=>r.ease));
    const testSuccess=tests.filter(r=>r.outcome==='sim').length;
    const avgSeconds=avg(tests.map(r=>r.durationSeconds));
    const errors=tests.reduce((sum,r)=>sum+(Number(r.errors)||0),0);
    return `
      <div class="metric-card"><small>Respostas locais</small><strong>${rows.length}</strong><span>${quick.length} detalhadas • ${pulse.length} rápidas • ${tests.length} testes</span></div>
      <div class="metric-card"><small>Conclusão</small><strong>${pct(completed,completionBase.length)}%</strong><span>Conseguiu concluir o que procurava/tarefa</span></div>
      <div class="metric-card"><small>Próximo passo claro</small><strong>${pct(nextYes,nextBase.length)}%</strong><span>Respondeu “sim” ao final</span></div>
      <div class="metric-card"><small>Clareza média</small><strong>${clarity?clarity.toFixed(1):'—'}</strong><span>Escala de 1 a 5</span></div>
      <div class="metric-card"><small>Facilidade média</small><strong>${ease?ease.toFixed(1):'—'}</strong><span>Escala de 1 a 5</span></div>
      <div class="metric-card"><small>Testes concluídos</small><strong>${pct(testSuccess,tests.length)}%</strong><span>${tests.length?`Tempo médio ${secondsLabel(avgSeconds)}`:'Sem teste ainda'}</span></div>
      <div class="metric-card"><small>Obstáculos observados</small><strong>${errors}</strong><span>Total nos testes guiados</span></div>`;
  }

  function recordCard(r){
    if(r.type==='quick') return `<article class="eval-record"><div><strong>Feedback detalhado</strong><small>${fmtDate(r.createdAt)} • ${esc(r.module||'geral')}</small></div><div class="eval-record-tags"><span>Conclusão: ${completedLabel(r.completed)}</span><span>Clareza: ${esc(r.clarity)}/5</span><span>Facilidade: ${esc(r.ease)}/5</span><span>Próximo passo: ${completedLabel(r.nextStep)}</span></div>${r.note?`<p>${esc(r.note)}</p>`:''}</article>`;
    if(r.type==='pulse') return `<article class="eval-record"><div><strong>Resposta rápida da página</strong><small>${fmtDate(r.createdAt)} • ${esc(r.route)}</small></div><div class="eval-record-tags"><span>Ajudou: ${completedLabel(r.answer)}</span></div></article>`;
    if(r.type==='test') return `<article class="eval-record"><div><strong>${esc(r.taskLabel)}</strong><small>${fmtDate(r.createdAt)} • ${esc(r.code)}</small></div><div class="eval-record-tags"><span>Resultado: ${completedLabel(r.outcome)}</span><span>Tempo: ${secondsLabel(r.durationSeconds)}</span><span>Erros: ${esc(r.errors)}</span><span>Barreira: ${esc(barrierLabel(r.barrier))}</span><span>Clareza: ${esc(r.clarity)}/5</span><span>Facilidade: ${esc(r.ease)}/5</span></div>${r.note?`<p>${esc(r.note)}</p>`:''}</article>`;
    return '';
  }

  async function hydratePanel(){
    if(currentRoute()!=='avaliacao-painel')return;
    try{
      const rows=await allRecords();
      const metrics=document.getElementById('evalMetrics');
      const records=document.getElementById('evalRecords');
      if(metrics)metrics.innerHTML=renderMetrics(rows);
      if(records)records.innerHTML=rows.length?rows.map(recordCard).join(''):'<div class="empty-local"><strong>Nenhuma avaliação salva.</strong><p>Faça um feedback rápido ou teste guiado para começar.</p></div>';
    }catch(err){
      document.querySelectorAll('#evalMetrics,#evalRecords').forEach(el=>el.innerHTML='<div class="panel danger">Não foi possível abrir os dados locais de avaliação.</div>');
      console.error(err);
    }
  }

  async function savePulse(route,answer,container){
    await saveRecord({id:uid('pulse'),type:'pulse',createdAt:new Date().toISOString(),route,answer});
    if(container)container.innerHTML='<strong>Obrigado.</strong> Esta resposta ficou salva somente neste aparelho para ajudar a revisar esta página.';
  }

  function injectPagePulse(){
    const route=currentRoute();
    if(route.startsWith('avaliacao'))return;
    const content=document.getElementById('conteudo');
    const page=content?.querySelector('.page');
    if(!page || page.querySelector('[data-eval-pulse]'))return;
    const box=document.createElement('section');
    box.className='panel soft eval-pulse';
    box.dataset.evalPulse='1';
    box.innerHTML=`<div><strong>Esta página ajudou você a saber o que fazer?</strong><small>Resposta local, sem identificação.</small></div><div class="pulse-actions"><button type="button" data-pulse-answer="sim">Sim</button><button type="button" data-pulse-answer="parcial">Mais ou menos</button><button type="button" data-pulse-answer="nao">Não</button>${link('avaliacao-rapida','Detalhar','mini-action')}</div>`;
    page.appendChild(box);
  }

  function injectActiveTestBar(){
    document.getElementById('activeEvalBar')?.remove();
    const active=getActiveTest();
    if(!active || currentRoute()==='avaliacao-teste')return;
    const bar=document.createElement('div');
    bar.id='activeEvalBar';
    bar.className='active-eval-bar';
    bar.innerHTML=`<div><strong>⏱ Teste em andamento</strong><span>${esc(active.taskLabel)}</span></div><a href="?p=avaliacao-teste" data-route="avaliacao-teste">Concluir teste</a>`;
    document.body.appendChild(bar);
  }

  function refreshEvalUi(){
    setTimeout(()=>{injectPagePulse();injectActiveTestBar();hydratePanel();},0);
  }

  document.addEventListener('submit',async e=>{
    if(e.target.id==='quickEvalForm'){
      e.preventDefault();
      const form=e.target, fd=new FormData(form), button=form.querySelector('button[type="submit"]');
      button.disabled=true;button.textContent='Salvando...';
      try{
        await saveRecord({id:uid('quick'),type:'quick',createdAt:new Date().toISOString(),module:fd.get('module'),completed:fd.get('completed'),clarity:Number(fd.get('clarity')),ease:Number(fd.get('ease')),nextStep:fd.get('nextStep'),note:String(fd.get('note')||'').trim()});
        form.reset();
        document.getElementById('quickEvalFeedback').innerHTML='<div class="panel success">✓ Feedback salvo somente neste aparelho.</div>';
      }catch(err){document.getElementById('quickEvalFeedback').innerHTML='<div class="panel danger">Não foi possível salvar neste navegador.</div>';console.error(err)}
      finally{button.disabled=false;button.textContent='Salvar feedback neste aparelho'}
      return;
    }

    if(e.target.id==='startTestForm'){
      e.preventDefault();
      const fd=new FormData(e.target), task=String(fd.get('task')||''), custom=String(fd.get('customTask')||'');
      if(!task)return;
      const active={code:`T-${Math.random().toString(36).slice(2,7).toUpperCase()}`,task,taskLabel:taskLabel(task,custom),startedAt:Date.now()};
      setActiveTest(active);
      render('inicio',true);
      refreshEvalUi();
      return;
    }

    if(e.target.id==='finishTestForm'){
      e.preventDefault();
      const active=getActiveTest(); if(!active)return;
      const form=e.target,fd=new FormData(form),button=form.querySelector('button[type="submit"]');
      button.disabled=true;button.textContent='Salvando...';
      try{
        const finishedAt=Date.now();
        await saveRecord({id:uid('test'),type:'test',createdAt:new Date().toISOString(),code:active.code,task:active.task,taskLabel:active.taskLabel,startedAt:new Date(active.startedAt).toISOString(),finishedAt:new Date(finishedAt).toISOString(),durationSeconds:Math.max(0,Math.round((finishedAt-active.startedAt)/1000)),outcome:fd.get('outcome'),help:fd.get('help'),errors:Number(fd.get('errors')||0),barrier:fd.get('barrier'),clarity:Number(fd.get('clarity')),ease:Number(fd.get('ease')),nextStep:fd.get('nextStep'),note:String(fd.get('note')||'').trim()});
        setActiveTest(null);
        document.getElementById('testFeedback').innerHTML='<div class="panel success">✓ Teste concluído e salvo localmente. O painel já pode calcular os indicadores.</div>';
        setTimeout(()=>render('avaliacao-painel',true),650);
      }catch(err){document.getElementById('testFeedback').innerHTML='<div class="panel danger">Não foi possível salvar o teste.</div>';console.error(err);button.disabled=false;button.textContent='Concluir e salvar teste'}
      return;
    }
  });

  document.addEventListener('click',async e=>{
    const pulse=e.target.closest('[data-pulse-answer]');
    if(pulse){
      const container=pulse.closest('[data-eval-pulse]');
      pulse.closest('.pulse-actions')?.querySelectorAll('button').forEach(b=>b.disabled=true);
      try{await savePulse(currentRoute(),pulse.dataset.pulseAnswer,container)}catch(err){if(container)container.innerHTML='Não foi possível salvar a resposta neste navegador.';console.error(err)}
      return;
    }
    if(e.target.closest('#cancelTest')){
      if(confirm('Cancelar este teste? O resultado não será salvo.')){setActiveTest(null);render('avaliacao-teste',true);refreshEvalUi();}
      return;
    }
    if(e.target.closest('#exportEvalJson')){
      const rows=await allRecords();downloadBlob(JSON.stringify({exportedAt:new Date().toISOString(),version:'avaliacao-v1',records:rows},null,2),'raps-avaliacao.json','application/json');return;
    }
    if(e.target.closest('#exportEvalCsv')){
      const rows=await allRecords();downloadBlob(toCsv(rows),'raps-avaliacao.csv','text/csv;charset=utf-8');return;
    }
    if(e.target.closest('#clearEvalData')){
      if(confirm('Apagar todos os dados locais de avaliação deste aparelho? Esta ação não pode ser desfeita.')){await clearRecords();await hydratePanel();}
      return;
    }
    if(e.target.closest('[data-route]'))refreshEvalUi();
  });

  function downloadBlob(content,name,type){
    const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function csvCell(value){
    const s=String(value??'').replace(/"/g,'""');return `"${s}"`;
  }
  function toCsv(rows){
    const fields=['id','type','createdAt','route','module','answer','code','task','taskLabel','durationSeconds','completed','outcome','help','errors','barrier','clarity','ease','nextStep','note'];
    return '\ufeff'+[fields.join(';'),...rows.map(r=>fields.map(f=>csvCell(r[f])).join(';'))].join('\n');
  }

  window.addEventListener('popstate',refreshEvalUi);
  const observer=new MutationObserver(()=>{injectPagePulse();injectActiveTestBar();});
  const content=document.getElementById('conteudo');
  if(content)observer.observe(content,{childList:true});
  refreshEvalUi();
})();
