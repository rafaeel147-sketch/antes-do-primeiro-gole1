// Diretório local RAPS/urgência de Goiânia — verificado em fontes oficiais em 16/09/2026.
// GPS é opcional, acionado pelo usuário e mantido apenas em memória nesta página.
(function servicesGoianiaAddon(){
  const VERIFIED_AT = '16/09/2026';
  const CAPS_SOURCE = 'https://saude.goiania.go.gov.br/sobre-a-secretaria/consultas-sus/centros-de-atencao-psicossocial-caps/';
  const UPA_SOURCE = 'https://www.goiania.go.gov.br/sing_servicos/unidade-de-pronto-atendimento-upas-24-horas/';
  const URGENCY_SOURCE = 'https://www.goiania.go.gov.br/urgenciaemergencia/';

  const services = [
    {name:'CAPSi Água Viva', type:'caps-infanto', label:'CAPSi', audience:'Crianças e adolescentes; saúde mental, violência e álcool/outras drogas.', hours:'Seg a sex, 07h–19h', address:'Rua C 88, QD. 164, LT. 14, Setor Sudoeste, Goiânia - GO', phone:'6232025680', displayPhone:'(62) 3202-5680', source:CAPS_SOURCE},
    {name:'CAPS Beija Flor', type:'caps-transtorno', label:'CAPS adulto', audience:'Adultos com transtornos mentais severos e persistentes.', hours:'Seg a sex, 07h–19h', address:'Alameda Presidente Baldomir, Chácara 7, Jardim Presidente, Goiânia - GO', phone:'6230304099', displayPhone:'(62) 3030-4099', source:CAPS_SOURCE},
    {name:'CAPS AD Casa', type:'caps-ad', label:'CAPS AD adulto', audience:'Adultos com necessidades relacionadas ao uso de álcool e outras drogas; demanda espontânea.', hours:'Seg a sex, 07h–18h', address:'Rua 55, QD. 120, LT. 33, nº 922, Setor Central, Goiânia - GO, CEP 74055-150', phone:'6230304081', displayPhone:'(62) 3030-4081', source:CAPS_SOURCE},
    {name:'CAPS Esperança', type:'caps-transtorno', label:'CAPS adulto', audience:'Adultos com transtornos mentais severos e persistentes; demanda espontânea.', hours:'Seg a sex, 07h–18h', address:'Rua São Luis, QD. 42, LT. 04, Jardim Petrópolis, Goiânia - GO, CEP 74460-250', phone:'6230304108', displayPhone:'(62) 3030-4108', source:CAPS_SOURCE},
    {name:'CAPSiJ Cativar', type:'caps-infanto', label:'CAPSi', audience:'Crianças e adolescentes com transtornos mentais, vítimas de violência e uso de álcool/outras drogas.', hours:'Seg a sex, 07h–19h', address:'Rua 9, nº 62, QD. 18, LT. 10, Setor Central, Goiânia - GO, CEP 74013-040', phone:'6230304080', displayPhone:'(62) 3030-4080', source:CAPS_SOURCE},
    {name:'CAPSi Girassol', type:'caps-infanto', label:'CAPSi AD', audience:'Crianças e adolescentes com necessidades relacionadas ao uso de álcool e outras drogas; demanda espontânea.', hours:'Seg a sex, 07h–19h', address:'Alameda das Monções, nº 1560, Chácara 143, Capuava, Goiânia - GO, CEP 74450-490', phone:'6230304090', displayPhone:'(62) 3030-4090', source:CAPS_SOURCE},
    {name:'CAPS AD Ipê', type:'caps-ad', label:'CAPS AD adulto', audience:'Adultos com necessidades relacionadas ao uso de álcool e outras drogas; demanda espontânea.', hours:'Seg a sex, 07h–19h', address:'Rua Dona Mariquinha esquina com Jules Verne, QD. 24, LT. 09 e 10, Setor Negrão de Lima, Goiânia - GO, CEP 74603-190', phone:'6230304082', displayPhone:'(62) 3030-4082', source:CAPS_SOURCE},
    {name:'CAPS III AD Noroeste', type:'caps-ad', label:'CAPS AD adulto', audience:'Adultos com necessidades relacionadas ao uso de álcool e outras drogas; demanda espontânea.', hours:'Seg a sex, 07h–19h', address:'Rua VMR esquina com Rua São Domingos, QD. 33 e 34, LT. 01, nº 01, Vila Mutirão I, Goiânia - GO, CEP 74480-120', phone:'6230304106', displayPhone:'(62) 3030-4106', source:CAPS_SOURCE},
    {name:'CAPS III Novo Mundo', type:'caps-transtorno', label:'CAPS adulto', audience:'Adultos com transtornos mentais severos e persistentes; demanda espontânea.', hours:'Seg a sex, 07h–19h; sem demanda espontânea à noite, fins de semana e feriados.', address:'Avenida Manchester, nº 2000, Chácara 02, Jardim Novo Mundo, Goiânia - GO, CEP 74703-000', phone:'6230304101', displayPhone:'(62) 3030-4101', source:CAPS_SOURCE},
    {name:'CAPS II Vida', type:'caps-transtorno', label:'CAPS adulto', audience:'Adultos com transtornos mentais severos e persistentes.', hours:'Seg a sex, 07h–19h', address:'Rua 101, nº 289, Setor Sul, Goiânia - GO, CEP 74080-150', phone:'6230304115', displayPhone:'(62) 3030-4115', source:CAPS_SOURCE},
    {name:'CAPS II AD Oeste', type:'caps-ad', label:'CAPS AD adulto', audience:'Adultos com necessidades relacionadas ao uso de álcool e outras drogas; demanda espontânea.', hours:'Seg a sex, 07h–19h', address:'Rua 13 de Maio, QD. 41, LT. 04, Parque Industrial João Brás, Goiânia - GO, CEP 74483-560', phone:'6230304107', displayPhone:'(62) 3030-4107', source:CAPS_SOURCE},
    {name:'CAPS II Transtorno Liberdade', type:'caps-transtorno', label:'CAPS adulto', audience:'Adultos com transtornos mentais severos e persistentes; demanda espontânea.', hours:'Seg a sex, 07h–19h', address:'Rua VMR esquina com Rua São Domingos, QD. 33 e 34, LT. 01, nº 01, Vila Mutirão I, Goiânia - GO, CEP 74480-120', phone:'6230304106', displayPhone:'(62) 3030-4106', source:CAPS_SOURCE},
    {name:'Ambulatório Municipal de Psiquiatria', type:'ambulatorio', label:'Ambulatório', audience:'Adultos com transtornos mentais leves; acesso via regulação da SMS.', hours:'Seg a sex, 07h–19h', address:'Rua C2 esquina com Rua C1, QD. 168, LT. 542, nº 162, Jardim América, Goiânia - GO, CEP 74265-020', phone:'6230304119', displayPhone:'(62) 3030-4119', source:CAPS_SOURCE},
    {name:'Pronto Socorro Psiquiátrico Professor Wassily Chuc', type:'urgencia', label:'Urgência psiquiátrica 24h', audience:'Situações de crise em saúde mental.', hours:'Todos os dias, 24h', address:'Avenida C 107, nº 3642, Jardim América, Goiânia - GO, CEP 74205-095', phone:'6230304124', displayPhone:'(62) 3030-4124', source:CAPS_SOURCE, open24:true},
    {name:'UPA Itaipu — Dr. João Batista de Sousa Júnior', type:'upa', label:'UPA 24h', audience:'Urgências e emergências clínicas; acolhimento com classificação de risco.', hours:'Todos os dias, 24h', address:'Avenida Rio Vermelho esquina com R-I-19, QD. 14, Residencial Itaipu, Goiânia - GO', phone:'6232583745', displayPhone:'(62) 3258-3745', source:UPA_SOURCE, open24:true},
    {name:'UPA Noroeste — Maria Pires Perillo', type:'upa', label:'UPA 24h', audience:'Urgências e emergências clínicas; acolhimento com classificação de risco.', hours:'Todos os dias, 24h', address:'Rua JC-22 com JC-27 e 27-A, s/nº, Jardim Curitiba I, Goiânia - GO', phone:'6235243460', displayPhone:'(62) 3524-3460', source:UPA_SOURCE, open24:true},
    {name:'UPA Chácara do Governador — Dr. Paulo de Siqueira Garcia', type:'upa', label:'UPA 24h', audience:'Urgências e emergências clínicas; acolhimento com classificação de risco.', hours:'Todos os dias, 24h', address:'Rua DF-2 com Rua DF-18, Lote 14, Chácara do Governador, Goiânia - GO, CEP 74485-150', phone:'', displayPhone:'Consulte a fonte oficial para contato atualizado', source:URGENCY_SOURCE, open24:true},
    {name:'UPA Jardim América — Dr. Domingos Viggiano', type:'upa', label:'UPA 24h', audience:'Urgências e emergências clínicas; acolhimento com classificação de risco.', hours:'Todos os dias, 24h', address:'Praça C-201, Jardim América, Goiânia - GO', phone:'', displayPhone:'Telefone não consolidado nas fontes oficiais consultadas', source:URGENCY_SOURCE, open24:true}
  ];

  let deviceLocation = null;

  function escapeHtml(value=''){
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function mapsUrl(service){
    const destination = encodeURIComponent(service.address);
    const origin = deviceLocation ? `&origin=${encodeURIComponent(deviceLocation.lat + ',' + deviceLocation.lng)}` : '';
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${destination}`;
  }

  function typeLabel(type){
    return ({'caps-ad':'CAPS AD','caps-transtorno':'CAPS adulto','caps-infanto':'CAPSi','ambulatorio':'Ambulatório','urgencia':'Urgência psiquiátrica','upa':'UPA 24h'})[type] || type;
  }

  function filteredServices(){
    const search = (document.getElementById('serviceSearch')?.value || '').trim().toLocaleLowerCase('pt-BR');
    const type = document.getElementById('serviceType')?.value || 'todos';
    const only24 = Boolean(document.getElementById('service24h')?.checked);
    return services.filter(service => {
      const haystack = `${service.name} ${service.label} ${service.audience} ${service.address}`.toLocaleLowerCase('pt-BR');
      return (!search || haystack.includes(search)) && (type === 'todos' || service.type === type) && (!only24 || service.open24);
    });
  }

  function serviceCard(service){
    const phoneAction = service.phone ? `<a class="btn secondary" href="tel:${service.phone}">Ligar</a>` : '';
    return `<article class="panel service-card">
      <div class="service-card-top"><div><span class="badge">${escapeHtml(service.label)}</span><h3>${escapeHtml(service.name)}</h3></div>${service.open24 ? '<span class="service-24">24h</span>' : ''}</div>
      <p>${escapeHtml(service.audience)}</p>
      <p><strong>Horário:</strong> ${escapeHtml(service.hours)}</p>
      <p><strong>Endereço:</strong> ${escapeHtml(service.address)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(service.displayPhone)}</p>
      <div class="hero-actions">${phoneAction}<a class="btn" href="${mapsUrl(service)}" target="_blank" rel="noopener noreferrer">Traçar rota ↗</a><a class="btn secondary" href="${service.source}" target="_blank" rel="noopener noreferrer">Fonte oficial ↗</a></div>
    </article>`;
  }

  function renderResults(){
    const target = document.getElementById('serviceResults');
    if (!target) return;
    const results = filteredServices();
    target.innerHTML = results.length ? results.map(serviceCard).join('') : '<section class="panel warning"><h3>Nenhum serviço encontrado</h3><p>Tente retirar um filtro ou usar outra palavra.</p></section>';
    const count = document.getElementById('serviceCount');
    if (count) count.textContent = `${results.length} serviço${results.length === 1 ? '' : 's'} exibido${results.length === 1 ? '' : 's'}`;
  }

  function locationStatus(message, state=''){
    const status = document.getElementById('locationStatus');
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function requestLocation(){
    if (!navigator.geolocation){
      locationStatus('Este navegador não oferece geolocalização. Você ainda pode abrir rotas pelo endereço.', 'error');
      return;
    }
    locationStatus('Pedindo sua localização ao aparelho…');
    navigator.geolocation.getCurrentPosition(position => {
      deviceLocation = {lat:position.coords.latitude, lng:position.coords.longitude};
      locationStatus('Localização pronta. Ela fica apenas em memória e será usada somente ao tocar em “Traçar rota”.', 'ok');
      const button = document.getElementById('useLocation');
      if (button) button.textContent = '✓ Localização ativada';
      renderResults();
    }, error => {
      const messages = {
        1:'Permissão de localização negada. Você pode continuar usando o diretório normalmente.',
        2:'Não foi possível determinar sua localização agora.',
        3:'A localização demorou demais para responder. Tente novamente.'
      };
      locationStatus(messages[error.code] || 'Não foi possível obter sua localização.', 'error');
    }, {enableHighAccuracy:false, timeout:10000, maximumAge:300000});
  }

  // Entrada própria no menu, logo depois de "Onde buscar ajuda".
  if (!menuItems.some(([route]) => route === 'servicos-goiania')) {
    const idx = menuItems.findIndex(([route]) => route === 'onde-ajuda');
    menuItems.splice(idx >= 0 ? idx + 1 : menuItems.length, 0, ['servicos-goiania','🏥','Serviços em Goiânia','CAPS, urgência e rotas com GPS opcional']);
  }

  pages['servicos-goiania'] = () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Serviços em Goiânia','Diretório inicial da RAPS e urgência com dados conferidos em páginas oficiais da Prefeitura. Use busca, filtros e, se quiser, sua localização para abrir a rota.','Diretório local')}
      <section class="panel success service-location-box">
        <div>
          <h2>Usar minha localização</h2>
          <p>É opcional. A coordenada fica somente na memória desta página. O RAPS no Bolso não salva sua posição. Ao abrir a rota, passam a valer as regras do serviço de mapas externo.</p>
          <p id="locationStatus" class="small">Localização ainda não solicitada.</p>
        </div>
        <button class="btn" id="useLocation" type="button">Usar minha localização</button>
      </section>

      <section class="panel service-filters" aria-label="Filtros do diretório">
        <label><span>Buscar</span><input id="serviceSearch" type="search" autocomplete="off" placeholder="Ex.: álcool, criança, Jardim América, Noroeste"></label>
        <label><span>Tipo</span><select id="serviceType">
          <option value="todos">Todos</option>
          <option value="caps-ad">CAPS AD</option>
          <option value="caps-transtorno">CAPS adulto</option>
          <option value="caps-infanto">CAPSi</option>
          <option value="ambulatorio">Ambulatório</option>
          <option value="urgencia">Urgência psiquiátrica</option>
          <option value="upa">UPA 24h</option>
        </select></label>
        <label class="service-check"><input id="service24h" type="checkbox"> <span>Somente 24h</span></label>
        <div class="small"><strong id="serviceCount">${services.length} serviços exibidos</strong><br>Dados verificados em ${VERIFIED_AT}.</div>
      </section>

      <section class="panel warning">
        <h2>Em crise psiquiátrica ou risco imediato</h2>
        <p>A SMS Goiânia informa o Pronto Socorro Psiquiátrico Professor Wassily Chuc como porta de entrada para crise/surto e funcionamento 24h. Em emergência médica, o SAMU 192 continua disponível.</p>
        <div class="hero-actions"><a class="btn danger" href="tel:192">Ligar 192</a><a class="btn secondary" href="${CAPS_SOURCE}" target="_blank" rel="noopener noreferrer">Conferir orientação oficial ↗</a></div>
      </section>

      <div id="serviceResults" class="service-results">${services.map(serviceCard).join('')}</div>
      <section class="panel soft"><h2>Sobre atualização</h2><p>Endereços, telefones, nomenclaturas e horários podem mudar. Fontes oficiais do próprio Município podem divergir; por isso o diretório mostra a data da última conferência e não inventa uma classificação quando as fontes não são consistentes. As UBSs ficam em um diretório próprio dentro do RAPS no Bolso.</p><div class="hero-actions">${link('ubs-goiania','Abrir UBS em Goiânia','btn secondary')}<a class="btn secondary" href="${URGENCY_SOURCE}" target="_blank" rel="noopener noreferrer">Urgência — fonte oficial ↗</a></div></section>
    </div>`;

  if (!document.getElementById('servicesGoianiaStyles')) {
    const style = document.createElement('style');
    style.id = 'servicesGoianiaStyles';
    style.textContent = `
      .service-location-box{display:flex;gap:18px;align-items:center;justify-content:space-between;margin-bottom:18px}.service-location-box>div{max-width:760px}
      .service-filters{display:grid;grid-template-columns:minmax(220px,2fr) minmax(170px,1fr) auto auto;gap:14px;align-items:end;margin-bottom:18px}.service-filters label{display:grid;gap:7px;font-weight:700}.service-filters input[type="search"],.service-filters select{width:100%;padding:12px;border:1px solid var(--border,#cbd5e1);border-radius:10px;background:var(--surface,#fff);color:inherit;font:inherit}.service-check{display:flex!important;align-items:center;gap:8px;padding-bottom:12px}.service-check input{width:20px;height:20px}
      .service-results{display:grid;gap:16px;margin-top:18px;margin-bottom:18px}.service-card h3{margin:10px 0 8px}.service-card-top{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.service-24{font-weight:800;border-radius:999px;padding:5px 9px;background:#e7f8ef;color:#12613a;white-space:nowrap}
      #locationStatus[data-state="ok"]{font-weight:700}#locationStatus[data-state="error"]{font-weight:700}
      @media(max-width:780px){.service-location-box{align-items:stretch;flex-direction:column}.service-filters{grid-template-columns:1fr}.service-check{padding-bottom:0}.service-card .hero-actions{display:grid;grid-template-columns:1fr}.service-card .btn{text-align:center}}
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('input', event => {
    if (event.target.matches('#serviceSearch,#serviceType,#service24h')) renderResults();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('#serviceType,#service24h')) renderResults();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('#useLocation')) requestLocation();
  });
})();
