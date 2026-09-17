// Diretório de Atenção Básica de Goiânia — fonte oficial da Prefeitura, PDF atualizado em 2026.
// A lista oficial vinculada pela Prefeitura contém 87 registros nesta versão do PDF.
// A página institucional, porém, informa 80 unidades de Atenção Primária. O app expõe essa divergência
// em vez de ocultá-la. Não há ordenação interna por distância porque o PDF não publica coordenadas.
(function ubsGoianiaAddon(){
  const VERIFIED_AT = '12/09/2026';
  const SOURCE = 'https://www.goiania.go.gov.br/wp-content/uploads/2026/07/ENDERECOS-UNIDADES-ATENCAO-BASICA.pdf';
  const PAGE_SOURCE = 'https://www.goiania.go.gov.br/urgenciaemergencia/';
  const raw = `CAMPINAS CENTRO|CS|2338491|Criméia Leste|Rua Senador Antônio Martins Borges, Qd. 28, Lt. 09, Setor Crimeia Leste|7–19h
CAMPINAS CENTRO|USF|5915066|Crimeia Oeste (Lucas Faria de Souza)|Av. Goiás Norte, Setor Crimeia Oeste|7–17h
CAMPINAS CENTRO|CAIS|2506327|Deputado João Natal (Vila Nova)|Av. Industrial, Qd. D03, Lt. 16/17, Setor Vila Nova|24h
CAMPINAS CENTRO|CS|2506823|Esplanada do Anicuns|Alameda do Progresso, s/n, Qd. 02, Setor Esplanada dos Anicuns|7–19h
CAMPINAS CENTRO|CS|2338521|Fama|Rua 10, nº 76, Setor Marechal Rondon|7–19h
CAMPINAS CENTRO|USF|3402177|Leste Universitário|Rua 218, Qd. A2, Lt. 10, Setor Leste Universitário|7–18h
CAMPINAS CENTRO|CS|2338572|Marinho Lemos (Setor Negrão de Lima)|Av. Armando de Godoy, Qd. 29, Lt. 6/7, Setor Negrão de Lima|7–19h
CAMPINAS CENTRO|CS|2338483|Norte Ferroviário|Rua 05, Qd. A1, Lt. 14, Setor Norte Ferroviário|7–19h
CAMPINAS CENTRO|CS|2339250|Vila Moraes|Rua 9A, Qd. 12, Lt. 61, Vila Moraes|7–19h
CAMPINAS CENTRO|USF|2338548|Vila Santa Helena|Rua 21, Qd. 01, Lt. 22/23, Vila Paraíso|7–18h
CAMPINAS CENTRO|CS|2339382|Vila Canaã|Rua Langendoeffer (Heitor Fleury), Qd. 01, Lt. 01, s/n, Vila Canaã|7–19h
LESTE|USF|2339269|Aruanã III|Rua Urucara, Qd. 03, Lt. 11, Conjunto Aruanã III|7–18h
LESTE|CS|2339277|Conjunto Riviera|Rua X10, Qd. X12, Lt. 02, Jardim Brasil|7–18h
LESTE|CS|2339293|Dr. Afonso Honorato da Silva e Souza (Água Branca)|Rua 01, Qd. E, Lt. 08, Setor Água Branca|7–18h
LESTE|USF|6949886|Jardim das Aroeiras|Rua Couto Magalhães, Qd. 23, Lt. 24, Jardim das Aroeiras|7–18h
LESTE|USF|5411696|Jardim Dom Fernando|Rua 218, Qd. 30, s/n, Jardim Dom Fernando II|7–18h
LESTE|USF|2665247|Jardim Mariliza|Av. Aristóteles, Qd. 29, Lt. 18, Jardim Mariliza|7–18h
LESTE|CAIS|2339315|Jardim Novo Mundo|Av. New York, Qd. 137, Jardim Novo Mundo|24h
LESTE|USF|2665239|Parque Atheneu|Av. Parque Atheneu, Lt. 16/18, Unidade 201, Parque Atheneu|7–17h
LESTE|CAIS|2339323|Parque das Amendoeiras|Av. Francisco Ludovico de Almeida, Qd. 24, Setor Parque das Amendoeiras|24h
LESTE|USF|2653850|Recanto das Minas Gerais Militão R. de Araújo|Rua Sienna, APM 01, Jardim Maria Helena|7–18h
LESTE|USF|5417457|Santo Hilário|Rua Juscelino da Fonseca Ribeiro, Qd. 14, Lt. 09, Bairro Santo Hilário|7–17h
LESTE|USF|2653893|Vila Pedroso|Av. Santa Cruz, Qd. B1, Lt. 13, Vila Pedroso|7–17h
LESTE|USF|2653842|Ville de France|Rua Pires Figueiredo, Qd. 04, Lt. 03, Residencial Ville de France|7–17h
NOROESTE|USF|2506424|Bairro da Vitória|Av. Comercial, Qd. 31, Lt. 03, Área III, Bairro da Vitória|7–18h
NOROESTE|USF|3009882|Barravento|Rua Percival Xavier Rebello, Qd. 20, Lt. 08, Residencial Barravento|7–18h
NOROESTE|USF|2673967|Boa Vista|Av. dos Ipês, Qd. 02, Lt. Área, Bairro Boa Vista|7–17h
NOROESTE|USF|5886821|Brisas da Mata|Rua BM10, Qd. 21, Lt. 62, Residencial Brisas da Mata|7–18h
NOROESTE|CAIS|2626691|Cândida de Morais|Av. Perimetral Norte, Qd. 09B, Lt. 01, Setor Cândida de Morais|24h
NOROESTE|USF|2506394|Condomínio Morada do Sol|Rua Boreal, Qd. 188, Lt. 07, Condomínio Morada do Sol|7–18h
NOROESTE|USF|2506386|Estrela Dalva|Rua 16 de Maio, Qd. 04, Lt. 32, Setor Estrela Dalva|7–18h
NOROESTE|CAIS|2506335|Finsocial (CAIS)|Rua VF64, Qd. 49, Setor Finsocial|24h
NOROESTE|USF|2506335|Finsocial (USF)|Rua VF64, Qd. 49, Setor Finsocial|7–18h
NOROESTE|USF|6823904|Jardim Curitiba I|Rua JC22, Área Verde, Jardim Curitiba II|7–18h
NOROESTE|USF|2653834|Jardim Primavera|Rua CP38, Qd. 47, Lt. 01/03, Jardim Primavera|7–18h
NOROESTE|USF|2506742|Novo Planalto|Rua VM 3E, Qd. 95, Área APM, Setor Novo Planalto|7–18h
NOROESTE|USF|2506378|Recanto do Bosque|Rua Tropical, Qd. 28, Lt. 115, Setor Recanto do Bosque|7–18h
NOROESTE|USF|2506416|São Carlos|Rua SC25, Qd. 28, Lt. 08, Bairro São Carlos|7–18h
NOROESTE|USF|3009890|VF 18|Rua VF18, Qd. 13, Lt. 09, Vila Finsocial|7–18h
NOROESTE|USF|2506874|Vila Mutirão|Av. do Povo, Quadra D, Vila Mutirão|7–18h
NORTE|USF|7247214|Antonio Carlos Pires|Rua ACP4, APM 6, Setor Antonio Carlos Pires|7–18h
NORTE|CS|2506777|Benedito dos Santos Vieira (Setor Perim)|Av. Perim, Qd. 12, Lt. 14, Setor Perim|7–17h
NORTE|USF|3009874|Cachoeira Dourada|Rua Cachoeira Dourada, Qd. 86, Lt. 08, Jardim Guanabara I|7–18h
NORTE|CS|7381549|Campus Samambaia|Av. Pau Brasil, nº 2, ao lado da Faculdade de Educação Física, Campus Samambaia|7–19h
NORTE|USF|2653885|Distrito Vila Rica|Av. Principal, s/n, GO-080, km 20, Distrito de Vila Rica|7–17h
NORTE|CS|2506807|Isabel Maria da Silva (Vila Maria Dilce)|Rua 11 de Julho, Qd. 11, Lt. 11/15, Vila Maria Dilce|7–19h
NORTE|USF|2664739|Itatiaia|Rua R12, Qd. 11, s/n, Conjunto Itatiaia I|7–18h
NORTE|CS|2338505|Jardim Balneário Meia Ponte|Rua dos Paranaenses, Qd. F7, s/n, Jardim Balneário Meia Ponte|7–19h
NORTE|USF|2653869|Jardim Guanabara I|Rua Porto Alegre, Qd. 13, Lt. 1, Jardim Guanabara|7–18h
NORTE|CAIS/CSF|6949231|Jardim Guanabara III|Rua GB14, Qd. 61, Lt. 17, Jardim Guanabara III|7–18h
NORTE|USF|2653877|Morada Vale dos Sonhos|Rua Maria de Jesus, s/n, Qd. 57, Lt. 12, Residencial Vale dos Sonhos|7–18h
NORTE|USF|2339455|São Judas Tadeu|Av. Brasília, Qd. 30, s/n, Setor São Judas Tadeu|7–18h
NORTE|CS|2506653|Vila Clemente|Rua dos Tamoios, Qd. 06, Lt. 03/04, Vila Clemente|7–19h
OESTE|USF|2339447|Bairro Goiá|Av. Padre Monte, Qd. 14, Lt. 12, Casa 01/02, Bairro Goiá|7–18h
OESTE|CAIS|3989607|Bairro Goiá (CAIS)|Av. Santa Maria, Chácara Santa Rita, Bairro Goiá|24h
OESTE|USF|6634842|Buena Vista|Rua João Amoreles, Qd. APM II, Lt. zero, Residencial Buena Vista I|7–18h
OESTE|USF|3989569|Eldorado Oeste|Rua ELO22, Qd. 22, Lt. 35, Parque Eldorado Oeste|7–18h
OESTE|USF|2506718|Goiânia Viva|Rua GV17A, Qd. 46, Casa da Chácara Taquaral, Reserva Ecológica do Residencial Goiânia Viva|7–18h
OESTE|USF|3989577|Jardim Aritana|Rua Professor José Ferreira Cunha, Qd. 09, Lt. 12, Casa 03, Jardim Aritana|7–18h
OESTE|USF|6056717|Jardim Mirabel|Rua BG04, Qd. 03, Lt. 05, Bairro Goiá IV|7–18h
OESTE|USF|6469744|Jardins do Cerrado IV|Rua das Paineiras, APM 06, Qd. 21, Lt. 0, Residencial Jardim do Cerrado IV|7–18h
OESTE|USF|7011555|Jardins do Cerrado VI|Rua JC202, APM 03, Jardim do Cerrado VI|7–19h
OESTE|USF|5915120|Luana Park|Rua Estrada D, Qd. 01, Lt. 14, Setor Luana Park|7–18h
OESTE|USF|2506793|Parque dos Buritis|Rua Rosimira Marques, s/n, Parque dos Buritis|7–18h
OESTE|CS|2339390|Parque Industrial João Braz|Rua Rodrigues Alves, esquina, Qd. 52, Lt. 14/15, Parque Industrial João Braz|7–19h
OESTE|USF|5277930|Residencial Ytapua|Av. Noel Rosa, Qd. 08, Lt. 06, Residencial Ytapua|7–18h
OESTE|USF|2506785|São Francisco|Av. das Palmeiras, Qd. 89, Lt. 10, Bairro São Francisco|7–18h
OESTE|USF|2339420|Vera Cruz I|Rua Eunice Weaver, Qd. 32T, 1ª etapa, Conjunto Vera Cruz I|7–18h
OESTE|USF|2339439|Vera Cruz II|Av. Leopoldo de Bulhões, Qd. 100, s/n, Conjunto Vera Cruz II|7–18h
OESTE|USF|2339331|Vila Regina|Rua São Miguel, Qd. 28, Lt. 01 a 03, Vila Regina|7–18h
SUDOESTE|USF|2653907|Andreia Cristina|Av. Blumenau, Qd. 28, Lt. 176, Setor Andréia Cristina|7–18h
SUDOESTE|USF|2673940|Condomínio das Esmeraldas|Rua 17, Qd. 39, Lt. 04, s/n, Condomínio das Esmeraldas I|7–18h
SUDOESTE|USF|5919789|Eli Forte|Rua EF30, Qd. 27, Lt. 20, Residencial Eli Forte|7–18h
SUDOESTE|USF|2673959|Garavelo B|Av. Central, Qd. 56, Lt. 16, Setor Garavelo B|7–18h
SUDOESTE|USF|5376564|Grajau|Rua G01, Qd. 01, Lt. 13, Setor Grajaú|7–18h
SUDOESTE|USF|2506912|Jardim Caravelas|Rua JCA12, Qd. 07, Lt. 15, Jardim Caravelas|7–18h
SUDOESTE|CS|2339641|José Egídio Martins (Vila União)|Rua U47, Qd. 12, s/n, Vila União|7–19h
SUDOESTE|USF|3373681|Madre Germana|Av. José Barbosa dos Reis, Qd. 53, Lt. 01, Conjunto Habitacional Madre Germana II|7–18h
SUDOESTE|CIAMS|2339412|Novo Horizonte|Rua Engenheiro José Martins Filho, Setor Novo Horizonte|24h
SUDOESTE|CS|2339366|Parque Anhanguera|Travessa Machado de Assis, Qd. 2A, Lt. 1 a 8, Parque Anhanguera|7–19h
SUDOESTE|USF|3238458|Parque Santa Rita|Av. Americano do Brasil, s/n, Qd. 02, Lt. 06, Parque Santa Rita|7–18h
SUDOESTE|USF|6297587|Real Conquista|Rua RC51, Qd. 48, APM, Setor Real Conquista|7–18h
SUDOESTE|USF|2506939|Residencial Itaipu|Rua RI34, esquina com RI08 e RI09, Qd. 89, Área 1, Residencial Itaipu|7–18h
SUDOESTE|CS|2339358|Vila Boa|Av. Barão do Rio Branco, s/n, Vila Boa|7–19h
SUDOESTE|CS|2339374|Vila Mauá|Av. das Bandeiras, Qd. 35, Lt. 11/12, Vila Mauá|7–19h
SUL|CS|2339544|Hortência Mendonça Vila Redenção|Rua R7, esquina com Av. Jardim Botânico, Vila Redenção|7–19h
SUL|CS|2339560|Parque Amazônia|Praça José Rodrigues de Morais Neto, s/n, Parque Amazônia|7–19h`;
  const units = raw.split('\n').filter(Boolean).map(line => {
    const [district,type,cnes,name,address,hours] = line.split('|');
    return {district,type,cnes,name,address,hours,open24:hours==='24h'};
  });

  let deviceLocation = null;

  function esc(value='') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function mapsRoute(unit) {
    const destination = encodeURIComponent(`${unit.address}, Goiânia - GO`);
    const origin = deviceLocation ? `&origin=${encodeURIComponent(deviceLocation.lat + ',' + deviceLocation.lng)}` : '';
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${destination}`;
  }

  function nearbyMapUrl() {
    if(!deviceLocation) return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Unidade Básica de Saúde Goiânia GO');
    const q = `Unidade Básica de Saúde perto de ${deviceLocation.lat},${deviceLocation.lng}`;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  function typeText(type) {
    return ({USF:'Unidade de Saúde da Família',CS:'Centro de Saúde',CAIS:'CAIS','CAIS/CSF':'CAIS / Saúde da Família',CIAMS:'CIAMS'})[type] || type;
  }

  function filtered() {
    const q = (document.getElementById('ubsSearch')?.value || '').trim().toLocaleLowerCase('pt-BR');
    const district = document.getElementById('ubsDistrict')?.value || 'todos';
    const type = document.getElementById('ubsType')?.value || 'todos';
    const only24 = Boolean(document.getElementById('ubs24h')?.checked);
    return units.filter(unit => {
      const haystack = `${unit.name} ${unit.address} ${unit.district} ${unit.cnes}`.toLocaleLowerCase('pt-BR');
      return (!q || haystack.includes(q))
        && (district === 'todos' || unit.district === district)
        && (type === 'todos' || unit.type === type)
        && (!only24 || unit.open24);
    });
  }

  function card(unit) {
    return `<article class="panel service-card">
      <div class="service-card-top"><div><span class="badge">${esc(unit.type)}</span><h3>${esc(unit.name)}</h3></div>${unit.open24?'<span class="service-24">24h</span>':''}</div>
      <p><strong>${esc(typeText(unit.type))}</strong> · Distrito ${esc(unit.district)}</p>
      <p><strong>Horário:</strong> ${esc(unit.hours)}</p>
      <p><strong>Endereço:</strong> ${esc(unit.address)}, Goiânia - GO</p>
      <p class="small"><strong>CNES:</strong> ${esc(unit.cnes)}</p>
      <div class="hero-actions">
        <a class="btn" href="${mapsRoute(unit)}" target="_blank" rel="noopener noreferrer">Traçar rota ↗</a>
        <a class="btn secondary" href="${SOURCE}" target="_blank" rel="noopener noreferrer">Fonte oficial ↗</a>
      </div>
    </article>`;
  }

  function renderUbsResults() {
    const target = document.getElementById('ubsResults');
    if(!target) return;
    const results = filtered();
    target.innerHTML = results.length ? results.map(card).join('') : '<section class="panel warning"><h3>Nenhuma unidade encontrada</h3><p>Retire algum filtro ou tente outra palavra.</p></section>';
    const count = document.getElementById('ubsCount');
    if(count) count.textContent = `${results.length} registro${results.length===1?'':'s'} exibido${results.length===1?'':'s'}`;
  }

  function status(message,state='') {
    const el = document.getElementById('ubsLocationStatus');
    if(!el) return;
    el.textContent = message;
    el.dataset.state = state;
  }

  function useLocation() {
    if(!navigator.geolocation) {
      status('Este navegador não oferece geolocalização. Você ainda pode pesquisar pelo bairro e abrir rotas.', 'error');
      return;
    }
    status('Pedindo sua localização ao aparelho…');
    navigator.geolocation.getCurrentPosition(pos => {
      deviceLocation = {lat:pos.coords.latitude,lng:pos.coords.longitude};
      status('Localização pronta. Ela não é salva pelo RAPS no Bolso. Os botões de rota passam a usar sua posição como origem.', 'ok');
      const btn = document.getElementById('ubsUseLocation');
      if(btn) btn.textContent = '✓ Localização ativada';
      const nearby = document.getElementById('ubsNearbyMap');
      if(nearby) nearby.href = nearbyMapUrl();
      renderUbsResults();
    }, err => {
      const msg = err.code===1?'Permissão negada. Você pode continuar usando busca e filtros.':err.code===3?'A localização demorou demais. Tente novamente.':'Não foi possível obter sua localização agora.';
      status(msg,'error');
    }, {enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  }

  if(!menuItems.some(([route]) => route === 'ubs-goiania')) {
    const idx = menuItems.findIndex(([route]) => route === 'servicos-goiania');
    menuItems.splice(idx >= 0 ? idx + 1 : menuItems.length, 0, ['ubs-goiania','🏘️','UBS em Goiânia','Atenção Básica por distrito, bairro e tipo']);
  }

  pages['ubs-goiania'] = () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('UBS em Goiânia','Diretório da Atenção Básica com endereços, CNES, horários e filtros por distrito. Dados extraídos da lista oficial vinculada pela Prefeitura.','Atenção Primária')}
      <section class="panel warning">
        <h2>Há uma divergência na própria fonte oficial</h2>
        <p>A página da Prefeitura informa <strong>80 unidades</strong> de Atenção Primária. O PDF oficial atualmente vinculado nessa mesma página contém <strong>${units.length} registros</strong> (incluindo CAIS/CIAMS e uma duplicidade de CNES no Finsocial). Para não inventar qual contagem é a correta, o app mostra os registros do PDF e identifica a fonte.</p>
        <p class="small">Verificado em ${VERIFIED_AT}. <a href="${PAGE_SOURCE}" target="_blank" rel="noopener noreferrer">Página da Prefeitura ↗</a> · <a href="${SOURCE}" target="_blank" rel="noopener noreferrer">PDF oficial ↗</a></p>
      </section>

      <section class="panel success service-location-box">
        <div>
          <h2>Usar minha localização</h2>
          <p>É opcional. A posição fica apenas em memória e serve como origem ao abrir uma rota. O PDF oficial não fornece coordenadas por unidade, então o app <strong>não inventa uma ordenação por distância</strong>.</p>
          <p id="ubsLocationStatus" class="small">Localização ainda não solicitada.</p>
        </div>
        <div class="hero-actions">
          <button class="btn" id="ubsUseLocation" type="button">Usar minha localização</button>
          <a class="btn secondary" id="ubsNearbyMap" href="${nearbyMapUrl()}" target="_blank" rel="noopener noreferrer">Ver UBS próximas no mapa ↗</a>
        </div>
      </section>

      <section class="panel service-filters" aria-label="Filtros das UBS">
        <label><span>Buscar</span><input id="ubsSearch" type="search" autocomplete="off" placeholder="Ex.: Estrela Dalva, Finsocial, Guanabara, CNES"></label>
        <label><span>Distrito</span><select id="ubsDistrict">
          <option value="todos">Todos os distritos</option>
          ${[...new Set(units.map(u=>u.district))].map(d=>`<option value="${esc(d)}">${esc(d)}</option>`).join('')}
        </select></label>
        <label><span>Tipo</span><select id="ubsType">
          <option value="todos">Todos os tipos</option>
          <option value="USF">USF</option><option value="CS">Centro de Saúde</option><option value="CAIS">CAIS</option><option value="CAIS/CSF">CAIS / CSF</option><option value="CIAMS">CIAMS</option>
        </select></label>
        <label class="check-row"><input id="ubs24h" type="checkbox"> <span>Somente 24h</span></label>
        <div id="ubsCount" class="small">${units.length} registros exibidos</div>
      </section>

      <div id="ubsResults" class="content-stack">${units.map(card).join('')}</div>

      <section class="panel soft">
        <h2>Agendamento na Atenção Básica</h2>
        <p>A Prefeitura informa atendimento das UBS, em regra, de segunda a sexta e divulga Teleconsulta <strong>0800-646-1560</strong> e WhatsApp <strong>(62) 3209-9727</strong>. Horários específicos por unidade estão acima conforme o PDF oficial.</p>
        <div class="hero-actions"><a class="btn secondary" href="tel:08006461560">Ligar Teleconsulta</a><a class="btn secondary" href="https://wa.me/556232099727" target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a></div>
      </section>
    </div>`;

  document.addEventListener('input', event => {
    if(event.target.matches('#ubsSearch,#ubsDistrict,#ubsType,#ubs24h')) renderUbsResults();
  });
  document.addEventListener('change', event => {
    if(event.target.matches('#ubsDistrict,#ubsType,#ubs24h')) renderUbsResults();
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('#ubsUseLocation');
    if(button) useLocation();
  });
})();
