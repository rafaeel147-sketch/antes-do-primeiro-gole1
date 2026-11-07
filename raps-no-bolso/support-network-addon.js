// Piloto municipal: Rede de Apoio, acesso livre e apoio a urgência psiquiátrica.
// Não envia mensagens automaticamente nem rastreia terceiros. Não integra prontuário SUS.
(() => {
  'use strict';
  const VERSION = 'goiania-rede-apoio-1';
  const CONFIG_KEY = 'raps-goiania-rede-apoio-v1';
  const FIRST_KEY = 'raps-goiania-primeira-entrada-v1';
  const CITY = 'Goiânia - GO';
  const PSYCHIATRY = {
    name: 'Pronto-Socorro Psiquiátrico Professor Wassily Chuc',
    address: 'Avenida C 107, nº 3642, Jardim América, Goiânia - GO',
    phone: '6230304124',
    source: 'https://saude.goiania.go.gov.br/sobre-a-secretaria/consultas-sus/centros-de-atencao-psicossocial-caps/'
  };
  let destination = null;
  let locationFix = null;
  let currentFlow = null;
  let demoContacts = null;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const get = id => document.getElementById(id);
  const plain = value => String(value || '').trim().slice(0, 240);
  const phoneDigits = value => String(value || '').replace(/[^\d]/g,'');
  const timeLabel = date => new Date(date).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const blank = () => ({name:'', phone:'', email:'', channel:'whatsapp', informed:false});
  function readConfig() {
    try {
      const obj = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
      return obj && obj.version === VERSION && Array.isArray(obj.contacts) ? obj : {version:VERSION, contacts:[], intervalMinutes:5};
    } catch (_) { return {version:VERSION, contacts:[], intervalMinutes:5}; }
  }
  function contactReady(c) {
    const tel = phoneDigits(c.phone);
    const email = String(c.email||'').trim();
    return Boolean(c.name && c.informed && ((tel.length>=10 && tel.length<=13) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)));
  }
  function contactsForFlow(){
    return demoContacts || readConfig().contacts.filter(contactReady).slice(0,4);
  }
  function routeUrl(name, address) {
    return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(address || name);
  }
  function currentDestination() {
    return destination || {name:'Atendimento a definir em Goiânia',address:'',kind:'indefinido'};
  }
  function formatMessage(c) {
    const d = currentFlow?.destination || currentDestination();
    const created = currentFlow?.createdAt || Date.now();
    const name = c?.name ? 'Olá, '+c.name+'. ' : 'Olá. ';
    const where = d.address ? '\nEndereço: '+d.address+'\nRota: '+routeUrl(d.name,d.address) : '\nDestino ainda não definido.';
    const coordinates = (currentFlow?.includeLocation && locationFix) ?
      '\nPosição no momento do aviso: https://www.google.com/maps?q='+locationFix.lat+','+locationFix.lng :
      '';
    return name+'Uma pessoa que cadastrou você como contato de confiança está procurando atendimento pelo RAPS no Bolso.'+
      '\nServiço escolhido: '+d.name+where+
      '\nHorário da solicitação: '+new Date(created).toLocaleString('pt-BR')+
      coordinates+
      '\nPedido: por favor, entre em contato comigo quando puder.'+
      '\nMensagem preparada no aparelho; não é um aviso oficial do SUS.';
  }
  function sendLinks(c) {
    if (!c) return '';
    const tel = phoneDigits(c.phone);
    const hasTel = tel.length>=10 && tel.length<=13;
    const brTel = tel.startsWith('55') ? tel : '55'+tel;
    const msg = encodeURIComponent(formatMessage(c));
    const address = String(c.email||'').trim();
    const items = [];
    if (hasTel) {
      items.push('<a class="btn" data-external-channel="WhatsApp" href="https://wa.me/'+brTel+'?text='+msg+'" target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a>');
      items.push('<a class="btn secondary" data-external-channel="SMS" href="sms:+'+brTel+'?body='+msg+'">Abrir SMS</a>');
      items.push('<a class="btn secondary" data-external-channel="Telefone" href="tel:+'+brTel+'">Ligar</a>');
    }
    if (address && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      items.push('<a class="btn secondary" data-external-channel="E-mail" href="mailto:'+encodeURIComponent(address)+'?subject='+encodeURIComponent('Pedido de apoio — RAPS no Bolso')+'&body='+msg+'">Abrir e-mail</a>');
    }
    const preferred = navigator.onLine === false ? 'SMS' : ({whatsapp:'WhatsApp',sms:'SMS',email:'E-mail',telefone:'Telefone'})[c.channel] || 'WhatsApp';
    return items.sort((a,b)=>Number(!a.includes('data-external-channel="'+preferred+'"'))-Number(!b.includes('data-external-channel="'+preferred+'"'))).join('');
  }
  function psychiatryCard() {
    return '<a class="nav-card priority-service-choice" href="?p=urgencia-psiquiatrica" data-route="urgencia-psiquiatrica" data-service-kind="psiquiatria"><span class="icon-square" aria-hidden="true">🧠</span><span><strong>Urgência psiquiátrica 24h</strong><p>Crise ou surto: orientação e atendimento no pronto-socorro psiquiátrico. Risco imediato: SAMU 192.</p></span><span class="go" aria-hidden="true">›</span></a>';
  }
  const originalHelp = pages['onde-ajuda'];
  pages['onde-ajuda'] = () => originalHelp().replace(
    '<section class="priority-service-grid" aria-label="Serviços apresentados pela urgência da necessidade">',
    '<section class="priority-service-grid" aria-label="Serviços apresentados pela urgência da necessidade">'+psychiatryCard()
  ).replace(
    '<p class="home-note">Confirme horários',
    '<section class="panel soft"><h3>Precisa avisar alguém?</h3><p>Você pode utilizar a rede de apoio, mas não precisa cadastrar contatos para receber atendimento.</p>'+link('rede-apoio','Minha rede de apoio','btn secondary')+'</section><p class="home-note">Confirme horários'
  );
  const originalCrisis = pages.crise;
  pages.crise = () => originalCrisis().replace(
    '<section class="panel soft priority-crisis-shortcut">',
    '<section class="panel priority-crisis-psychiatric"><h2>Crise ou surto psiquiátrico?</h2><p>Goiânia possui pronto-socorro psiquiátrico com atendimento 24h. Se houver risco imediato à vida ou à segurança, ligue 192.</p>'+link('urgencia-psiquiatrica','Ver urgência psiquiátrica 24h','btn')+'</section><section class="panel soft priority-crisis-shortcut">'
  );

  pages['urgencia-psiquiatrica'] = () => '<div class="page">'+
    emergencyStrip()+
    pageHead('Urgência psiquiátrica 24h','Para crise ou surto em saúde mental. A avaliação da equipe define observação, cuidado e encaminhamento.','Goiânia — piloto')+
    '<section class="panel warning"><h2>'+esc(PSYCHIATRY.name)+'</h2>'+
    '<p>Referência municipal para situações de crise; atendimento informado pela SMS como 24 horas, todos os dias.</p>'+
    '<p><strong>Endereço publicado pela SMS:</strong> '+esc(PSYCHIATRY.address)+'</p>'+
    '<p><strong>Telefone divulgado:</strong> (62) 3030-4124. Há diferenças de endereço e telefone entre páginas oficiais: confirme antes de sair quando possível.</p>'+
    '<p>Se há risco imediato, não aguarde confirmação de mapa, GPS ou rede de apoio: ligue 192.</p>'+
    '<div class="hero-actions"><a class="btn danger" href="tel:192">SAMU 192</a>'+
    '<a class="btn secondary" href="'+routeUrl(PSYCHIATRY.name,PSYCHIATRY.address)+'" target="_blank" rel="noopener noreferrer">Traçar rota ↗</a>'+
    '<a class="btn secondary" href="tel:'+PSYCHIATRY.phone+'">Ligar para a unidade</a>'+
    '<a class="btn secondary" href="'+PSYCHIATRY.source+'" target="_blank" rel="noopener noreferrer">Verificar fonte SMS ↗</a></div></section>'+
    '<section class="panel soft"><h2>Se quiser, avise alguém</h2><p>O acesso ao atendimento não depende de ter telefone, cadastro ou contato de confiança.</p>'+
    '<a class="btn" href="?p=rede-apoio-aviso" data-route="rede-apoio-aviso" data-support-name="'+esc(PSYCHIATRY.name)+'" data-support-address="'+esc(PSYCHIATRY.address)+'">Preparar aviso de deslocamento</a></section>'+
    '</div>';

  function firstEntry(){
    try { return !localStorage.getItem(FIRST_KEY); } catch (_) { return false; }
  }
  function firstEntryPanel() {
    return '<section class="panel support-first-entry" aria-label="Primeiro acesso ao RAPS no Bolso">'+
      '<h2>Você escolhe como começar</h2><p>Sem conta, CPF ou cadastro obrigatório. Município piloto: Goiânia.</p>'+
      '<div class="hero-actions">'+
      link('onde-ajuda','Encontrar atendimento sem cadastro','btn')+
      link('rede-apoio','Configurar rede de apoio','btn secondary')+
      link('urgencia-psiquiatrica','Urgência psiquiátrica 24h','btn secondary')+
      '</div><button type="button" class="mini-action" id="supportSkipOnboarding">Entendi, não mostrar novamente</button></section>';
  }
  const originalHome = pages.inicio;
  pages.inicio = () => originalHome().replace(
    '<section class="nav-grid home-grid"',
    (firstEntry()? firstEntryPanel() : '')+'<section class="nav-grid home-grid"'
  ).replace(
    '<p class="home-note">Guia educativo gratuito.',
    '<section class="panel soft"><h2>Minha rede de apoio</h2><p>Cadastre até quatro pessoas de confiança ou use o aplicativo sem contatos.</p>'+link('rede-apoio','Gerenciar contatos e avisos','btn secondary')+'</section><p class="home-note">Guia educativo gratuito.'
  );
  const originalRenderNav = renderNav;
  renderNav = function () {
    originalRenderNav();
    const node = get('drawerNav');
    if (!node || node.querySelector('[data-route="rede-apoio"]')) return;
    node.insertAdjacentHTML('beforeend',
      '<a class="drawer-link" data-route="urgencia-psiquiatrica" href="?p=urgencia-psiquiatrica">🧠 Urgência psiquiátrica 24h</a>'+
      '<a class="drawer-link" data-route="rede-apoio" href="?p=rede-apoio">👥 Minha rede de apoio</a>'
    );
  };
  function contactFields(c,i) {
    return '<fieldset class="panel support-contact"><legend>Contato '+(i+1)+(i===0?' — prioritário':'')+'</legend>'+
      '<label>Nome <input name="support-name-'+i+'" maxlength="80" autocomplete="off" value="'+esc(c.name||'')+'" placeholder="Nome ou apelido"></label>'+
      '<label>Telefone com DDD <input name="support-phone-'+i+'" type="tel" maxlength="20" autocomplete="off" value="'+esc(c.phone||'')+'" placeholder="62 9..."></label>'+
      '<label>E-mail (opcional) <input name="support-email-'+i+'" type="email" maxlength="160" autocomplete="off" value="'+esc(c.email||'')+'" placeholder="contato@exemplo.com"></label>'+
      '<label>Canal preferido <select name="support-channel-'+i+'">'+
      [['whatsapp','WhatsApp'],['sms','SMS'],['email','E-mail'],['telefone','Ligação']].map(([v,t])=>'<option value="'+v+'"'+(c.channel===v?' selected':'')+'>'+t+'</option>').join('')+
      '</select></label>'+
      '<label class="support-check"><input name="support-informed-'+i+'" type="checkbox" '+(c.informed?'checked':'')+'> Confirmei que esta pessoa concorda em receber meus avisos.</label>'+
      '</fieldset>';
  }
  pages['rede-apoio'] = () => {
    const saved=readConfig();
    const slots=Array.from({length:4},(_,i)=>saved.contacts[i]||blank());
    return '<div class="page">'+pageHead('Minha rede de apoio','Até quatro pessoas de confiança. O cadastro é opcional e não é necessário para encontrar cuidado.','Piloto Goiânia')+
      '<section class="panel warning"><h2>O que funciona nesta versão?</h2><p>Os contatos ficam somente neste navegador. O aplicativo prepara mensagens e abre WhatsApp, SMS, e-mail ou ligação. Não envia em segundo plano, não verifica entrega e não compartilha GPS continuamente.</p>'+
      '<p><strong>Em aparelho público ou compartilhado:</strong> não cadastre contatos; use o acesso livre. Não há login e os dados locais podem ser vistos por outras pessoas com acesso ao mesmo navegador.</p></section>'+
      '<form id="supportContactsForm" class="support-contacts-grid">'+slots.map(contactFields).join('')+
      '<section class="panel support-form-bottom"><label>Se não houver resposta, preparar o próximo contato após <select id="supportInterval" name="support-interval">'+
      [1,3,5,10,15].map(min=>'<option value="'+min+'"'+(saved.intervalMinutes===min?' selected':'')+'>'+min+' minuto'+(min===1?'':'s')+'</option>').join('')+'</select></label>'+
      '<p class="small">O relógio funciona enquanto o aplicativo estiver aberto; ao voltar, atualiza o prazo. Ele não envia mensagens sozinho.</p>'+
      '<label class="support-check"><input type="checkbox" id="supportStorageConsent"> Autorizo guardar esses contatos neste aparelho e afirmo que as pessoas cadastradas concordam em receber avisos.</label>'+
      '<div class="hero-actions"><button class="btn" type="submit">Salvar contatos neste aparelho</button>'+
      '<button class="btn secondary" type="button" id="supportDeleteContacts">Apagar todos os contatos</button></div>'+
      '<p class="small" id="supportSaveStatus" role="status" aria-live="polite"></p></section></form>'+
      '<section class="panel soft"><h2>Sem contatos? Tudo bem.</h2><p>Você pode buscar atendimento mesmo sem telefone, documentos ou cadastro.</p>'+
      '<div class="hero-actions">'+link('onde-ajuda','Encontrar atendimento','btn secondary')+
      link('rede-apoio-aviso','Preparar aviso / ver demonstração','btn secondary')+'</div></section></div>';
  };
  function dashboard(){
    const flow=currentFlow;
    if (!flow) return '<p>Nenhum pedido de apoio iniciado neste aparelho.</p>';
    const contacts=flow.demo ? demoContacts : contactsForFlow();
    const c=contacts[flow.index];
    if(flow.status==='responded') return '<div class="panel success"><h3>Resposta registrada pelo usuário</h3><p>Você marcou que recebeu uma resposta. Isso não é uma confirmação automática do destinatário.</p><button class="btn secondary" id="supportResetFlow" type="button">Encerrar</button></div>';
    if(flow.status==='ended') return '<p>Pedido encerrado.</p>';
    if(!c) return '<div class="panel warning"><h3>Nenhum contato restante</h3><p>O aplicativo não enviou avisos. Utilize o telefone 192 se houver risco imediato ou peça ajuda presencial.</p><button class="btn secondary" id="supportResetFlow" type="button">Encerrar pedido</button></div>';
    const seconds=Math.max(0,Math.ceil((flow.deadline-Date.now())/1000));
    return '<section class="panel support-active-flow" aria-live="polite">'+
      '<h2>'+(flow.demo?'Demonstração — ':'')+'Contato '+(flow.index+1)+' de '+contacts.length+': '+esc(c.name)+'</h2>'+
      '<p><strong>Tempo até preparar o próximo:</strong> <span id="supportCountdown">'+seconds+'</span> segundos.</p>'+
      '<p>Se ninguém responder, a próxima pessoa será apresentada automaticamente <strong>nesta tela</strong>. Você ainda precisará abrir o canal e confirmar o envio.</p>'+
      '<div class="support-active-message"><strong>Prévia do aviso</strong><p class="support-message-preview">'+esc(formatMessage(c))+'</p></div>'+
      '<div class="hero-actions">'+(flow.demo?'<button type="button" class="btn secondary" id="supportDemoSend">Simular abertura de canal</button>':sendLinks(c))+
      '<button type="button" class="btn secondary" id="supportNextContact">Próximo contato agora</button>'+
      '<button type="button" class="btn" id="supportMarkResponded">Eu recebi resposta</button>'+
      '<button type="button" class="btn secondary" id="supportResetFlow">Encerrar</button></div>'+
      '<p id="supportFlowStatus" class="small" role="status">'+(flow.lastAction?esc(flow.lastAction):'Nenhuma entrega foi confirmada.')+'</p>'+
      '</section>';
  }
  pages['rede-apoio-aviso'] = () => {
    const d=currentDestination();
    return '<div class="page">'+pageHead('Avisar minha rede de apoio','Escolha o serviço e autorize o que deseja compartilhar. O atendimento é livre mesmo sem contatos.','Goiânia — piloto')+
      emergencyStrip()+
      '<section class="panel"><h2>Destino do cuidado</h2><p id="supportDestinationName"><strong>'+esc(d.name)+'</strong>'+(d.address?' — '+esc(d.address):'')+'</p>'+
      '<div class="hero-actions">'+link('onde-ajuda','Escolher outro serviço','btn secondary')+
      '<a class="btn secondary" href="'+routeUrl(d.name,d.address)+'" target="_blank" rel="noopener noreferrer">Ver rota ↗</a></div>'+
      '<label class="support-check"><input type="checkbox" id="supportIncludeLocation"> Incluir minha posição atual na mensagem (opcional)</label>'+
      '<button type="button" class="btn secondary" id="supportGetLocation">Autorizar GPS para o aviso</button>'+
      '<p id="supportLocationStatus" role="status" class="small">Não solicitamos sua localização para abrir esta tela.</p></section>'+
      '<section class="panel"><h2>Avisar contato</h2><p>Uma mensagem pode conter informações sensíveis sobre seu deslocamento. Confirme que quer compartilhar com seus contatos cadastrados.</p>'+
      '<label class="support-check"><input type="checkbox" id="supportSendConsent"> Autorizo preparar mensagens de ajuda para meus contatos nesta solicitação.</label>'+
      '<div class="hero-actions"><button type="button" class="btn" id="supportStartFlow">Iniciar pedidos de apoio</button>'+
      '<button type="button" class="btn secondary" id="supportStartDemo">Testar com contatos fictícios — sem envio</button>'+
      link('rede-apoio','Cadastrar até 4 contatos','btn secondary')+'</div>'+
      '<p id="supportStartStatus" class="small" role="status"></p></section>'+
      '<div id="supportFlowContainer">'+dashboard()+'</div>'+
      '<section class="panel soft"><h2>Quando não tenho contato ou celular</h2><p>Procure ajuda diretamente pelo SUS. O uso do aplicativo não exige rede de apoio, endereço fixo, CPF ou cadastro. Equipes de Consultório na Rua e UBS integram as portas de cuidado.</p>'+
      link('onde-ajuda','Ver serviços de Goiânia','btn secondary')+'</section></div>';
  };
  function status(id,message){const el=get(id);if(el)el.textContent=message;}
  function persistFirst(){
    try {localStorage.setItem(FIRST_KEY,'1')} catch(_){}
  }
  function captureContact(form, i) {
    const field = name => form.elements.namedItem('support-'+name+'-'+i);
    const name=plain(field('name')?.value).slice(0,80);
    const phone=plain(field('phone')?.value);
    const email=plain(field('email')?.value).slice(0,160);
    const channel=String(field('channel')?.value||'whatsapp');
    const informed=Boolean(field('informed')?.checked);
    return {name,phone,email,channel: ['whatsapp','sms','email','telefone'].includes(channel)?channel:'whatsapp',informed};
  }
  function saveContacts(form){
    if(!get('supportStorageConsent')?.checked) {
      status('supportSaveStatus','Marque a autorização de armazenamento local antes de salvar.'); return;
    }
    const raw=Array.from({length:4},(_,i)=>captureContact(form,i));
    const contacts=raw.filter(c=>c.name||c.phone||c.email);
    const invalid=contacts.find(c=>!contactReady(c));
    if(invalid) {
      status('supportSaveStatus','Revise os contatos preenchidos: nome, telefone ou e-mail válido e confirmação de que concordam em receber avisos.');return;
    }
    try {
      localStorage.setItem(CONFIG_KEY,JSON.stringify({version:VERSION, contacts,intervalMinutes:Number(get('supportInterval')?.value)||5,updatedAt:new Date().toISOString()}));
      status('supportSaveStatus',contacts.length+' contato(s) salvo(s) somente neste navegador. Você pode apagá-los quando quiser.');
    } catch(_) {
      status('supportSaveStatus','Não foi possível salvar neste navegador. Use o atendimento sem cadastro.');
    }
  }
  function expireFlowIfNeeded(){
    if(!currentFlow||currentFlow.status!=='active')return;
    const contacts=currentFlow.demo ? demoContacts : contactsForFlow();
    const interval=currentFlow.intervalMinutes*60000;
    if(!interval)return;
    const now=Date.now();
    let skipped=0;
    while(currentFlow.deadline<=now && currentFlow.index<contacts.length && skipped<4) {
      currentFlow.index++;
      currentFlow.deadline += interval;
      skipped++;
      currentFlow.lastAction='Sem resposta registrada no aparelho. Próximo contato preparado — nenhum aviso enviado automaticamente.';
    }
  }
  function redrawFlow(){
    const c=get('supportFlowContainer');
    if(!c)return;
    expireFlowIfNeeded();
    c.innerHTML=dashboard();
  }
  function startFlow(demo){
    if(!demo && !get('supportSendConsent')?.checked){
      status('supportStartStatus','Autorize o compartilhamento nesta solicitação antes de iniciar.');return;
    }
    const contacts=demo?[
      {name:'Contato fictício 1',channel:'whatsapp'},
      {name:'Contato fictício 2',channel:'sms'},
      {name:'Contato fictício 3',channel:'email'},
      {name:'Contato fictício 4',channel:'telefone'}
    ]:contactsForFlow();
    if(!contacts.length) {
      status('supportStartStatus','Nenhum contato cadastrado. Cadastre alguém ou use a demonstração com dados fictícios.');return;
    }
    demoContacts=demo?contacts:null;
    const intervalMinutes=demo?1:readConfig().intervalMinutes||5;
    currentFlow={demo,status:'active',createdAt:Date.now(),deadline:Date.now()+intervalMinutes*60000,
      index:0,intervalMinutes,includeLocation:Boolean(!demo&&locationFix&&get('supportIncludeLocation')?.checked),destination:{...currentDestination()},
      lastAction:demo?'Demonstração: não serão enviados avisos.':'Selecione um canal e confirme o envio no aplicativo externo.'};
    status('supportStartStatus',demo?'Demonstração ativada, sem mensagens reais.':'Fluxo local iniciado. Os avisos precisam ser enviados manualmente no canal escolhido.');
    redrawFlow();
  }
  function nextContact(manual){
    if(!currentFlow||currentFlow.status!=='active')return;
    currentFlow.index++;
    currentFlow.deadline=Date.now()+currentFlow.intervalMinutes*60000;
    currentFlow.lastAction=manual?'Próximo contato escolhido pelo usuário. Nenhum envio automático.':'Prazo encerrado; próxima tentativa preparada.';
    redrawFlow();
  }
  function locationForMessage(){
    if(!navigator.geolocation){
      status('supportLocationStatus','GPS indisponível. O destino pode ser compartilhado sem sua posição.');return;
    }
    status('supportLocationStatus','Solicitando localização ao navegador…');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        locationFix={lat:Math.round(pos.coords.latitude*1e5)/1e5,lng:Math.round(pos.coords.longitude*1e5)/1e5};
        status('supportLocationStatus','Posição obtida nesta sessão; ela só será incluída se você marcar a opção de compartilhamento.');
      },
      ()=>status('supportLocationStatus','Localização não autorizada ou indisponível. Você ainda pode avisar somente o destino.'),
      {enableHighAccuracy:false,timeout:12000,maximumAge:60000}
    );
  }
  document.addEventListener('click',ev=>{
    const a=ev.target.closest('[data-support-name]');
    if(a) {
      destination={name:plain(a.dataset.supportName),address:plain(a.dataset.supportAddress),kind:'servico'};
      currentFlow=null;locationFix=null;
    }
    if(ev.target.closest('#supportSkipOnboarding')) {persistFirst();get('supportSkipOnboarding')?.closest('.support-first-entry')?.remove();}
    if(ev.target.closest('.support-first-entry a'))persistFirst();
    if(ev.target.closest('#supportDeleteContacts')){
      const ok=window.confirm('Apagar todos os contatos de confiança salvos neste navegador?');
      if(ok) {
        try{localStorage.removeItem(CONFIG_KEY)}catch(_){}
        demoContacts=null;currentFlow=null;
        render('rede-apoio',false);status('supportSaveStatus','Contatos apagados deste navegador.');
      }
    }
    if(ev.target.closest('#supportGetLocation'))locationForMessage();
    if(ev.target.closest('#supportStartFlow'))startFlow(false);
    if(ev.target.closest('#supportStartDemo'))startFlow(true);
    if(ev.target.closest('#supportNextContact'))nextContact(true);
    if(ev.target.closest('#supportMarkResponded')&&currentFlow){
      currentFlow.status='responded';currentFlow.lastAction='Resposta registrada manualmente pelo usuário.';redrawFlow();
    }
    if(ev.target.closest('#supportResetFlow')){
      currentFlow=null;demoContacts=null;locationFix=null;redrawFlow();
    }
    if(ev.target.closest('#supportDemoSend')&&currentFlow?.demo){
      status('supportFlowStatus','Demonstração: abertura de canal simulada. Nenhuma mensagem enviada.');
    }
    const share=ev.target.closest('[data-external-channel]');
    if(share && currentFlow) {
      currentFlow.lastAction='Aplicativo '+share.dataset.externalChannel+' aberto. Entrega não confirmada; verifique e envie por lá.';
      // A navegação usa o link nativo para que o usuário aprove o envio.
      status('supportFlowStatus',currentFlow.lastAction);
    }
  },true);
  document.addEventListener('submit',e=>{
    if(e.target?.id==='supportContactsForm') {
      e.preventDefault();saveContacts(e.target);
    }
  });
  window.addEventListener('focus',redrawFlow);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)redrawFlow()});
  window.setInterval(()=> {
    if(!currentFlow||currentFlow.status!=='active')return;
    const before=currentFlow.index;
    expireFlowIfNeeded();
    if(before!==currentFlow.index){redrawFlow();return;}
    const count=get('supportCountdown');
    if(!count) return;
    count.textContent=Math.max(0,Math.ceil((currentFlow.deadline-Date.now())/1000));
  },1000);
  // Destino somente em memória desta sessão; app pode ser usado sem localização ou rede de apoio.
  window.__rapsSupportPilot={
    version:VERSION, city:CITY, mode:'local-manual',
    getDestination:()=>({...currentDestination()}),
    getFlowStatus:()=>currentFlow?{demo:currentFlow.demo,status:currentFlow.status,index:currentFlow.index,deadline:currentFlow.deadline}:null
  };
})();