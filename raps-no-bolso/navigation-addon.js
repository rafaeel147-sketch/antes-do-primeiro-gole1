// Camada final de navegação: preserva módulos, dados locais e URLs compartilhadas.
(() => {
  function cards(items, label) {
    return `<section class="nav-grid task-grid" aria-label="${label}">${items.map(([route,icon,title,description]) =>
      `<a class="nav-card" href="?p=${route}" data-route="${route}"><span class="icon-square" aria-hidden="true">${icon}</span><span><strong>${title}</strong><p>${description}</p></span><span class="go" aria-hidden="true">›</span></a>`
    ).join('')}</section>`;
  }

  pages.orientacoes = () => `<div class="page">
    ${pageHead('Direitos e orientações','Escolha o assunto. As orientações práticas vêm primeiro; os detalhes e as fontes ficam disponíveis para consulta.')}
    <div class="section-head"><h2>Como posso me cuidar?</h2></div>
    ${cards([
      ['alcool-drogas','🧭','Álcool e outras drogas','Apoio para reduzir, parar ou diminuir riscos.'],
      ['parar-fumar','🚭','Quero parar de fumar','Estratégias para o dia a dia e para a vontade de fumar.'],
      ['reducao-danos','🛡️','Reduzir riscos','Cuidados para proteger a vida.'],
      ['familia','👥','Apoiar alguém','Orientações para familiares e pessoas de confiança.']
    ],'Orientações de cuidado')}
    <div class="section-head"><h2>Direitos e acesso ao SUS</h2></div>
    ${cards([
      ['direitos','⚖️','Entender meus direitos','Atendimento, documentos, sigilo e acompanhamento.'],
      ['direitos-reclamar','📣','Tive dificuldade no atendimento','Como organizar os fatos e procurar o canal adequado.']
    ],'Direitos na prática')}
    <details class="panel disclosure"><summary>Entender como a rede funciona</summary>
      <div class="quick-links">${link('raps','O que é a RAPS? <span>→</span>')}${link('encontre-caminho','Ajuda para escolher um caminho <span>→</span>')}</div>
    </details>
  </div>`;

  // Acesso rápido organizado por necessidade; chamadas ao SAMU não dependem de GPS.
  const helpExplanation = pages['onde-ajuda'];
  const hospitals = [
    ['HUGO — Hospital de Urgências de Goiás','Urgências hospitalares de média e alta complexidade, com referência em trauma.','Avenida 31 de Março, s/n, Avenida Pedro Ludovico, Goiânia - GO','https://goias.gov.br/saude/hugo/'],
    ['HUGOL — Hospital Estadual de Urgências','Urgências hospitalares especializadas. A via de entrada depende do quadro e da regulação.','Avenida Anhanguera, 14527, Setor Santos Dumont, Goiânia - GO','https://goias.gov.br/saude/hugol/']
  ];
  let hospitalPosition = null;
  function hospitalRoute(address) {
    const origin = hospitalPosition ? '&origin=' + encodeURIComponent(hospitalPosition.lat+','+hospitalPosition.lng) : '';
    return 'https://www.google.com/maps/dir/?api=1'+origin+'&destination='+encodeURIComponent(address);
  }
  function priorityLink(route,icon,title,subtitle,kind) {
    return `<a class="nav-card priority-service-choice" href="?p=${route}" data-route="${route}" data-service-kind="${kind}"><span class="icon-square" aria-hidden="true">${icon}</span><span><strong>${title}</strong><p>${subtitle}</p></span><span class="go" aria-hidden="true">›</span></a>`;
  }
  pages['onde-ajuda'] = () => {
    const template = document.createElement('div');
    template.innerHTML = helpExplanation();
    const explanation = template.querySelector('.content-grid')?.outerHTML || '';
    return `<div class="page">
      ${pageHead('Encontre atendimento','Escolha pelo que você precisa agora. Use a busca por texto mesmo sem GPS.')}
      <section class="panel priority-emergency">
        <h2>Emergência ou risco à vida?</h2>
        <p>Desmaio, convulsão, falta de ar intensa, dor forte no peito ou outra situação grave: ligue 192.</p>
        <a class="btn danger priority-emergency-call" href="tel:192">📞 Ligar para o SAMU 192</a>
        <p class="small">Não precisa ativar a localização do aplicativo para ligar.</p>
      </section>
      <h2 class="priority-section-title">Qual serviço você procura?</h2>
      <section class="priority-service-grid" aria-label="Serviços apresentados pela urgência da necessidade">
        ${priorityLink('hospitais-urgencia','🏥','Hospital / pronto-socorro','Casos que podem exigir hospital, cirurgia ou internação.','hospital')}
        ${priorityLink('servicos-goiania','🚑','UPA 24h — urgência','Atendimento de urgência, avaliação, observação e encaminhamento.','upa')}
        ${priorityLink('servicos-goiania','💙','CAPS / CAPS AD — saúde mental','Acolhimento, cuidado contínuo, álcool e outras drogas.','caps')}
        ${priorityLink('ubs-goiania','🩺','UBS — posto de saúde','Consultas, vacinação e acompanhamento de rotina.','ubs')}
      </section>
      <section class="panel soft">
        <h3>Localização opcional</h3>
        <p>Ao escolher um serviço, seu navegador poderá pedir acesso à localização para ajudar nas rotas. Se você recusar, ainda poderá ver endereços e buscar por texto.</p>
        <p class="small">A ordem destes botões não substitui avaliação clínica nem classificação de risco.</p>
      </section>
      <details class="panel disclosure"><summary>Não sei qual serviço procurar</summary>
        ${link('encontre-caminho','Me ajude a escolher','btn secondary')}
      </details>
      <details class="panel disclosure" id="serviceExplanation">
        <summary>O que fazem UBS, CAPS, UPA, SAMU e hospital?</summary>
        <div class="disclosure-body">${explanation}</div>
      </details>
      <p class="home-note">Confirme horários e condições de atendimento na fonte oficial. O aplicativo não informa vagas nem fila em tempo real.</p>
    </div>`;
  };
  pages['hospitais-urgencia'] = () => `<div class="page">
    ${pageHead('Hospital / pronto-socorro','Referências hospitalares em Goiânia. Para situações graves, o SAMU 192 pode orientar o encaminhamento.','Atenção hospitalar')}
    ${emergencyStrip()}
    <section class="panel warning">
      <h2>Importante</h2>
      <p>Hospitais de referência podem atender por regulação. Esta lista não confirma vaga, atendimento imediato ou acesso irrestrito.</p>
      <p id="hospitalLocationStatus" aria-live="polite">Localização não solicitada; rotas disponíveis por endereço.</p>
      <button class="btn secondary" id="hospitalUseLocation" type="button">Usar minha localização (opcional)</button>
    </section>
    <section class="priority-hospital-list" aria-label="Hospitais com informações oficiais">
      ${hospitals.map(([name,description,address,source])=>`<article class="panel">
        <h2>${name}</h2><p>${description}</p><p><strong>Endereço:</strong> ${address}</p>
        <div class="hero-actions">
          <a class="btn" data-hospital-address="${address}" href="${hospitalRoute(address)}" target="_blank" rel="noopener noreferrer">Traçar rota</a>
          <a class="btn secondary" href="${source}" target="_blank" rel="noopener noreferrer">Fonte oficial</a>
        </div>
      </article>`).join('')}
    </section>
    <section class="panel soft"><h2>Crise em saúde mental?</h2>
      <p>Há também pronto-socorro psiquiátrico em Goiânia. Em risco imediato, ligue 192.</p>
      ${link('servicos-goiania','Ver serviços de urgência psiquiátrica','btn secondary')}
    </section>
  </div>`;
  function askHospitalLocation() {
    const status = document.getElementById('hospitalLocationStatus');
    if (hospitalPosition) {
      if(status) status.textContent = 'Localização ativa nesta sessão para rotas.';
      return;
    }
    if (!navigator.geolocation) {
      if(status) status.textContent = 'Geolocalização indisponível; use o endereço.';
      return;
    }
    if(status) status.textContent = 'Solicitando permissão de localização ao navegador…';
    navigator.geolocation.getCurrentPosition(position => {
      hospitalPosition = {lat:position.coords.latitude,lng:position.coords.longitude};
      document.querySelectorAll('[data-hospital-address]').forEach(a=>a.href=hospitalRoute(a.dataset.hospitalAddress));
      if(status) status.textContent = 'Localização autorizada. O aplicativo usará sua posição como origem ao abrir o mapa externo.';
      const button = document.getElementById('hospitalUseLocation');
      if(button) button.textContent = '✓ Localização ativada';
    }, error => {
      if(status) status.textContent = error.code===1
        ? 'Localização não autorizada. Rotas por endereço continuam disponíveis.'
        : 'Localização indisponível. Rotas por endereço continuam disponíveis.';
    }, {enableHighAccuracy:false,timeout:10000,maximumAge:60000});
  }
  // O clique no serviço é explícito; GPS é solicitado em seguida, sem bloquear a lista.
  document.addEventListener('click', event => {
    const choice = event.target.closest('[data-service-kind]');
    if(choice) {
      const kind = choice.dataset.serviceKind;
      if(kind==='hospital') askHospitalLocation();
      if(kind==='upa'||kind==='caps') {
        const select = document.getElementById('serviceType');
        if(select){select.value=kind;select.dispatchEvent(new Event('change',{bubbles:true}));}
        document.getElementById('useLocation')?.click();
      }
      if(kind==='ubs') document.getElementById('ubsUseLocation')?.click();
    }
    if(event.target.closest('#hospitalUseLocation')) askHospitalLocation();
  });

  // A entrada "Preciso de ajuda agora" deve chegar às opções de serviço sem percorrer o menu.
  const previousCrisisPage = pages.crise;
  pages.crise = () => previousCrisisPage().replace(
    '<div class="content-grid">',
    '<section class="panel soft priority-crisis-shortcut"><h2>Precisa localizar atendimento?</h2><p>Veja hospital, UPA, CAPS ou UBS e escolha um serviço. A busca por endereço funciona sem GPS.</p>' +
      link('onde-ajuda','Encontrar atendimento agora','btn') +
    '</section><div class="content-grid">'
  );

  pages.direitos = () => `<div class="page">
    ${pageHead('Meus direitos','Comece pela situação que você está vivendo. Abra os detalhes de cada assunto quando precisar conferir a explicação e a base legal.')}
    ${cards(rightsTopics,'Escolher um direito')}
    <section class="panel soft next-step"><h2>Precisa encontrar um serviço?</h2>${link('onde-ajuda','Buscar atendimento','btn secondary')}</section>
  </div>`;

  pages['participe-sus'] = () => `<div class="page">
    ${pageHead('Participar e contribuir','Prepare uma sugestão ou conte o que dificultou seu acesso. Você escolhe como participar.')}
    <aside class="panel soft local-data-notice"><strong>Seus registros ficam neste aparelho.</strong><p>Salvar aqui não envia a contribuição a um órgão e não cria protocolo oficial.</p></aside>
    ${cards([
      ['participacao-sugerir','💡','Preparar uma sugestão','Descreva um problema e uma ideia de melhoria.'],
      ['escuta-comunitaria','💬','Contar uma dificuldade de acesso','Registre barreiras e informações que fizeram falta.'],
      ['participacao-demandas','📋','Ver meus registros','Acompanhe o que você já salvou neste navegador.']
    ],'Contribuições')}
    <details class="panel disclosure"><summary>Outras formas de participar</summary><div class="quick-links">
      ${link('participacao-antes-depois','Registrar uma melhoria: antes e depois <span>→</span>')}
      ${link('participacao-proposta','Preparar uma proposta ao Conselho <span>→</span>')}
      ${link('participacao-controle','Entender o controle social <span>→</span>')}
      ${link('participacao-agenda','Preparar-se para uma reunião <span>→</span>')}
    </div></details>
    <section class="panel next-step"><h2>Quer procurar um canal oficial?</h2><p>Veja como registrar uma manifestação na Ouvidoria ou solicitar documentos públicos.</p><div class="hero-actions">${link('ouvsus','Ouvidoria do SUS','btn secondary')}${link('lai-sic','Pedir informação pública','btn secondary')}</div></section>
  </div>`;

  pages['dados-locais'] = () => `<div class="page">
    ${pageHead('Dados e exportação','Consulte e exporte os registros disponíveis neste navegador. Esta área não reúne automaticamente dados de outras pessoas ou aparelhos.')}
    ${cards([
      ['pesquisa-painel-agregado','Σ','Síntese agregada','Indicadores locais em CSV ou JSON, sem texto livre e fotos.'],
      ['avaliacao-painel','✓','Dados de avaliação','Respostas e testes de uso: consulta, CSV e JSON.'],
      ['participacao-demandas','📋','Registros de participação','Sugestões e propostas em JSON; fotos não são incluídas.']
    ],'Exportações disponíveis')}
    <section class="panel soft next-step"><h2>Antes de compartilhar</h2><p>Os arquivos individuais podem conter comentários que você escreveu. Revise o conteúdo e escolha apenas o necessário para o destino.</p>${link('privacidade','Entender os dados locais','btn secondary')}</section>
  </div>`;

  // As regras existentes não são reescritas: a pessoa abre cada explicação e fonte.
  for (const route of Object.keys(pages)) {
    if (!route.startsWith('direitos-')) continue;
    const original = pages[route];
    pages[route] = () => {
      const template = document.createElement('div');
      template.innerHTML = original();
      for (const panel of template.querySelectorAll('.content-stack > section.panel, .side-stack > section.panel')) {
        const heading = panel.querySelector('h2,h3');
        if (!heading || panel.matches('.danger,.warning') || panel.querySelector('.steps')) continue;
        const details = document.createElement('details');
        details.className = `${panel.className} disclosure`;
        const summary = document.createElement('summary');
        summary.textContent = heading.textContent;
        heading.remove();
        details.appendChild(summary);
        while (panel.firstChild) details.appendChild(panel.firstChild);
        panel.replaceWith(details);
      }
      return template.innerHTML;
    };
  }

  // Usado somente depois que a gravação local terminou com sucesso.
  window.RAPSPostSave = (feedbackId) => {
    const feedback = document.getElementById(feedbackId);
    if (!feedback) return;
    feedback.querySelector('[data-post-save-evaluation]')?.remove();
    const invitation = document.createElement('section');
    invitation.className = 'panel post-save-evaluation';
    invitation.dataset.postSaveEvaluation = '1';
    invitation.innerHTML = `<h3>Como foi usar o aplicativo?</h3><p>Se quiser, avalie a facilidade de concluir esta tarefa. Sua contribuição já está salva; a avaliação é opcional.</p><div class="hero-actions">${link('avaliacao-rapida','Avaliar minha experiência','btn secondary')}<button type="button" class="mini-action" data-dismiss-evaluation>Agora não</button></div>`;
    feedback.appendChild(invitation);
    feedback.setAttribute('tabindex','-1');
    feedback.focus({preventScroll:true});
    feedback.scrollIntoView({behavior:'smooth',block:'start'});
  };

  document.addEventListener('click', event => {
    const dismiss = event.target.closest('[data-dismiss-evaluation]');
    if (!dismiss) return;
    const feedback = dismiss.closest('.form-feedback');
    dismiss.closest('[data-post-save-evaluation]')?.remove();
    feedback?.focus({preventScroll:true});
  });
})();
