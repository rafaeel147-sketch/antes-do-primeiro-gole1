// Participe do SUS — controle social e registro comunitário local.
// MVP sem servidor: textos e fotos ficam apenas neste navegador/aparelho via IndexedDB.
// Não substitui protocolo oficial, Conselho de Saúde, Ouvidoria ou prestação de contas formal.

(() => {
  const PARTICIPATION_DB = 'raps-no-bolso-participacao';
  const PARTICIPATION_STORE = 'registros';
  const DB_VERSION = 1;

  sources.participacao = [
    ['Lei nº 8.142/1990 — participação da comunidade no SUS','https://www.planalto.gov.br/ccivil_03/leis/l8142.htm'],
    ['Resolução CNS nº 453/2012 — Conselhos de Saúde','https://www.gov.br/conselho-nacional-de-saude/pt-br/atos-normativos/resolucoes/2012/resolucao-no-453.pdf']
  ];

  if (!menuItems.some(([r]) => r === 'participe-sus')) {
    const ouvidoriaIndex = menuItems.findIndex(([r]) => r === 'ouvsus');
    const item = ['participe-sus','🤝','Participe do SUS','Controle social, melhorias e propostas'];
    if (ouvidoriaIndex >= 0) menuItems.splice(ouvidoriaIndex + 1, 0, item);
    else menuItems.push(item);
  }

  const topics = [
    ['participacao-controle','🗣️','Controle social','Entenda Conselhos, Conferências e como participar.'],
    ['participacao-sugerir','💡','Sugira uma melhoria','Registre um problema e uma proposta neste aparelho.'],
    ['participacao-antes-depois','📸','Antes e depois','Documente pequenas melhorias com fotos, datas e custos informados.'],
    ['participacao-demandas','📋','Acompanhe as demandas','Veja os registros locais e o status de cada item.'],
    ['participacao-proposta','🏛️','Leve uma proposta ao Conselho','Transforme uma ideia em texto organizado para apresentar.'],
    ['participacao-agenda','📅','Agenda e participação','Saiba como se preparar para uma reunião e verificar a agenda oficial.']
  ];

  function esc(value='') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function money(value) {
    if (value === '' || value == null || Number.isNaN(Number(value))) return 'Não informado';
    return Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  }
  function fmtDate(value) {
    if (!value) return 'Não informada';
    const [y,m,d] = String(value).slice(0,10).split('-');
    return y && m && d ? `${d}/${m}/${y}` : esc(value);
  }
  function fmtDateTime(value) {
    try { return new Date(value).toLocaleString('pt-BR'); } catch { return esc(value); }
  }
  function id() {
    return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function participationBreadcrumb(title){
    return `<div class="breadcrumb">${link('inicio','Início')} <span>›</span> ${link('participe-sus','Participe do SUS')} <span>›</span> <span>${title}</span></div>`;
  }
  function participationHead(title, summary){
    return `<section class="page-head">${participationBreadcrumb(title)}<div class="eyebrow">Participação social e controle social</div><h1>${title}</h1><p class="summary">${summary}</p></section>`;
  }
  function participationBack(){
    return `<div class="hero-actions">${link('participe-sus','← Voltar para Participe do SUS','btn secondary')}</div>`;
  }
  function localDataNotice(){
    return `<div class="panel soft local-data-notice"><strong>🔒 Nesta versão, o registro é local.</strong><p>Os dados e fotos ficam somente neste navegador/aparelho. Eles não são enviados ao CAPS, à Secretaria, ao Conselho, à Ouvidoria ou a qualquer servidor. Um registro local <strong>não é protocolo oficial</strong>.</p></div>`;
  }
  function photoSafety(){
    return `<div class="panel warning"><strong>Antes de fotografar</strong><p>Registre estrutura, ambiente, obra ou equipamento. Evite fotografar usuários, trabalhadores sem autorização, prontuários, receitas, telas, documentos, nomes ou qualquer informação de saúde. Se uma pessoa aparecer, prefira refazer a foto sem ela.</p></div>`;
  }
  function sourceBox(){
    return `<section class="panel"><h3>Base oficial</h3>${sourceList(sources.participacao)}</section>`;
  }

  pages['participe-sus'] = () => `
    <div class="page">
      ${pageHead('Participe do SUS','Controle social não é só reclamar: é propor, acompanhar, registrar resultados e participar das decisões sobre o SUS.','Participação da sociedade')}
      <section class="panel success" style="margin-bottom:18px">
        <div class="callout"><span class="callout-icon">🤝</span><div><h2>Da observação à participação</h2><p>Use esta área para entender o controle social, organizar sugestões, documentar pequenas melhorias e preparar propostas. Registros feitos aqui só viram manifestação ou decisão oficial quando forem levados ao canal competente.</p></div></div>
      </section>
      <section class="nav-grid" aria-label="Opções de participação social">
        ${topics.map(([r,i,t,d])=>`<a class="nav-card" href="?p=${r}" data-route="${r}"><span class="icon-square" aria-hidden="true">${i}</span><span><strong>${t}</strong><p>${d}</p></span><span class="go">›</span></a>`).join('')}
      </section>
      <section class="panel soft" style="margin-top:18px"><h2>Importante</h2><p>Esta ferramenta ajuda a <strong>organizar informação comunitária</strong>. Ela não transforma estimativas de preço em prestação de contas oficial, não substitui ata de Conselho e não envia denúncias automaticamente.</p></section>
    </div>`;

  pages['participacao-controle'] = () => `
    <div class="page">
      ${participationHead('Controle social','Como a população participa da gestão do SUS por Conselhos, Conferências e outros espaços de participação.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>O que é controle social no SUS?</h2><p>A Lei nº 8.142/1990 estabelece, em cada esfera de governo, a <strong>Conferência de Saúde</strong> e o <strong>Conselho de Saúde</strong> como instâncias colegiadas de participação da comunidade. A Resolução CNS nº 453/2012 detalha o funcionamento dos Conselhos e reconhece a existência de Conselhos Regionais, Locais e Distritais vinculados à estrutura correspondente.</p></section>
        <section class="panel"><h2>Conselho de Saúde</h2><ul class="law-list"><li><strong>É permanente e deliberativo.</strong> Participa da formulação de estratégias e do controle da execução da política de saúde.</li><li><strong>Acompanha e fiscaliza.</strong> Entre suas competências estão acompanhar a gestão, avaliar serviços e fiscalizar aspectos econômicos e financeiros.</li><li><strong>Reuniões devem favorecer participação.</strong> A Resolução 453 determina reuniões plenárias abertas ao público e em condições que possibilitem participação da sociedade.</li><li><strong>Usuários têm representação paritária.</strong> A diretriz nacional prevê 50% das vagas para entidades e movimentos representativos de usuários.</li></ul></section>
        <section class="panel"><h2>Conferência de Saúde</h2><p>A Conferência reúne diferentes segmentos sociais para avaliar a situação de saúde e propor diretrizes para a política de saúde. Pela Lei 8.142/1990, ocorre ordinariamente a cada quatro anos, sem impedir convocações extraordinárias.</p></section>
        <section class="panel success"><h2>Como participar melhor</h2><div class="steps"><div class="step"><div><strong>Leve um fato concreto</strong><p>Descreva o problema, local, impacto e quando foi observado.</p></div></div><div class="step"><div><strong>Leve evidência adequada</strong><p>Fotos de estrutura, documentos públicos, protocolos e registros podem ajudar, sempre respeitando privacidade.</p></div></div><div class="step"><div><strong>Transforme em proposta</strong><p>Explique o que deveria mudar e qual resultado espera.</p></div></div><div class="step"><div><strong>Acompanhe a decisão</strong><p>Registre se foi encaminhada, aprovada, executada ou se recebeu justificativa.</p></div></div></div></section>
        ${participationBack()}
      </div><div class="side-stack">${sourceBox()}${sideBox('Quer agir agora?','Você pode organizar uma proposta antes de levá-la a uma reunião.',[['participacao-proposta','Montar uma proposta'],['participacao-sugerir','Registrar uma melhoria']])}</div></div>
    </div>`;

  pages['participacao-sugerir'] = () => `
    <div class="page">
      ${participationHead('Sugira uma melhoria','Registre uma necessidade percebida e organize uma sugestão. Nada é enviado automaticamente.')}
      <div class="content-grid"><div class="content-stack">
        ${localDataNotice()}
        ${photoSafety()}
        <section class="panel"><h2>Nova sugestão</h2>
          <form id="suggestionForm" class="participation-form">
            <label>O que precisa melhorar?<input name="title" required maxlength="120" placeholder="Ex.: iluminação da área de convivência"></label>
            <label>Onde?<input name="place" maxlength="120" placeholder="Ex.: área externa, recepção, banheiro"></label>
            <label>Qual é o problema?<textarea name="problem" required maxlength="1200" rows="4" placeholder="Descreva o que acontece hoje."></textarea></label>
            <label>Qual melhoria você sugere?<textarea name="suggestion" required maxlength="1200" rows="4" placeholder="Descreva uma solução possível."></textarea></label>
            <div class="form-grid two"><label>Área<select name="category"><option>Acessibilidade</option><option>Segurança</option><option>Conforto</option><option>Atendimento</option><option>Infraestrutura</option><option>Convivência</option><option>Outra</option></select></label><label>Prioridade percebida<select name="priority"><option>Baixa</option><option selected>Média</option><option>Alta</option></select></label></div>
            <label>Foto opcional do local<input name="photo" type="file" accept="image/*" capture="environment"><span class="field-help">A imagem será reduzida e guardada apenas neste aparelho.</span></label>
            <label class="check-row"><input name="safePhoto" type="checkbox" required> <span>Confirmo que não estou incluindo prontuário, documento, nome, informação clínica ou pessoa identificável sem autorização.</span></label>
            <button class="btn" type="submit">Salvar neste aparelho</button>
          </form>
          <div id="suggestionFeedback" class="form-feedback" aria-live="polite"></div>
        </section>
        <section class="panel"><h2>Últimas sugestões neste aparelho</h2><div id="suggestionList" class="local-records"><p>Carregando...</p></div></section>
        ${participationBack()}
      </div><div class="side-stack">${sideBox('Depois de registrar','Se você decidir formalizar, leve a sugestão ao espaço adequado: gestão, Conselho de Saúde ou Ouvidoria, conforme o objetivo.',[['participacao-proposta','Transformar em proposta'],['ouvsus','Entender a OuvSUS']])}${sourceBox()}</div></div>
    </div>`;

  pages['participacao-antes-depois'] = () => `
    <div class="page">
      ${participationHead('Antes e depois','Documente pequenas melhorias de estrutura com fotos, datas, valores informados e origem da informação.')}
      <div class="content-grid"><div class="content-stack">
        ${localDataNotice()}
        ${photoSafety()}
        <section class="panel"><h2>Registrar melhoria</h2>
          <form id="improvementForm" class="participation-form">
            <label>Título da melhoria<input name="title" required maxlength="120" placeholder="Ex.: pintura da sala de atividades"></label>
            <label>Local<input name="place" maxlength="120" placeholder="Ex.: CAPS / sala / área externa"></label>
            <label>Descrição<textarea name="description" maxlength="1200" rows="3" placeholder="O que foi ou será feito?"></textarea></label>
            <div class="form-grid two"><label>Status<select name="status"><option>Identificada</option><option>Apresentada</option><option>Em análise</option><option>Autorizada</option><option>Em execução</option><option selected>Concluída</option><option>Não realizada</option></select></label><label>Origem do recurso<input name="resourceOrigin" maxlength="120" placeholder="Ex.: PAFUS, doação, recurso público"></label></div>
            <div class="form-grid two"><label>Data de início<input name="startDate" type="date"></label><label>Data de conclusão<input name="endDate" type="date"></label></div>
            <div class="form-grid two"><label>Materiais utilizados<textarea name="materials" maxlength="700" rows="3"></textarea></label><label>Valor informado dos materiais (R$)<input name="materialValue" type="number" min="0" step="0.01" inputmode="decimal"></label></div>
            <div class="form-grid two"><label>Mão de obra / forma de execução<textarea name="labor" maxlength="700" rows="3" placeholder="Ex.: voluntária, contratada, equipe própria"></textarea></label><label>Valor informado da mão de obra (R$)<input name="laborValue" type="number" min="0" step="0.01" inputmode="decimal"></label></div>
            <label>Fonte da informação sobre valores e recurso<select name="infoSource"><option value="nao-informada">Não informada</option><option value="documento">Documento/comprovante consultado</option><option value="responsavel">Informado por responsável</option><option value="comunitaria">Informação comunitária ainda não confirmada</option><option value="estimativa">Estimativa — não é valor oficial</option></select></label>
            <div class="form-grid two"><label>Foto do antes<input name="beforePhoto" type="file" accept="image/*" capture="environment"></label><label>Foto do depois<input name="afterPhoto" type="file" accept="image/*" capture="environment"></label></div>
            <label>Observações<textarea name="notes" maxlength="1200" rows="3"></textarea></label>
            <label class="check-row"><input name="safePhoto" type="checkbox" required> <span>Confirmo que as fotos focam estrutura/ambiente e não expõem informação de saúde ou pessoa identificável sem autorização.</span></label>
            <button class="btn" type="submit">Salvar antes e depois</button>
          </form>
          <div id="improvementFeedback" class="form-feedback" aria-live="polite"></div>
        </section>
        <section class="panel"><h2>Melhorias registradas neste aparelho</h2><div id="improvementList" class="local-records"><p>Carregando...</p></div></section>
        ${participationBack()}
      </div><div class="side-stack"><section class="panel warning"><h3>Valor informado ≠ prestação de contas</h3><p>O aplicativo mostra a <strong>origem declarada da informação</strong>. Somente documento oficial, comprovante ou prestação de contas do responsável pode confirmar gasto público.</p></section>${sourceBox()}</div></div>
    </div>`;

  pages['participacao-demandas'] = () => `
    <div class="page">
      ${participationHead('Acompanhe as demandas','Reúna em um único lugar as sugestões, melhorias e propostas salvas neste aparelho.')}
      <div class="content-grid"><div class="content-stack">
        ${localDataNotice()}
        <section class="panel"><div class="record-toolbar"><div><h2>Registros locais</h2><p>Use o status como memória de acompanhamento. Ele não significa que um órgão público reconheceu o registro.</p></div><button id="exportParticipation" class="btn secondary" type="button">Exportar JSON</button></div><div id="allParticipationRecords" class="local-records"><p>Carregando...</p></div></section>
        ${participationBack()}
      </div><div class="side-stack">${sideBox('Ciclo sugerido','Identificada → apresentada → em análise → autorizada → em execução → concluída. Use apenas o status que você realmente consegue comprovar.',[['participacao-sugerir','Nova sugestão'],['participacao-antes-depois','Registrar melhoria']])}</div></div>
    </div>`;

  pages['participacao-proposta'] = () => `
    <div class="page">
      ${participationHead('Leve uma proposta ao Conselho','Organize uma ideia em problema, evidência, proposta e resultado esperado. O texto fica salvo apenas neste aparelho.')}
      <div class="content-grid"><div class="content-stack">
        ${localDataNotice()}
        <section class="panel"><h2>Montar proposta</h2>
          <form id="proposalForm" class="participation-form">
            <label>Título<input name="title" required maxlength="120" placeholder="Ex.: melhorar cobertura da área externa"></label>
            <label>Qual é o problema?<textarea name="problem" required maxlength="1500" rows="4"></textarea></label>
            <label>Quem é afetado?<textarea name="affected" maxlength="900" rows="3"></textarea></label>
            <label>Que evidência existe?<textarea name="evidence" maxlength="1200" rows="3" placeholder="Ex.: observação repetida, fotos de estrutura, protocolo, documento público"></textarea></label>
            <label>O que você propõe?<textarea name="proposal" required maxlength="1500" rows="4"></textarea></label>
            <label>Qual resultado espera?<textarea name="expected" maxlength="1200" rows="3"></textarea></label>
            <button class="btn" type="submit">Gerar e salvar proposta</button>
          </form>
          <div id="proposalFeedback" class="form-feedback" aria-live="polite"></div>
          <div id="proposalOutput"></div>
        </section>
        <section class="panel"><h2>Propostas salvas neste aparelho</h2><div id="proposalList" class="local-records"><p>Carregando...</p></div></section>
        ${participationBack()}
      </div><div class="side-stack">${sourceBox()}${sideBox('Depois','Você pode copiar o texto e levá-lo a uma reunião, gestão ou outro espaço adequado. A ferramenta não protocola automaticamente.',[['participacao-controle','Entender controle social']])}</div></div>
    </div>`;

  pages['participacao-agenda'] = () => `
    <div class="page">
      ${participationHead('Agenda e participação','Como se preparar para participar sem publicar datas ou horários que não foram oficialmente verificados.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>Antes da reunião</h2><ul class="tip-list"><li><strong>Confirme a agenda na fonte responsável.</strong> Datas, locais e pautas podem mudar.</li><li><strong>Leia a pauta quando disponível.</strong> Veja onde sua demanda se encaixa.</li><li><strong>Leve uma proposta curta.</strong> Problema, evidência, solução e resultado esperado.</li><li><strong>Registre o encaminhamento.</strong> Anote o que foi decidido e quem ficou responsável por cada próximo passo.</li></ul></section>
        <section class="panel success"><h2>Reunião aberta e participação</h2><p>A Resolução CNS nº 453/2012 determina que as reuniões plenárias dos Conselhos de Saúde sejam abertas ao público e ocorram em espaços e horários que possibilitem a participação da sociedade. Regras específicas de fala, inscrição e funcionamento podem estar no regimento da instância local.</p></section>
        <section class="panel soft"><h2>Agenda local no futuro</h2><p>Uma próxima versão poderá exibir agenda verificada de Conselhos e reuniões, desde que haja uma fonte responsável e data de atualização. Esta versão evita inventar ou manter calendário desatualizado.</p></section>
        ${participationBack()}
      </div><div class="side-stack">${sourceBox()}${sideBox('Prepare sua fala','Monte a proposta antes de participar.',[['participacao-proposta','Montar proposta']])}</div></div>
    </div>`;

  // Atualiza a página de privacidade porque o módulo passa a aceitar registros e fotos opcionais.
  pages.privacidade = () => `
    <div class="page">
      ${pageHead('Privacidade','O RAPS no Bolso continua sem login e sem cadastro clínico. O módulo de participação pode guardar textos e fotos localmente no seu próprio aparelho.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>O que esta versão não pede</h2><ul class="tip-list"><li>Nome ou conta de usuário.</li><li>Relato clínico ou diário de consumo.</li><li>Prontuário.</li><li>Localização GPS.</li></ul></section>
        <section class="panel success"><h2>Registros de participação</h2><p>Quando você usa “Sugira uma melhoria”, “Antes e depois” ou “Leve uma proposta ao Conselho”, os dados são armazenados por <strong>IndexedDB no navegador deste aparelho</strong>. Nesta versão não existe servidor para receber esses registros.</p><p>Fotos são opcionais e também ficam localmente. Evite incluir pessoas identificáveis, documentos, prontuários, telas ou informações de saúde.</p></section>
        <section class="panel warning"><h2>Apagar dados</h2><p>Limpar os dados do site/PWA no navegador ou desinstalar o aplicativo pode apagar os registros locais. Por isso existe a opção de exportar os registros em JSON antes de limpar o armazenamento.</p></section>
        <section class="panel soft"><h2>Links externos</h2><p>Ao abrir sites oficiais externos, passam a valer as políticas e tecnologias do serviço acessado. Este protótipo não controla esses sites.</p></section>
      </div><div class="side-stack">${sideBox('Voltar ao início','Escolha outra área do aplicativo.',[['inicio','Ir para o início'],['participe-sus','Participe do SUS']])}</div></div>
    </div>`;

  function openDb(){
    return new Promise((resolve,reject)=>{
      const request=indexedDB.open(PARTICIPATION_DB,DB_VERSION);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(PARTICIPATION_STORE)){
          const store=db.createObjectStore(PARTICIPATION_STORE,{keyPath:'id'});
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
      const tx=db.transaction(PARTICIPATION_STORE,'readwrite');
      tx.objectStore(PARTICIPATION_STORE).put(record);
      tx.oncomplete=()=>{db.close();resolve(record)};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  async function deleteRecord(recordId){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(PARTICIPATION_STORE,'readwrite');
      tx.objectStore(PARTICIPATION_STORE).delete(recordId);
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  async function allRecords(){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(PARTICIPATION_STORE,'readonly');
      const request=tx.objectStore(PARTICIPATION_STORE).getAll();
      request.onsuccess=()=>resolve(request.result.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))));
      request.onerror=()=>reject(request.error);
      tx.oncomplete=()=>db.close();
    });
  }
  async function recordsByType(type){
    return (await allRecords()).filter(r=>r.type===type);
  }
  async function compressImage(file){
    if(!file || !file.type?.startsWith('image/')) return null;
    const bitmap = await createImageBitmap(file);
    const max=1280;
    const ratio=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*ratio));
    canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
    const ctx=canvas.getContext('2d');
    ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
    bitmap.close?.();
    return await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.78));
  }
  function blobUrl(blob){ return blob ? URL.createObjectURL(blob) : ''; }
  function statusPill(status='Registrada'){
    return `<span class="record-status">${esc(status)}</span>`;
  }
  function recordActions(recordId){
    return `<div class="record-actions"><button class="mini-action" type="button" data-delete-participation="${esc(recordId)}">Apagar deste aparelho</button></div>`;
  }
  function suggestionCard(r){
    const img=r.photo?`<img class="record-photo single" src="${blobUrl(r.photo)}" alt="Foto da sugestão registrada localmente">`:'';
    return `<article class="record-card"><div class="record-head"><div><strong>${esc(r.title)}</strong><small>${esc(r.place||'Local não informado')} • ${fmtDateTime(r.createdAt)}</small></div>${statusPill(r.status||'Registrada')}</div>${img}<p><strong>Problema:</strong> ${esc(r.problem)}</p><p><strong>Sugestão:</strong> ${esc(r.suggestion)}</p><div class="record-meta"><span>${esc(r.category||'Outra')}</span><span>Prioridade: ${esc(r.priority||'Média')}</span></div>${recordActions(r.id)}</article>`;
  }
  function improvementCard(r){
    const before=r.beforePhoto?`<figure><img src="${blobUrl(r.beforePhoto)}" alt="Foto do antes"><figcaption>Antes</figcaption></figure>`:'';
    const after=r.afterPhoto?`<figure><img src="${blobUrl(r.afterPhoto)}" alt="Foto do depois"><figcaption>Depois</figcaption></figure>`:'';
    const photos=(before||after)?`<div class="photo-pair">${before}${after}</div>`:'';
    const total=(Number(r.materialValue||0)+Number(r.laborValue||0));
    return `<article class="record-card"><div class="record-head"><div><strong>${esc(r.title)}</strong><small>${esc(r.place||'Local não informado')} • salvo ${fmtDateTime(r.createdAt)}</small></div>${statusPill(r.status)}</div>${photos}<p>${esc(r.description||'Sem descrição adicional.')}</p><div class="record-costs"><div><small>Materiais</small><strong>${money(r.materialValue)}</strong></div><div><small>Mão de obra</small><strong>${money(r.laborValue)}</strong></div><div><small>Total informado</small><strong>${money(total)}</strong></div></div><p><strong>Período:</strong> ${fmtDate(r.startDate)} → ${fmtDate(r.endDate)}</p><p><strong>Origem do recurso:</strong> ${esc(r.resourceOrigin||'Não informada')}</p><p><strong>Fonte dos valores:</strong> ${esc(r.infoSourceLabel||'Não informada')}</p>${r.materials?`<p><strong>Materiais:</strong> ${esc(r.materials)}</p>`:''}${r.labor?`<p><strong>Execução:</strong> ${esc(r.labor)}</p>`:''}${r.notes?`<p><strong>Observações:</strong> ${esc(r.notes)}</p>`:''}${recordActions(r.id)}</article>`;
  }
  function proposalText(r){
    return `PROPOSTA — ${r.title}\n\nProblema: ${r.problem}\n\nQuem é afetado: ${r.affected||'Não informado'}\n\nEvidências: ${r.evidence||'Não informadas'}\n\nProposta: ${r.proposal}\n\nResultado esperado: ${r.expected||'Não informado'}`;
  }
  function proposalCard(r){
    return `<article class="record-card"><div class="record-head"><div><strong>${esc(r.title)}</strong><small>${fmtDateTime(r.createdAt)}</small></div>${statusPill('Rascunho local')}</div><p><strong>Problema:</strong> ${esc(r.problem)}</p><p><strong>Proposta:</strong> ${esc(r.proposal)}</p><div class="record-actions"><button class="mini-action" type="button" data-copy-proposal="${esc(r.id)}">Copiar texto</button><button class="mini-action" type="button" data-delete-participation="${esc(r.id)}">Apagar</button></div></article>`;
  }
  function genericCard(r){
    if(r.type==='suggestion')return suggestionCard(r);
    if(r.type==='improvement')return improvementCard(r);
    if(r.type==='proposal')return proposalCard(r);
    return '';
  }
  function emptyState(text){return `<div class="empty-local"><strong>Nenhum registro ainda.</strong><p>${esc(text)}</p></div>`}

  async function hydrateParticipationUI(){
    const route=currentRoute();
    try{
      if(route==='participacao-sugerir'){
        const el=document.getElementById('suggestionList'); if(el){const rows=await recordsByType('suggestion');el.innerHTML=rows.length?rows.map(suggestionCard).join(''):emptyState('Sua primeira sugestão aparecerá aqui.');}
      }
      if(route==='participacao-antes-depois'){
        const el=document.getElementById('improvementList'); if(el){const rows=await recordsByType('improvement');el.innerHTML=rows.length?rows.map(improvementCard).join(''):emptyState('Registre uma melhoria para criar o primeiro antes e depois.');}
      }
      if(route==='participacao-proposta'){
        const el=document.getElementById('proposalList'); if(el){const rows=await recordsByType('proposal');el.innerHTML=rows.length?rows.map(proposalCard).join(''):emptyState('As propostas que você montar ficarão aqui.');}
      }
      if(route==='participacao-demandas'){
        const el=document.getElementById('allParticipationRecords'); if(el){const rows=await allRecords();el.innerHTML=rows.length?rows.map(genericCard).join(''):emptyState('Sugestões, melhorias e propostas salvas aparecerão aqui.');}
      }
    }catch(err){
      document.querySelectorAll('.local-records').forEach(el=>el.innerHTML='<div class="panel danger">Não foi possível abrir o armazenamento local neste navegador.</div>');
      console.error(err);
    }
  }

  async function handleSuggestion(form){
    const fd=new FormData(form);
    const photoFile=form.elements.photo.files?.[0];
    const record={id:id(),type:'suggestion',createdAt:new Date().toISOString(),status:'Registrada localmente',title:fd.get('title'),place:fd.get('place'),problem:fd.get('problem'),suggestion:fd.get('suggestion'),category:fd.get('category'),priority:fd.get('priority'),photo:photoFile?await compressImage(photoFile):null};
    await saveRecord(record); form.reset();
    document.getElementById('suggestionFeedback').innerHTML='<div class="panel success">✓ Sugestão salva somente neste aparelho. Para virar protocolo ou decisão, ela ainda precisa ser apresentada ao canal adequado.</div>';
    await hydrateParticipationUI();
  }
  async function handleImprovement(form){
    const fd=new FormData(form);
    const sourceLabels={'nao-informada':'Não informada','documento':'Documento/comprovante consultado','responsavel':'Informado por responsável','comunitaria':'Informação comunitária ainda não confirmada','estimativa':'Estimativa — não é valor oficial'};
    const before=form.elements.beforePhoto.files?.[0], after=form.elements.afterPhoto.files?.[0];
    const record={id:id(),type:'improvement',createdAt:new Date().toISOString(),title:fd.get('title'),place:fd.get('place'),description:fd.get('description'),status:fd.get('status'),resourceOrigin:fd.get('resourceOrigin'),startDate:fd.get('startDate'),endDate:fd.get('endDate'),materials:fd.get('materials'),materialValue:fd.get('materialValue'),labor:fd.get('labor'),laborValue:fd.get('laborValue'),infoSource:fd.get('infoSource'),infoSourceLabel:sourceLabels[fd.get('infoSource')]||'Não informada',notes:fd.get('notes'),beforePhoto:before?await compressImage(before):null,afterPhoto:after?await compressImage(after):null};
    await saveRecord(record); form.reset();
    document.getElementById('improvementFeedback').innerHTML='<div class="panel success">✓ Melhoria salva localmente. Valores continuam identificados como “informados” e não como prestação de contas oficial.</div>';
    await hydrateParticipationUI();
  }
  async function handleProposal(form){
    const fd=new FormData(form);
    const record={id:id(),type:'proposal',createdAt:new Date().toISOString(),title:fd.get('title'),problem:fd.get('problem'),affected:fd.get('affected'),evidence:fd.get('evidence'),proposal:fd.get('proposal'),expected:fd.get('expected')};
    await saveRecord(record);
    const text=proposalText(record);
    document.getElementById('proposalFeedback').innerHTML='<div class="panel success">✓ Rascunho salvo neste aparelho.</div>';
    document.getElementById('proposalOutput').innerHTML=`<section class="proposal-output"><h3>Texto organizado</h3><pre>${esc(text)}</pre><button class="btn secondary" type="button" data-copy-text="${encodeURIComponent(text)}">Copiar texto</button></section>`;
    form.reset(); await hydrateParticipationUI();
  }

  document.addEventListener('submit', async e=>{
    const form=e.target;
    if(!['suggestionForm','improvementForm','proposalForm'].includes(form.id))return;
    e.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Salvando...';}
    try{
      if(form.id==='suggestionForm')await handleSuggestion(form);
      if(form.id==='improvementForm')await handleImprovement(form);
      if(form.id==='proposalForm')await handleProposal(form);
    }catch(err){
      const feedback=document.getElementById(form.id.replace('Form','Feedback'));
      if(feedback)feedback.innerHTML='<div class="panel danger">Não foi possível salvar. Verifique o espaço disponível no aparelho e tente novamente.</div>';
      console.error(err);
    }finally{
      if(button){button.disabled=false;button.textContent=form.id==='proposalForm'?'Gerar e salvar proposta':form.id==='improvementForm'?'Salvar antes e depois':'Salvar neste aparelho';}
    }
  });

  document.addEventListener('click', async e=>{
    const del=e.target.closest('[data-delete-participation]');
    if(del){
      if(confirm('Apagar este registro somente deste aparelho?')){await deleteRecord(del.dataset.deleteParticipation);await hydrateParticipationUI();}
      return;
    }
    const copy=e.target.closest('[data-copy-text]');
    if(copy){await navigator.clipboard.writeText(decodeURIComponent(copy.dataset.copyText));copy.textContent='Copiado ✓';return;}
    const copyProposal=e.target.closest('[data-copy-proposal]');
    if(copyProposal){const rows=await allRecords();const r=rows.find(x=>x.id===copyProposal.dataset.copyProposal);if(r){await navigator.clipboard.writeText(proposalText(r));copyProposal.textContent='Copiado ✓';}return;}
    const exportBtn=e.target.closest('#exportParticipation');
    if(exportBtn){
      const rows=await allRecords();
      const clean=rows.map(({photo,beforePhoto,afterPhoto,...rest})=>({...rest,hasPhoto:Boolean(photo),hasBeforePhoto:Boolean(beforePhoto),hasAfterPhoto:Boolean(afterPhoto)}));
      const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),records:clean},null,2)],{type:'application/json'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`raps-participacao-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return;
    }
    if(e.target.closest('[data-route]'))setTimeout(hydrateParticipationUI,0);
  });
  window.addEventListener('popstate',()=>setTimeout(hydrateParticipationUI,0));
  setTimeout(hydrateParticipationUI,0);
})();
