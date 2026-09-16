// Proximidade geográfica para o diretório local.
// A localização do aparelho fica somente em memória. A consulta externa usa apenas códigos CNES.
(function proximityAddon(){
  const GEO_RESOURCE_ID = '7559175a-98ac-4719-bf30-5e6455ba57c5';
  const GEO_API = 'https://dadosabertos.go.gov.br/pt_BR/api/3/action/datastore_search_sql';
  const GEO_SOURCE = 'https://dadosabertos.go.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude/resource/7559175a-98ac-4719-bf30-5e6455ba57c5';

  let deviceLocation = null;
  let proximityActive = false;
  let coordinateLoadInFlight = null;
  const coordinatesByCnes = new Map();
  let observerTimer = null;

  function normalize(value=''){
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  }

  function parseNumber(value){
    const number = Number(String(value ?? '').trim().replace(',', '.'));
    return Number.isFinite(number) ? number : null;
  }

  function isPlausibleGoianiaCoordinate(lat,lng){
    return Number.isFinite(lat) && Number.isFinite(lng)
      && lat >= -17.35 && lat <= -16.15
      && lng >= -49.85 && lng <= -48.75;
  }

  function haversineKm(a,b){
    const rad = degrees => degrees * Math.PI / 180;
    const earthKm = 6371.0088;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const lat1 = rad(a.lat);
    const lat2 = rad(b.lat);
    const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
    return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function cardCnes(card){
    const match = card?.innerText?.match(/CNES:\s*(\d{7})/i);
    return match ? match[1] : null;
  }

  function cardAddress(card){
    const paragraphs = [...(card?.querySelectorAll('p') || [])];
    const line = paragraphs.find(p => /^Endereço:/i.test(p.innerText.trim()));
    return line ? line.innerText.replace(/^Endereço:\s*/i,'').trim() : '';
  }

  function cardName(card){
    return card?.querySelector('h3')?.textContent?.trim() || '';
  }

  function routeLink(card){
    return [...(card?.querySelectorAll('a') || [])].find(a => /Traçar rota/i.test(a.textContent || '')) || null;
  }

  function strengthenTextRoute(card){
    const link = routeLink(card);
    if(!link || link.dataset.proximityExact === '1') return;
    const name = cardName(card);
    const address = cardAddress(card);
    if(!name || !address) return;
    try {
      const url = new URL(link.href);
      url.searchParams.set('destination', `${name}, ${address}`);
      link.href = url.toString();
      link.dataset.routeQueryStrengthened = '1';
    } catch(_) {}
  }

  function strengthenAllTextRoutes(){
    document.querySelectorAll('#serviceResults .service-card, #ubsResults .service-card').forEach(strengthenTextRoute);
  }

  function currentUbsCards(){
    return [...document.querySelectorAll('#ubsResults .service-card')];
  }

  function currentCnesIds(){
    return [...new Set(currentUbsCards().map(cardCnes).filter(Boolean))];
  }

  function parseGeoRecord(record){
    const cnes = String(record?.cnes || '').trim();
    const lat = parseNumber(record?.latitude);
    const lng = parseNumber(record?.longitude);
    const municipality = normalize(record?.municipio || '');
    if(!/^\d{7}$/.test(cnes)) return null;
    if(municipality && !municipality.includes('GOIANIA')) return null;
    if(!isPlausibleGoianiaCoordinate(lat,lng)) return null;
    return {cnes,lat,lng,municipio:record?.municipio || 'Goiânia'};
  }

  function testCoordinates(ids){
    const injected = window.__rapsProximityTestCoordinates;
    if(!injected || typeof injected !== 'object') return null;
    const records = [];
    ids.forEach(cnes => {
      const item = injected[cnes];
      if(item) records.push({cnes, latitude:item.lat, longitude:item.lng, municipio:item.municipio || 'GOIANIA'});
    });
    return records;
  }

  function buildGeoUrl(ids){
    const safeIds = ids.filter(id => /^\d{7}$/.test(id));
    const quoted = safeIds.map(id => `'${id}'`).join(',');
    const sql = `SELECT cnes, latitude, longitude, municipio FROM "${GEO_RESOURCE_ID}" WHERE cnes IN (${quoted})`;
    return `${GEO_API}?sql=${encodeURIComponent(sql)}`;
  }

  async function fetchJson(url){
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        method:'GET',
        mode:'cors',
        credentials:'omit',
        cache:'no-store',
        referrerPolicy:'no-referrer',
        signal:controller.signal
      });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function fetchJsonp(url){
    return new Promise((resolve,reject) => {
      const callbackName = `__rapsGeoCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      const cleanup = () => {
        clearTimeout(timeout);
        script.remove();
        try { delete window[callbackName]; } catch(_) { window[callbackName] = undefined; }
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Tempo esgotado ao consultar coordenadas CNES'));
      }, 9000);
      window[callbackName] = payload => {
        cleanup();
        resolve(payload);
      };
      script.onerror = () => {
        cleanup();
        reject(new Error('Falha ao consultar coordenadas CNES'));
      };
      script.referrerPolicy = 'no-referrer';
      script.src = `${url}&callback=${encodeURIComponent(callbackName)}`;
      document.head.appendChild(script);
    });
  }

  async function requestCoordinates(ids){
    const missing = ids.filter(id => !coordinatesByCnes.has(id));
    if(!missing.length) return;

    const injected = testCoordinates(missing);
    let payload;
    if(injected){
      payload = {success:true,result:{records:injected}};
    } else {
      const url = buildGeoUrl(missing);
      try {
        payload = await fetchJson(url);
      } catch(fetchError) {
        payload = await fetchJsonp(url);
      }
    }

    const records = payload?.result?.records || [];
    records.map(parseGeoRecord).filter(Boolean).forEach(record => coordinatesByCnes.set(record.cnes,record));
    // Marca também CNES sem coordenada válida para não repetir a mesma consulta a cada renderização.
    missing.forEach(cnes => {
      if(!coordinatesByCnes.has(cnes)) coordinatesByCnes.set(cnes,null);
    });
  }

  function exactRouteUrl(geo){
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api','1');
    if(deviceLocation) url.searchParams.set('origin',`${deviceLocation.lat},${deviceLocation.lng}`);
    url.searchParams.set('destination',`${geo.lat},${geo.lng}`);
    return url.toString();
  }

  function addDistanceBadge(card,distance){
    let badge = card.querySelector('[data-proximity-distance]');
    if(!badge){
      badge = document.createElement('span');
      badge.className = 'badge';
      badge.dataset.proximityDistance = '1';
      badge.style.marginTop = '8px';
      const heading = card.querySelector('.service-card-top > div') || card.querySelector('h3')?.parentElement;
      heading?.appendChild(badge);
    }
    if(badge) badge.textContent = `≈ ${distance < 10 ? distance.toFixed(1) : Math.round(distance)} km em linha reta`;
  }

  function removeDistanceBadge(card){
    card.querySelector('[data-proximity-distance]')?.remove();
  }

  function sortAndDecorateUbs(){
    if(!proximityActive || !deviceLocation) return {withCoordinates:0,total:0};
    const container = document.getElementById('ubsResults');
    if(!container) return {withCoordinates:0,total:0};

    const cards = currentUbsCards();
    const ranked = cards.map((card,index) => {
      const cnes = cardCnes(card);
      const geo = cnes ? coordinatesByCnes.get(cnes) : null;
      const distance = geo ? haversineKm(deviceLocation,geo) : null;
      if(geo && Number.isFinite(distance)){
        addDistanceBadge(card,distance);
        const link = routeLink(card);
        if(link){
          link.href = exactRouteUrl(geo);
          link.dataset.proximityExact = '1';
          link.title = 'Destino por coordenada geográfica publicada no CNES/Dados Abertos de Goiás';
        }
      } else {
        removeDistanceBadge(card);
        strengthenTextRoute(card);
      }
      return {card,index,distance};
    });

    const sorted = ranked.slice().sort((a,b) => {
      const ad = Number.isFinite(a.distance) ? a.distance : Infinity;
      const bd = Number.isFinite(b.distance) ? b.distance : Infinity;
      return ad === bd ? a.index - b.index : ad - bd;
    });

    const currentOrder = cards.map(card => cardCnes(card) + ':' + cardName(card)).join('|');
    const sortedOrder = sorted.map(item => cardCnes(item.card) + ':' + cardName(item.card)).join('|');
    if(currentOrder !== sortedOrder) sorted.forEach(item => container.appendChild(item.card));

    return {
      withCoordinates:ranked.filter(item => Number.isFinite(item.distance)).length,
      total:ranked.length
    };
  }

  function updateStatus(result){
    const status = document.getElementById('ubsLocationStatus');
    if(!status) return;
    if(result.withCoordinates){
      status.dataset.state = 'ok';
      status.textContent = `${result.withCoordinates} de ${result.total} resultado(s) atual(is) têm coordenadas públicas válidas e foram ordenados por distância em linha reta. Sua posição ficou no navegador.`;
    } else {
      status.dataset.state = 'error';
      status.textContent = 'Localização obtida, mas não encontrei coordenadas públicas válidas para os resultados atuais. Mantive as rotas por nome + endereço e não inventei uma ordem por proximidade.';
    }
  }

  function updateMapCenter(){
    const link = document.getElementById('ubsNearbyMap');
    if(!link || !deviceLocation) return;
    const url = new URL('https://www.google.com/maps/@');
    url.searchParams.set('api','1');
    url.searchParams.set('map_action','map');
    url.searchParams.set('center',`${deviceLocation.lat},${deviceLocation.lng}`);
    url.searchParams.set('zoom','13');
    link.href = url.toString();
    link.textContent = 'Abrir mapa na minha região ↗';
  }

  function ensureTransparencyNote(){
    const status = document.getElementById('ubsLocationStatus');
    if(!status || document.getElementById('proximityTransparency')) return;
    const note = document.createElement('p');
    note.id = 'proximityTransparency';
    note.className = 'small';
    note.innerHTML = `Para calcular proximidade, o app consulta <a href="${GEO_SOURCE}" target="_blank" rel="noopener noreferrer">coordenadas públicas do CNES/Dados Abertos de Goiás ↗</a> usando apenas os códigos CNES dos resultados. A coordenada do aparelho não é enviada nessa consulta.`;
    status.insertAdjacentElement('afterend',note);
  }

  async function refreshVisibleProximity(){
    if(!proximityActive || !deviceLocation) return;
    const ids = currentCnesIds();
    try {
      if(ids.length){
        if(!coordinateLoadInFlight){
          coordinateLoadInFlight = requestCoordinates(ids).finally(() => { coordinateLoadInFlight = null; });
        }
        await coordinateLoadInFlight;
      }
      updateStatus(sortAndDecorateUbs());
    } catch(error){
      strengthenAllTextRoutes();
      const status = document.getElementById('ubsLocationStatus');
      if(status){
        status.dataset.state = 'error';
        status.textContent = 'Sua localização foi obtida, mas a base pública de coordenadas não respondeu agora. O diretório continua funcionando por nome + endereço; não apliquei uma ordem de proximidade.';
      }
      console.warn('[RAPS no Bolso] Proximidade CNES indisponível:',error?.message || error);
    }
  }

  function requestDeviceLocation(){
    if(!navigator.geolocation){
      const status = document.getElementById('ubsLocationStatus');
      if(status){
        status.dataset.state = 'error';
        status.textContent = 'Este navegador não oferece geolocalização. Você ainda pode pesquisar e abrir rotas por nome + endereço.';
      }
      return;
    }

    const status = document.getElementById('ubsLocationStatus');
    if(status) status.textContent = 'Obtendo sua localização para calcular proximidade no aparelho…';
    navigator.geolocation.getCurrentPosition(async position => {
      deviceLocation = {lat:position.coords.latitude,lng:position.coords.longitude};
      proximityActive = true;
      const button = document.getElementById('ubsUseLocation');
      if(button) button.textContent = '✓ Proximidade ativada';
      ensureTransparencyNote();
      updateMapCenter();
      await refreshVisibleProximity();
    }, error => {
      const messages = {
        1:'Permissão de localização negada. Você pode continuar usando o diretório por busca e filtros.',
        2:'Não foi possível determinar sua localização agora.',
        3:'A localização demorou demais para responder. Tente novamente.'
      };
      if(status){
        status.dataset.state = 'error';
        status.textContent = messages[error.code] || 'Não foi possível obter sua localização.';
      }
    }, {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }

  function scheduleEnhancement(){
    clearTimeout(observerTimer);
    observerTimer = setTimeout(() => {
      strengthenAllTextRoutes();
      ensureTransparencyNote();
      if(proximityActive) refreshVisibleProximity();
    },80);
  }

  // Captura antes do listener legado de UBS para que exista uma única fonte de verdade para o ranking.
  document.addEventListener('click',event => {
    const button = event.target.closest('#ubsUseLocation');
    if(!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestDeviceLocation();
  },true);

  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(document.getElementById('conteudo') || document.body,{childList:true,subtree:true});
  scheduleEnhancement();

  window.__rapsProximity = {
    source:GEO_SOURCE,
    haversineKm,
    strengthenAllTextRoutes,
    refresh:refreshVisibleProximity,
    get active(){ return proximityActive; },
    get deviceLocation(){ return deviceLocation ? {...deviceLocation} : null; }
  };
})();