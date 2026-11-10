// Piloto DF (experimental): fontes oficiais, seleção explícita da região e rotas externas.
// Isolado do catálogo/roteador de Goiânia; não coleta GPS nem atribui distâncias sem dados verificados.
(() => {
  'use strict';
  const SOURCES = Object.freeze({
    ubs: 'https://info.saude.df.gov.br/busca-saude-ubs/',
    caps: 'https://info.saude.df.gov.br/busca-saude-caps/',
    upa: 'https://info.saude.df.gov.br/u/',
    hospitals: 'https://info.saude.df.gov.br/hospitaismaps/',
    layers: 'https://info.saude.df.gov.br/download-camadas/',
    crisis: 'https://info.saude.df.gov.br/busca-saude-caps/'
  });
  // Endereços oficiais; não representam a rede completa e não informam vaga ou admissão.
  const REFERENCES = Object.freeze([
    {
      name: 'Hospital São Vicente de Paulo (HSVP)',
      purpose: 'Referência de urgência e emergência em saúde mental, com pronto-socorro informado como 24 horas.',
      address: 'QSC 01, Área Especial, Setor C Sul, Taguatinga Sul, Brasília - DF, Brasil',
      source: 'https://www.saude.df.gov.br/documents/37101/869001/MINUTA__CARTA_DE_SERVICOS_HSVP.pdf'
    },
    {
      name: 'Hospital de Base do Distrito Federal (HBDF)',
      purpose: 'Hospital de referência, com atendimento de urgência e emergência em especialidades que incluem psiquiatria; acesso conforme avaliação e organização da rede.',
      address: 'SMHS, Área Especial, Quadra 101, Asa Sul, Brasília - DF, Brasil',
      source: 'https://igesdf.org.br/unidades/hospital-de-base/'
    }
  ]);
  function escapeHtml(raw) {
    return String(raw == null ? '' : raw).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function external(url,caption,style='btn secondary') {
    return '<a class="'+style+'" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(caption)+'</a>';
  }
  function directions(address,mode) {
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api','1');
    url.searchParams.set('destination',address);
    url.searchParams.set('travelmode',mode);
    // Não definir origem. Maps permite escolher a própria origem/localização com consentimento separado.
    return url.toString();
  }
  function optionCard(icon,title,description,url) {
    return '<article class="panel df-service-card"><h3>'+icon+' '+escapeHtml(title)+'</h3>'+
      '<p>'+escapeHtml(description)+'</p>'+
      '<div class="hero-actions">'+external(url,'Consultar unidades na SES-DF ↗')+'</div></article>';
  }
  pages['selecionar-regiao'] = () => '<div class="page">'+
    pageHead('Escolha sua região','Goiânia permanece funcional. O Distrito Federal está em prévia experimental, com buscas oficiais e rotas externas.','RAPS no Bolso — abrangência')+
    '<section class="panel df-region-choice" aria-label="Escolha de região">'+
      '<h2>Onde você quer encontrar atendimento?</h2>'+
      '<div class="df-region-actions">'+
        link('inicio','Goiânia — piloto atual','btn')+
        link('df-servicos','Distrito Federal — prévia','btn secondary')+
      '</div><p class="small">A escolha não usa GPS, não solicita CPF e não muda seu cadastro nem endereço do aplicativo.</p>'+
    '</section></div>';
  pages['df-servicos'] = () => '<div class="page df-pilot-page">'+
    pageHead('Encontrar atendimento no Distrito Federal','Use os buscadores oficiais por território e tipo de cuidado. A versão DF ainda não dispõe de ranking de rotas validado.','Prévia experimental — Brasília e DF')+
    '<section class="panel priority-emergency"><h2>Emergência ou risco imediato?</h2>'+
      '<p>Não aguarde resultados de mapa nem confirme localização no aplicativo. Para atendimento móvel e orientação de urgência, ligue para o SAMU.</p>'+
      '<a class="btn danger priority-emergency-call" href="tel:192">📞 Ligar SAMU 192</a></section>'+
    '<section class="panel warning"><h2>Importante sobre esta versão</h2>'+
      '<p>O catálogo completo de unidades e suas coordenadas ainda não foi importado. Não calculamos “unidade mais próxima” nem tempo de chegada no DF. As buscas abaixo abrem diretamente as páginas oficiais da SES-DF.</p>'+
      '<p>Se uma unidade não atender sua necessidade, o serviço de saúde pode orientar o encaminhamento. Em urgência grave, prefira o SAMU 192.</p></section>'+
    '<h2>Qual serviço você procura?</h2>'+
    '<div class="df-services-grid">'+
      optionCard('💙','CAPS e CAPS AD — saúde mental','Acolhimento em saúde mental, álcool e outras drogas. A SES-DF informa atendimento por demanda espontânea nos CAPS; consulte abrangência territorial e modalidade.',SOURCES.caps)+
      optionCard('🚑','UPA 24 horas — urgência','Atendimento de urgência por classificação de risco, com funcionamento contínuo segundo a SES-DF.',SOURCES.upa)+
      optionCard('🩺','UBS — atenção básica','Acompanhamento, vacinação e atenção primária. A unidade de referência depende do endereço; o acolhimento não pode ser negado por falta de documentos.',SOURCES.ubs)+
      optionCard('🏥','Hospitais','Consulte a lista oficial e a porta de entrada adequada. Hospital perto não garante vaga, especialidade ou acesso sem regulação.',SOURCES.hospitals)+
    '</div>'+
    '<h2>Referências documentadas de saúde mental</h2>'+
    '<p class="small">Exemplos confirmados em documentos oficiais, não uma lista completa nem classificação por distância.</p>'+
    '<div class="df-hospital-list">'+REFERENCES.map(ref=>'<article class="panel df-hospital-card">'+
      '<h3>'+escapeHtml(ref.name)+'</h3><p>'+escapeHtml(ref.purpose)+'</p>'+
      '<p><strong>Endereço de referência:</strong> '+escapeHtml(ref.address)+'</p>'+
      '<div class="hero-actions">'+
        external(directions(ref.address,'driving'),'Rota de carro ↗')+
        external(directions(ref.address,'walking'),'Rota a pé ↗')+
        external(directions(ref.address,'transit'),'Ônibus/metrô ↗')+
        external(ref.source,'Fonte oficial ↗')+
      '</div></article>').join('')+'</div>'+
    '<section class="panel soft"><h2>Fontes para ampliar o piloto</h2>'+
      '<p>A SES-DF oferece download de camadas GeoJSON de UBS, CAPS, UPAs e hospitais. A importação e a validação dessas coordenadas estão pendentes; não é seguro inventar ranking de menor trajeto.</p>'+
      external(SOURCES.layers,'Consultar camadas geográficas da SES-DF ↗')+
    '</section>'+
    '<section class="panel soft"><h2>Goiânia permanece disponível</h2>'+
      '<p>O comparador de trajetos de Goiânia continua isolado da prévia do DF.</p>'+
      '<div class="hero-actions">'+link('rotas-rede','Rotas de Goiânia','btn secondary')+link('selecionar-regiao','Trocar região','btn secondary')+'</div>'+
    '</section></div>';
  const originalHome = pages.inicio;
  pages.inicio = () => {
    const template = document.createElement('template');
    template.innerHTML = originalHome();
    const page = template.content.querySelector('.page');
    const target = page?.querySelector('.home-quick-services') || page?.querySelector('.home-grid');
    if (page && target) {
      const region = document.createElement('section');
      region.className = 'panel df-region-entry';
      region.setAttribute('aria-label','Região do RAPS no Bolso');
      region.innerHTML = '<h2>Onde você quer atendimento?</h2>'+
        '<p>Goiânia continua como piloto principal. Agora há uma prévia experimental para o Distrito Federal.</p>'+
        '<div class="hero-actions">'+
          link('inicio','Goiânia — atual','btn secondary')+
          link('df-servicos','Distrito Federal — prévia','btn')+
        '</div>'+
        '<p class="small">Escolher o DF não altera o catálogo de Goiânia nem solicita sua localização.</p>';
      target.before(region);
    }
    return template.innerHTML;
  };
  const previousRenderNav = renderNav;
  renderNav = function () {
    previousRenderNav();
    const nav = document.getElementById('drawerNav');
    if(!nav || nav.querySelector('[data-route="selecionar-regiao"]')) return;
    nav.insertAdjacentHTML('beforeend',
      '<a class="drawer-link" data-route="selecionar-regiao" href="?p=selecionar-regiao">🗺️ Escolher região</a>'+
      '<a class="drawer-link" data-route="df-servicos" href="?p=df-servicos">🏛️ Distrito Federal — prévia</a>');
  };
  // Somente inspeciona o catálogo estático para os testes; sem expor ou capturar GPS.
  window.RAPSDFPilotTest = {
    references:()=>REFERENCES.map(({name,address,source})=>({name,address,source})),
    sources:()=>({...SOURCES})
  };
})();
