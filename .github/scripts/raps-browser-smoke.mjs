import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/raps-no-bolso/';
const failures = [];

function check(condition, message) {
  try {
    assert.ok(condition, message);
    console.log(`PASS: ${message}`);
  } catch (error) {
    failures.push(error.message);
    console.error(`FAIL: ${error.message}`);
  }
}

function recordFailure(message, error) {
  const detail = `${message}: ${error?.message || error}`;
  failures.push(detail);
  console.error(`FAIL: ${detail}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  geolocation: { latitude: -16.6869, longitude: -49.2648 },
  permissions: ['geolocation']
});
const page = await context.newPage();
const runtimeErrors = [];

page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});

async function goto(route = '') {
  const url = route ? `${BASE}?p=${route}` : BASE;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#conteudo');
}

await goto();
await page.waitForSelector('#speakPage');
await page.waitForFunction(() => Array.isArray(window.__rapsAddonLoadFailures));

// Prévia DF: região explícita, sem GPS automático, sem ranking inventado.
check(await page.locator('.df-region-entry a[data-route="df-servicos"]').count() === 1, 'capa inclui entrada explícita do Distrito Federal');
check(await page.locator('.df-region-entry').innerText().then(s=>s.includes('Goiânia')), 'capa preserva Goiânia como piloto principal');
check(await page.locator('a[href="tel:192"]').count() > 0, 'capa continua com SAMU 192');
await page.locator('.df-region-entry a[data-route="df-servicos"]').click();
check((await page.locator('h1').first().innerText()).includes('Distrito Federal'), 'entrada DF abre diretório separado');
check(await page.locator('.df-pilot-page .df-service-card').count() === 4, 'DF lista UBS, CAPS, UPAs e hospitais com fontes oficiais');
check(await page.locator('.df-hospital-list .df-hospital-card').count() === 2, 'DF exibe apenas duas referências documentadas de saúde mental');
check(await page.locator('.df-pilot-page a[href="tel:192"]').count() === 1, 'DF preserva SAMU 192 em destaque');
check(await page.locator('.df-pilot-page').innerText().then(s=>s.includes('não calculamos') || s.includes('Não calculamos')), 'DF não inventa menor rota nem hora de chegada');
check(await page.locator('.df-pilot-page').innerText().then(s=>s.includes('GeoJSON') || s.includes('coordenadas')), 'DF sinaliza pendência de importação das coordenadas');
check(await page.locator('.df-pilot-page #roadConsent').count() === 0, 'DF não reutiliza consentimento de roteamento de Goiânia');
check(await page.locator('.df-pilot-page [data-hospital-proximity]').count() === 0, 'DF não herda ranking HUGOL/HUGO');
check(await page.locator('.df-pilot-page a[href*="info.saude.df.gov.br"]').count() >= 4, 'DF aponta para buscadores oficiais');
check(await page.locator('.df-hospital-list a[href*="google.com/maps/dir"]').count() === 6, 'DF oferece rotas por endereço para ambos os hospitais documentados');
const dfMaps=await page.locator('.df-hospital-list a[href*="google.com/maps/dir"]').evaluateAll(links=>links.map(x=>x.href));
check(dfMaps.every(u=>!new URL(u).searchParams.has('origin')), 'links de mapas DF não inferem GPS nem compartilham origem');
const dfRefs=await page.evaluate(()=>window.RAPSDFPilotTest?.references());
check(dfRefs?.length===2 && dfRefs[0].name.includes('São Vicente') && dfRefs[1].name.includes('Base'), 'catálogo DF conserva somente referências verificadas');
for(const width of [320,390,1024]){
  await page.setViewportSize({width,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'página DF não transborda em '+width+'px');
}
await page.setViewportSize({width:390,height:844});
await goto('selecionar-regiao');
check(await page.locator('.df-region-choice a[data-route="inicio"]').count() === 1, 'seletor mantém link de volta para Goiânia');
check(await page.locator('.df-region-choice a[data-route="df-servicos"]').count() === 1, 'seletor permite abrir prévia DF');
await goto('rotas-rede');
check((await page.locator('h1').first().innerText()).includes('Menor trajeto'), 'comparador viário Goiânia continua isolado');
await goto();

check(await page.locator('.home-quick-service-grid [data-service-kind]').count() === 5, 'capa mostra cinco tipos de atendimento de Goiânia');
const homeQuickKinds = await page.locator('.home-quick-service-grid [data-service-kind]').evaluateAll(items=>items.map(el=>el.dataset.serviceKind));
check(JSON.stringify(homeQuickKinds) === JSON.stringify(['psiquiatria','hospital','upa','caps','ubs']), 'capa preserva ordem e categorias da tela Encontrar atendimento');
check(await page.locator('.home-quick-services a[href="tel:192"]').count() === 1, 'SAMU 192 aparece acima dos serviços na capa');
check(await page.locator('.home-quick-service-grid [data-service-kind="psiquiatria"]').isVisible(), 'urgência psiquiátrica fica visível na tela inicial');
check(await page.locator('.home-quick-service-grid [data-service-kind="caps"]').innerText().then(t=>t.includes('Acolhimento')), 'CAPS explica seu tipo de atendimento na capa');
check(await page.locator('.home-quick-service-grid [data-service-kind="ubs"]').innerText().then(t=>t.includes('Consultas')), 'UBS explica seu tipo de atendimento na capa');
check(await page.locator('.home-quick-services').evaluate(el=>el.compareDocumentPosition(document.querySelector('.home-grid')) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0, 'acesso rápido aparece antes das orientações gerais');
check(await page.locator('.home-quick-service-grid a[data-route="onde-ajuda"]').count() === 0, 'cartões da capa levam diretamente ao tipo de serviço');
check(await page.locator('.home-grid .nav-card').count() === 4, 'início oferece quatro escolhas principais');
check(await page.locator('.support-first-entry').count() === 1, 'primeira entrada oferece uso sem cadastro');
check(await page.locator('.support-first-entry a[data-route="onde-ajuda"]').count() === 1, 'primeira entrada mantém atendimento sem cadastro');
check(await page.locator('[data-eval-pulse], [data-post-save-evaluation]').count() === 0, 'início não solicita avaliação antes de uma tarefa');
check(await page.locator('.home-grid a[data-route="avaliacao"]').count() === 0, 'avaliação não ocupa um cartão principal');
check(await page.locator('a[href="tel:192"]').count() > 0, 'emergência permanece acessível no início');
for (const width of [320,390,1024]) {
  await page.setViewportSize({width,height:844});
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `início não transborda em ${width}px`);
}
await page.setViewportSize({width:390,height:844});

await page.locator('.home-quick-service-grid [data-service-kind="upa"]').click();
await page.waitForSelector('#serviceType');
check(await page.locator('#serviceType').inputValue() === 'upa', 'UPA da capa abre diretório já filtrado');
await goto();
await page.locator('.home-quick-service-grid [data-service-kind="caps"]').click();
await page.waitForSelector('#serviceType');
check(await page.locator('#serviceType').inputValue() === 'caps', 'CAPS da capa abre diretório já filtrado');
await goto();
await page.locator('.home-quick-service-grid [data-service-kind="psiquiatria"]').click();
check((await page.locator('h1').first().innerText()).includes('Urgência psiquiátrica'), 'botão psiquiátrico da capa vai para urgência 24h');
await goto();

await goto();
check(await page.locator('.road-home-shortcut a[data-route="rotas-rede"]').count() === 1, 'capa oferece comparação por trajetos de toda a rede');
await goto('rotas-rede');
check((await page.locator('h1').first().innerText()).includes('Menor trajeto'), 'comparador de rotas tem página específica');
check(await page.locator('#roadKind option').count() === 7, 'comparador oferece todas as categorias e a rede completa');
const allRoadServices = await page.evaluate(() => window.RAPSRoadRoutingTest.catalog());
check(allRoadServices.length > 100, 'comparador lê todos os registros cadastrados, incluindo dezenas de UBS');
check(allRoadServices.some(x=>x.name.includes('HUGOL')), 'HUGOL está no catálogo geral de rotas');
check(allRoadServices.filter(x=>x.kind==='ubs').length >= 80, 'comparador inclui todos os registros de atenção básica da versão oficial');
check(await page.locator('#roadConsent').isChecked() === false, 'localização e compartilhamento começam desautorizados');
await page.locator('#roadCalculate').click();
check((await page.locator('#roadStatus').innerText()).includes('Autorize explicitamente'), 'sem consentimento não inicia GPS nem consulta externa');
// Teste determinístico: HUGO mais perto em linha reta, HUGOL menor percurso simulado.
await page.evaluate(() => {
  const records=window.RAPSRoadRoutingTest.catalog();
  window.__rapsRoadTestCoordinates={};
  window.__rapsRoadTestMatrix={};
  records.forEach((x,i)=>{
    if(!x.cnes)return;
    window.__rapsRoadTestCoordinates[x.cnes]={lat:-16.68-i*0.0001,lon:-49.27};
    window.__rapsRoadTestMatrix[x.cnes]={distance:5+i/10,time:400+i*10};
  });
  window.__rapsRoadTestCoordinates['7743068']={lat:-16.61,lon:-49.39};
  window.__rapsRoadTestCoordinates['2338262']={lat:-16.687,lon:-49.265};
  window.__rapsRoadTestMatrix['7743068']={distance:2.2,time:280};
  window.__rapsRoadTestMatrix['2338262']={distance:8.4,time:650};
});
await page.selectOption('#roadKind','todos');
await page.check('#roadConsent');
await page.locator('#roadCalculate').click();
await page.waitForFunction(() => document.querySelector('#roadResults .road-card') !== null);
const roadResultCount=await page.locator('#roadResults .road-card').count();
check(roadResultCount===allRoadServices.length, 'comparador apresenta todos os registros da rede, mesmo os sem rota verificada');
check((await page.locator('#roadResults .road-group').first().locator('.road-card').first().innerText()).includes('HUGOL'), 'menor percurso de vias prioriza HUGOL mesmo quando HUGO é mais perto em linha reta');
check((await page.locator('#roadStatus').innerText()).includes('registros com trajeto calculado'), 'cobertura de rotas é explicitada');
check((await page.locator('.road-metric').first().innerText()).includes('km pelas vias'), 'resultado diferencia trajeto por vias e linha reta');
check(await page.locator('.road-group').count() >= 5, 'resultado da rede completa é agrupado por tipo de cuidado');
await page.selectOption('#roadMode','transit');
check(await page.locator('#roadResults a[href*="travelmode=transit"]').count() > 0, 'ônibus usa mapa externo e não inventa ranking da linha');

// Sonda não bloqueante: a disponibilidade pública do roteador não é garantida.
// Verifica CORS real do X-Client-Id a partir do navegador, usando pontos FICTÍCIOS.
const liveRoadProbe = await page.evaluate(async () => {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),7500);
  try {
    const data={sources:[{lat:-16.670,lon:-49.290}],
      targets:[{lat:-16.667,lon:-49.285}],
      costing:'auto',units:'kilometers'};
    const url='https://valhalla1.openstreetmap.de/sources_to_targets?json='+encodeURIComponent(JSON.stringify(data));
    const response=await fetch(url,{mode:'cors',credentials:'omit',cache:'no-store',
      headers:{'X-Client-Id':'rafaeel147-sketch.github.io/antes-do-primeiro-gole1/raps-no-bolso'},signal:controller.signal});
    if(!response.ok)return {ok:false,detail:'HTTP '+response.status};
    const parsed=await response.json();
    return {ok:typeof parsed?.sources_to_targets?.[0]?.[0]?.distance==='number',detail:'HTTP '+response.status};
  } catch(error){return {ok:false,detail:String(error?.message||error)}}
  finally{clearTimeout(timeout)}
});
console.log('ROUTING_PROVIDER_LIVE_CORS_PROBE: '+JSON.stringify(liveRoadProbe));

// Privacidade: chamadas a motores de rota externos incluem coordenadas e não podem ser salvas no CacheStorage.
const cachedExternalRequests = await page.evaluate(async () => {
  const urls=[];
  for(const key of await caches.keys()){
    const cache=await caches.open(key);
    for(const req of await cache.keys()) urls.push(req.url);
  }
  return urls.filter(url=>url.includes('valhalla1.openstreetmap.de')||url.includes('dadosabertos.go.gov.br'));
});
check(cachedExternalRequests.length===0, 'service worker não armazena URLs externas com localização GPS');



await goto('crise');
check(await page.locator('.priority-crisis-shortcut a[data-route="onde-ajuda"]').count() === 1, 'rota de crise oferece atalho imediato para atendimento');
check(await page.locator('.priority-crisis-psychiatric a[data-route="urgencia-psiquiatrica"]').count() === 1, 'crise mostra entrada psiquiátrica específica');
await goto('urgencia-psiquiatrica');
check(await page.locator('h1').first().innerText() === 'Urgência psiquiátrica 24h', 'pronto-socorro psiquiátrico tem página exclusiva');
check(await page.locator('a[href="tel:192"]').count() > 0, 'urgência psiquiátrica oferece SAMU sem GPS');
check(await page.locator('[data-support-name]').count() === 1, 'urgência psiquiátrica oferece aviso ao contato');
await goto();
await page.locator('.home-grid a[data-route="onde-ajuda"]').click();
check(await page.locator('.priority-emergency a[href="tel:192"]').count() === 1, 'SAMU 192 permanece livre de exigência de GPS');
const serviceOrder = await page.locator('[data-service-kind]').evaluateAll(items=>items.map(el=>el.dataset.serviceKind));
check(JSON.stringify(serviceOrder) === JSON.stringify(['psiquiatria','hospital','upa','caps','ubs']), 'serviços em ordem hospital, UPA, CAPS, UBS');
await page.locator('[data-service-kind="ubs"]').click();
await page.waitForSelector('#ubsSearch');
check(await page.locator('#ubsSearch').isVisible(), 'Escolher UBS abre diretamente a busca de unidades');
check(!(await page.locator('#ubsLocationStatus').innerText()).includes('ainda não solicitada'), 'escolher UBS inicia GPS opcional sem bloquear o diretório');
await goto('onde-ajuda');
await page.locator('[data-service-kind="upa"]').click();
await page.waitForSelector('#serviceResults');
check(await page.locator('#serviceType').inputValue() === 'upa', 'escolher UPA aplica filtro de urgência diretamente');
check(!(await page.locator('#locationStatus').innerText()).includes('ainda não solicitada'), 'escolher UPA inicia GPS opcional sem bloquear a lista');
await goto('onde-ajuda');
await page.locator('[data-service-kind="caps"]').click();
await page.waitForSelector('#serviceResults');
check(await page.locator('#serviceType').inputValue() === 'caps', 'escolher CAPS mostra a família de serviços CAPS');
check(await page.locator('#serviceResults .service-card').count() > 0, 'filtro CAPS retorna serviços');
// A lista sem GPS não afirma qual hospital está mais próximo.
await goto('hospitais-urgencia');
check((await page.locator('#hospitalLocationStatus').innerText()).includes('não está ordenada por distância'), 'sem GPS hospital não inventa ranking por proximidade');
check((await page.locator('.priority-hospital-list article').count()) === 2, 'HUGO e HUGOL estão na lista mesmo sem GPS');
await goto('onde-ajuda');
await context.setGeolocation({latitude:-16.649,longitude:-49.338});
await page.evaluate(() => {
  window.__rapsHospitalGeoTestCoordinates = {
    '7743068':{lat:-16.648,lng:-49.337},
    '2338262':{lat:-16.700,lng:-49.270}
  };
});
await page.locator('[data-service-kind="hospital"]').click();
check((await page.locator('h1').first().innerText()).includes('Hospital'), 'escolher hospital abre informações hospitalares');
check(await page.locator('.priority-hospital-list article').count() === 2, 'hospitais exibem duas referências com fontes oficiais');
await page.waitForFunction(() => document.getElementById('hospitalLocationStatus')?.dataset.state === 'ok');
check(await page.locator('.priority-hospital-list article').first().getAttribute('data-hospital-cnes') === '7743068', 'GPS fictício próximo ao HUGOL coloca HUGOL primeiro');
check((await page.locator('#hospitalLocationStatus').innerText()).includes('linha reta'), 'distância hospitalar é identificada como linha reta e não percurso');
check(await page.locator('.hospital-distance').count() === 2, 'distâncias aparecem só para hospitais com coordenadas validadas');
check((await page.locator('.priority-hospital-list article').first().innerText()).includes('regulação'), 'cartão HUGOL avisa que acesso pode depender de regulação');
check((await page.locator('[data-hospital-address]').first().getAttribute('href')).includes('origin='), 'rota hospitalar passa GPS autorizado como origem apenas ao abrir Maps');
await goto('onde-ajuda');
await context.setGeolocation({latitude:-16.700,longitude:-49.269});
await page.evaluate(() => {
  window.__rapsHospitalGeoTestCoordinates = {
    '7743068':{lat:-16.648,lng:-49.337},
    '2338262':{lat:-16.700,lng:-49.270}
  };
});
await page.locator('[data-service-kind="hospital"]').click();
await page.waitForFunction(() => document.getElementById('hospitalLocationStatus')?.dataset.state === 'ok');
check(await page.locator('.priority-hospital-list article').first().getAttribute('data-hospital-cnes') === '2338262', 'GPS fictício próximo ao HUGO coloca HUGO primeiro sem viés fixo');
await context.setGeolocation({latitude:-16.6869,longitude:-49.2648});
await goto();

check(await page.locator('#fontDown').isVisible(), 'A− está visível no viewport mobile');
check(await page.locator('#fontUp').isVisible(), 'A+ está visível no viewport mobile');
check(await page.locator('#contrast').isVisible(), 'controle de contraste está visível');
check(await page.locator('#speakPage').isVisible(), 'controle de leitura está visível');

const brandTextDisplay = await page.locator('.brand > span:last-child').evaluate(el => getComputedStyle(el).display);
check(brandTextDisplay === 'none', 'cabeçalho mobile compacta apenas o texto visual da marca');
check(await page.locator('.brand-mark').isVisible(), 'símbolo R+ permanece visível no mobile');

const initialScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
await page.click('#fontUp');
const largerScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
check(largerScale > initialScale, 'A+ aumenta a escala do texto');
await page.click('#fontDown');
const restoredScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
check(restoredScale <= largerScale, 'A− reduz a escala do texto');

await page.click('#contrast');
check(await page.locator('body').evaluate(el => el.classList.contains('high-contrast')), 'alto contraste é ativado');
await page.click('#contrast');
check(!(await page.locator('body').evaluate(el => el.classList.contains('high-contrast'))), 'alto contraste é desativado');

await page.click('#menuButton');
check(await page.locator('#drawer').evaluate(el => el.classList.contains('open')), 'menu lateral abre');
check(await page.locator('#closeMenu').evaluate(el => document.activeElement === el), 'menu recebe foco ao abrir');
check(await page.getByRole('link',{name:'Pesquisador — abrir Cidade Unida',exact:true}).getAttribute('href') === 'https://cidade-unida.vercel.app/', 'Pesquisador aponta diretamente para Cidade Unida');
await page.click('#closeMenu');
check(!(await page.locator('#drawer').evaluate(el => el.classList.contains('open'))), 'menu lateral fecha');
check(await page.locator('#drawer').evaluate(el => el.inert), 'menu fechado não recebe navegação pelo teclado');

// Piloto Goiânia: cadastro local voluntário, aviso e escalonamento não-destrutivo.
await goto('rede-apoio');
check(await page.locator('#supportContactsForm .support-contact').count() === 4, 'cadastro disponibiliza quatro contatos');
await page.fill('[name="support-name-0"]', 'Contato fictício CI');
await page.fill('[name="support-phone-0"]', '62912345678');
await page.check('[name="support-informed-0"]');
await page.locator('#supportContactsForm button[type="submit"]').click();
check((await page.locator('#supportSaveStatus').innerText()).includes('Marque a autorização'), 'cadastro sem consentimento não salva contatos');
await page.check('#supportStorageConsent');
await page.locator('#supportContactsForm button[type="submit"]').click();
check((await page.locator('#supportSaveStatus').innerText()).includes('1 contato(s) salvo(s)'), 'contato é salvo após autorização explícita');
await goto('rede-apoio');
check(await page.locator('[name="support-name-0"]').inputValue() === 'Contato fictício CI', 'contato local persiste na navegação');
await goto('urgencia-psiquiatrica');
await page.locator('[data-support-name]').click();
check((await page.locator('#supportDestinationName').innerText()).includes('Wassily Chuc'), 'aviso recebe destino psiquiátrico escolhido');
check((await page.locator('#supportLocationStatus').innerText()).includes('Não solicitamos'), 'localização do aviso não é solicitada automaticamente');
await page.locator('#supportStartFlow').click();
check((await page.locator('#supportStartStatus').innerText()).includes('Autorize'), 'aviso real exige autorização nesta solicitação');
await page.check('#supportSendConsent');
await page.locator('#supportStartFlow').click();
check((await page.locator('.support-active-flow h2').innerText()).includes('Contato fictício CI'), 'fluxo real prepara primeiro contato salvo');
check(await page.locator('.support-active-flow [data-external-channel="WhatsApp"]').count() === 1, 'WhatsApp possui link de mensagem pré-preenchida');
check((await page.locator('.support-active-flow [data-external-channel="WhatsApp"]').getAttribute('href')).includes('Wassily'), 'link WhatsApp inclui nome do destino');
await page.locator('#supportNextContact').click();
check((await page.locator('#supportFlowContainer').innerText()).includes('Nenhum contato restante'), 'escalonamento não inventa contatos');
await page.locator('#supportResetFlow').click();
await page.locator('#supportStartDemo').click();
check((await page.locator('.support-active-flow h2').innerText()).includes('Demonstração'), 'demonstração isolada tem status visível');
check(await page.locator('[data-external-channel]').count() === 0, 'demonstração não possui links externos de envio');
await page.evaluate(() => {
  window.__supportRealNow = Date.now;
  const base = Date.now();
  Date.now = () => base + 61000;
});
await page.waitForFunction(() => document.querySelector('.support-active-flow h2')?.textContent?.includes('Contato 2'));
await page.evaluate(() => { Date.now = window.__supportRealNow; });
check((await page.locator('.support-active-flow h2').innerText()).includes('Contato 2'), 'prazo de um minuto avança automaticamente na interface sem envio externo');
await page.locator('#supportNextContact').click();
check((await page.locator('.support-active-flow h2').innerText()).includes('Contato 3'), 'demonstração permite avançar manualmente ao contato seguinte');
await page.locator('#supportMarkResponded').click();
check((await page.locator('#supportFlowContainer').innerText()).includes('Resposta registrada pelo usuário'), 'resposta manual encerra escalonamento sem alegar confirmação automática');
await page.locator('#supportResetFlow').click();
await goto('servicos-goiania');
check(await page.locator('.service-card [data-route="rede-apoio-aviso"]').count() > 0, 'diretório municipal liga serviço à rede de apoio');
await goto('ubs-goiania');
check(await page.locator('.service-card [data-route="rede-apoio-aviso"]').count() > 0, 'diretório UBS liga serviço à rede de apoio');

await goto('dados-locais');
check(await page.locator('.task-grid a[data-route="pesquisa-painel-agregado"]').count() === 1, 'área de dados mantém acesso à exportação agregada');
check(await page.locator('.task-grid a[data-route="participacao-demandas"]').count() === 1, 'área de dados mantém acesso à exportação de participação');

await goto('encontre-caminho');
await page.click('[data-path-key="recaida"]');
await page.waitForSelector('.path-result');
check((await page.locator('.path-result').innerText()).includes('Recaída não precisa virar afastamento do cuidado'), 'Encontre o caminho renderiza resultado de recaída');
check(await page.locator('.path-result a[data-route="ad-recaida"]').count() === 1, 'resultado de recaída aponta para ad-recaida');
await page.click('.path-result a[data-route="ad-recaida"]');
await page.waitForSelector('h1');
check((await page.locator('h1').first().innerText()).includes('Tive uma recaída'), 'navegação abre a rota canônica de recaída');

await goto('abstinencia');
await page.waitForSelector('h1');
check((await page.locator('h1').first().innerText()).includes('Estou com abstinência'), 'alias legado abstinencia continua funcional');

await goto('ad-abstinencia');
check((await page.locator('h1').first().innerText()).includes('Estou com abstinência'), 'rota canônica ad-abstinencia funciona');

await goto('direitos-atendimento');
await page.locator('#conteudo details > summary').evaluateAll(items => items.forEach(item => { item.parentElement.open = true; }));
const rightsText = await page.locator('#conteudo').innerText();
check(rightsText.includes('Não possuir ou não portar documento com o número do CPF ou CNS não é, por si só, impedimento ao atendimento.'), 'página de direitos renderiza a regra atual de CPF/CNS');
check(rightsText.includes('art. 258'), 'página de direitos renderiza a ressalva do art. 258');
check(!rightsText.includes('Portaria GM/MS nº 940/2011, art. 13'), 'página final de direitos não exibe mais a orientação antiga da Portaria 940/2011');

await goto('onde-ajuda');
await page.locator('#serviceExplanation > summary').click();
const helpText = await page.locator('#conteudo').innerText();
check(helpText.includes('Sem o número do CPF/CNS?'), 'Onde buscar ajuda usa o cabeçalho atualizado de CPF/CNS');
check(helpText.includes('outro documento válido'), 'Onde buscar ajuda renderiza a regra atual de identificação');

await goto('servicos-goiania');
await page.waitForSelector('#serviceResults');
check((await page.locator('#serviceResults').innerText()).includes('UPA Chácara do Governador'), 'diretório inclui UPA Chácara do Governador');
await page.selectOption('#serviceType', 'upa');
await page.waitForTimeout(100);
check(await page.locator('#serviceResults .service-card').count() >= 4, 'filtro UPA retorna pelo menos quatro unidades verificadas');

await page.evaluate(() => {
  window.__rapsServiceProximityTestCoordinates = {
    '7304188': { lat: -16.7414, lng: -49.2847, municipio: 'GOIANIA' },
    '7821379': { lat: -16.6030, lng: -49.3220, municipio: 'GOIANIA' },
    '2339552': { lat: -16.6750, lng: -49.2050, municipio: 'GOIANIA' },
    '2339528': { lat: -16.7150, lng: -49.2850, municipio: 'GOIANIA' }
  };
});
await page.click('#useLocation');
await page.waitForFunction(() => document.getElementById('useLocation')?.textContent?.includes('Localização ativada'));
await page.waitForFunction(() => {
  const status = document.getElementById('locationStatus')?.innerText || '';
  const route = [...document.querySelectorAll('#serviceResults a')].find(a => /Traçar rota/i.test(a.textContent || ''));
  return status.includes('apenas em memória') && Boolean(route?.href?.includes('origin='));
});
check((await page.locator('#locationStatus').innerText()).includes('apenas em memória'), 'GPS informa uso apenas em memória');
const routeHref = await page.locator('#serviceResults a', { hasText: 'Traçar rota' }).first().getAttribute('href');
check(Boolean(routeHref && routeHref.includes('origin=')), 'rota externa recebe origem somente após GPS autorizado');

await goto('ubs-goiania');
await page.waitForSelector('#ubsResults');
await page.fill('#ubsSearch', 'Estrela Dalva');
await page.waitForTimeout(100);
const ubsText = await page.locator('#ubsResults').innerText();
check(ubsText.includes('Estrela Dalva'), 'busca de UBS encontra Estrela Dalva');
check((await page.locator('#ubsCount').innerText()).startsWith('1 registro'), 'filtro de UBS reduz o resultado para o registro esperado');

const addonFailures = await page.evaluate(() => window.__rapsAddonLoadFailures || []);
check(Array.isArray(addonFailures) && addonFailures.length === 0, 'nenhum addon falhou ao carregar no navegador');
check(runtimeErrors.length === 0, `nenhum erro JavaScript/console ocorreu (${runtimeErrors.join(' | ') || '0 erros'})`);

try {
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload({ waitUntil: 'networkidle' });
  }
  check(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'service worker controla a página antes do teste offline');
  await context.setOffline(true);
  await page.goto(`${BASE}?p=ad-abstinencia`, { waitUntil: 'domcontentloaded' });
  // O HTML inicial já contém um h1: esperar a rota renderizada evita falso negativo.
  await page.waitForFunction(() => document.querySelector('#conteudo h1')?.textContent?.includes('Estou com abstinência'), null, { timeout: 10000 });
  check((await page.locator('#conteudo h1').first().innerText()).includes('Estou com abstinência'), 'rota principal continua disponível offline pelo service worker');
  await context.setOffline(false);
} catch (error) {
  await context.setOffline(false).catch(() => {});
  recordFailure('PWA offline não passou no Chromium', error);
}

const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
try {
  await deniedContext.clearPermissions();
  const deniedPage = await deniedContext.newPage();
  await deniedPage.goto(`${BASE}?p=servicos-goiania`, { waitUntil: 'networkidle' });
  await deniedPage.waitForSelector('#useLocation');
  await deniedPage.click('#useLocation');
  await deniedPage.waitForFunction(() => document.getElementById('locationStatus')?.dataset.state === 'error');
  const deniedText = await deniedPage.locator('#locationStatus').innerText();
  check(deniedText.includes('Permissão de localização negada'), 'GPS negado mantém o diretório utilizável e informa a recusa');
  check(await deniedPage.locator('#serviceResults .service-card').count() > 0, 'serviços continuam visíveis com GPS negado');
} catch (error) {
  recordFailure('Cenário de GPS negado não passou no Chromium', error);
} finally {
  await deniedContext.close();
}

const unavailableContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
try {
  const unavailablePage = await unavailableContext.newPage();
  await unavailablePage.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
  });
  await unavailablePage.goto(`${BASE}?p=servicos-goiania`, { waitUntil: 'networkidle' });
  await unavailablePage.waitForSelector('#useLocation');
  await unavailablePage.click('#useLocation');
  const unavailableText = await unavailablePage.locator('#locationStatus').innerText();
  check(unavailableText.includes('não oferece geolocalização'), 'navegador sem geolocalização recebe fallback explícito');
  check(await unavailablePage.locator('#serviceResults .service-card').count() > 0, 'diretório funciona sem API de geolocalização');
} catch (error) {
  recordFailure('Cenário sem API de geolocalização não passou no Chromium', error);
} finally {
  await unavailableContext.close();
}

await context.close();
await browser.close();

if (failures.length) {
  console.error('\nFalhas do smoke funcional:');
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('\nRAPS no Bolso browser smoke: PASS');
