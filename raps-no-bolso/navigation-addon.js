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

  // Mantém a explicação anterior, com as regras e referências, após os atalhos de busca.
  const helpExplanation = pages['onde-ajuda'];
  pages['onde-ajuda'] = () => {
    const template = document.createElement('div');
    template.innerHTML = helpExplanation();
    const explanation = template.querySelector('.content-grid')?.outerHTML || '';
    return `<div class="page">
      ${pageHead('Encontrar atendimento','Comece pelo tipo de serviço. Os diretórios abaixo são de Goiânia e mostram endereços, contatos e rotas.')}
      ${cards([
        ['ubs-goiania','📍','Encontrar uma UBS','Busque por nome, bairro ou distrito e veja endereço e horário informado.'],
        ['servicos-goiania','🏥','Encontrar CAPS ou urgência','Consulte CAPS, UPAs e outros serviços; filtre pelo tipo de atendimento.']
      ],'Buscar serviços em Goiânia')}
      <section class="panel soft next-step"><h2>Não sei qual serviço procurar</h2><p>Compare caminhos a partir da sua necessidade.</p>${link('encontre-caminho','Me ajude a escolher','btn secondary')}</section>
      ${emergencyStrip()}
      <details class="panel disclosure" id="serviceExplanation"><summary>O que fazem UBS, CAPS, UPA e SAMU?</summary><div class="disclosure-body">${explanation}</div></details>
      <p class="home-note">A localização é opcional. Você pode usar as listas sem GPS. Horários e disponibilidade devem ser confirmados com a unidade.</p>
    </div>`;
  };

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
