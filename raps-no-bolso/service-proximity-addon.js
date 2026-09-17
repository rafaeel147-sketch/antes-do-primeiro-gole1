// Proximidade determinística para UPAs do diretório de Serviços em Goiânia.
// Usa apenas CNES confirmados das UPAs já publicadas no app. O GPS do aparelho fica em memória.
(function serviceProximityAddon(){
  const GEO_RESOURCE_ID = '7559175a-98ac-4719-bf30-5e6455ba57c5';
  const GEO_API = 'https://dadosabertos.go.gov.br/pt_BR/api/3/action/datastore_search_sql';
  const GEO_SOURCE = 'https://dadosabertos.go.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude/resource/7559175a-98ac-4719-bf30-5e6455ba57c5';

  const UPA_CNES = [
    {match:'UPA ITAIPU', cnes:'7304188'},
    {match:'UPA NOROESTE', cnes:'7821379'},
    {match:'UPA CHACARA DO GOVERNADOR', cnes:'2339552'},
    {match:'UPA JARDIM AMERICA', cnes:'2339528'}
  ];

  let deviceLocation = null;
  let proximityActive = false;
  let coordinateLoadInFlight = null;
  const coordinatesByCnes = new Map();
  let observerTimer = null;

  function normalize(value=''){
    return String(value)
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[—–-]/g,' ')
      .replace(/[^A-Za-z0-9]+/g,' ')
      .trim().toUpperCase();
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

  function cardName(card){
    return card?.querySelector('h3')?.textContent?.trim() || '';
  }

  function cardCnes(card){
    const name = normalize(cardName(card));
    return UPA_CNES.find(item => name.includes(item.match))?.cnes || null;
  }

  function routeLink(card){
    return [...(card?.querySelectorAll('a') || [])].find(a => /Traçar rota/i.test(a.textContent || '')) || null;
  }

  function currentCards(){
    return [...document.querySelectorAll('#serviceResults .service-card')];
  }

  function currentUpaCards(){
    return currentCards().filter(card => Boolean(cardCnes(card)));
  }

  function testCoordinates(ids){
    const injected = window.__rapsServiceProximityTestCoordinates;
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
        method:'GET', mode:'cors', credentials:'omit', cache:'no-store',
        referrerPolicy:'no-referrer', signal:controller.signal
      });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function fetchJsonp(url){
    return new Promise((resolve,reject) => {
      const callbackName = `__rapsUpaGeo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      const cleanup = () => {
        clearTimeout(timeout);
        script.remove();
        try { delete window[callbackName]; } catch(_) { window[callbackName] = undefined; }
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Tempo esgotado ao consultar coordenadas das UPAs'));
      },9000);
      window[callbackName] = payload => { cleanup(); resolve(payload); };
      script.onerror = () => { cleanup(); reject(new Error('Falha ao consultar coordenadas das UPAs')); };
      script.referrerPolicy = 'no-referrer';
      script.src = `${url}&callback=${encodeURIComponent(callbackName)}`;
      document.head.appendChild(script);
    });
  }

  function parseGeoRecord(record){
    const cnes = String(record?.cnes || '').trim();
    const lat = parseNumber(record?.latitude);
    const lng = parseNumber(record?.longitude);
    const municipio = normalize(record?.municipio || '');
    if(!/^\d{7}$/.test(cnes)) return null;
    if(municipio && !municipio.includes('GOIANIA')) return null;
    if(!isPlausibleGoianiaCoordinate(lat,lng)) return null;
    return {cnes,lat,lng};
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
      try { payload = await fetchJson(url); }
      catch(_) { payload = await fetchJsonp(url); }
    }

    const records = payload?.result?.records || [];
    records.map(parseGeoRecord).filter(Boolean).forEach(record => coordinatesByCnes.set(record.cnes,record));
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
    let badge = card.querySelector('[data-service-proximity-distance]');
    if(!badge){
      badge = document.createElement('span');
      badge.className = 'badge';
      badge.dataset.serviceProximityDistance = '1';
      badge.style.marginTop = '8px';
      const heading = card.querySelector('.service-card-top > div') || card.querySelector('h3')?.parentElement;
      heading?.appendChild(badge);
    }
    if(badge) badge.textContent = `≈ ${distance < 10 ? distance.toFixed(1) : Math.round(distance)} km em linha reta`;
  }

  function decorateAndMaybeSort(){
    if(!proximityActive || !deviceLocation) return {withCoordinates:0,totalUpas:0,allVisibleAreUpas:false};
    const container = document.getElementById('serviceResults');
    if(!container) return {withCoordinates:0,totalUpas:0,allVisibleAreUpas:false};

    const cards = currentCards();
    const upaCards = currentUpaCards();
    const ranked = upaCards.map((card,index) => {
      const cnes = cardCnes(card);
      const geo = cnes ? coordinatesByCnes.get(cnes) : null;
      const distance = geo ? haversineKm(deviceLocation,geo) : null;
      if(geo && Number.isFinite(distance)){
        addDistanceBadge(card,distance);
        const link = routeLink(card);
        if(link){
          link.href = exactRouteUrl(geo);
          link.dataset.serviceProximityExact = '1';
          link.title = 'Destino por coordenada geográfica pública do CNES/Dados Abertos de Goiás';
        }
      }
      return {card,index,distance};
    });

    const allVisibleAreUpas = cards.length > 0 && cards.length === upaCards.length;
    if(allVisibleAreUpas){
      ranked.slice().sort((a,b) => {
        const ad = Number.isFinite(a.distance) ? a.distance : Infinity;
        const bd = Number.isFinite(b.distance) ? b.distance : Infinity;
        return ad === bd ? a.index - b.index : ad - bd;
      }).forEach(item => container.appendChild(item.card));
    }

    return {
      withCoordinates:ranked.filter(item => Number.isFinite(item.distance)).length,
      totalUpas:ranked.length,
      allVisibleAreUpas
    };
  }

  function ensureTransparencyNote(){
    const status = document.getElementById('locationStatus');
    if(!status || document.getElementById('serviceProximityTransparency')) return;
    const note = document.createElement('p');
    note.id = 'serviceProximityTransparency';
    note.className = 'small';
    note.innerHTML = `Para as UPAs com CNES confirmado, o app consulta <a href="${GEO_SOURCE}" target="_blank" rel="noopener noreferrer">coordenadas públicas do CNES/Dados Abertos de Goiás ↗</a>. Sua coordenada não é enviada nessa consulta.`;
    status.insertAdjacentElement('afterend',note);
  }

  function updateStatus(result){
    const status = document.getElementById('locationStatus');
    if(!status) return;
    if(result.withCoordinates && result.allVisibleAreUpas){
      status.dataset.state = 'ok';
      status.textContent = `${result.withCoordinates} UPA(s) com coordenadas públicas válidas, ordenadas pela distância em linha reta a partir da sua localização.`;
    } else if(result.withCoordinates){
      status.dataset.state = 'ok';
      status.textContent = `${result.withCoordinates} UPA(s) receberam distância e rota por coordenada exata. Para comparar somente UPAs por proximidade, selecione “UPA 24h” no filtro.`;
    } else {
      status.dataset.state = 'error';
      status.textContent = 'Localização obtida, mas não consegui obter coordenadas públicas válidas das UPAs agora. As rotas por nome + endereço continuam disponíveis.';
    }
  }

  async function refresh(){
    if(!proximityActive || !deviceLocation) return;
    const ids = [...new Set(currentUpaCards().map(cardCnes).filter(Boolean))];
    try {
      if(ids.length){
        if(!coordinateLoadInFlight){
          coordinateLoadInFlight = requestCoordinates(ids).finally(() => { coordinateLoadInFlight = null; });
        }
        await coordinateLoadInFlight;
      }
      updateStatus(decorateAndMaybeSort());
    } catch(error){
      const status = document.getElementById('locationStatus');
      if(status){
        status.dataset.state = 'error';
        status.textContent = 'Sua localização foi obtida, mas a base pública de coordenadas não respondeu agora. As rotas por nome + endereço continuam disponíveis.';
      }
      console.warn('[RAPS no Bolso] Proximidade das UPAs indisponível:',error?.message || error);
    }
  }

  function requestDeviceLocation(){
    if(!navigator.geolocation){
      const status = document.getElementById('locationStatus');
      if(status){
        status.dataset.state = 'error';
        status.textContent = 'Este navegador não oferece geolocalização. Você ainda pode abrir rotas por nome + endereço.';
      }
      return;
    }

    const status = document.getElementById('locationStatus');
    if(status) status.textContent = 'Obtendo sua localização para calcular a proximidade das UPAs…';
    navigator.geolocation.getCurrentPosition(async position => {
      deviceLocation = {lat:position.coords.latitude,lng:position.coords.longitude};
      proximityActive = true;
      const button = document.getElementById('useLocation');
      if(button) button.textContent = '✓ Proximidade ativada';
      ensureTransparencyNote();
      await refresh();
    }, error => {
      const messages = {
        1:'Permissão de localização negada. Você pode continuar usando o diretório normalmente.',
        2:'Não foi possível determinar sua localização agora.',
        3:'A localização demorou demais para responder. Tente novamente.'
      };
      if(status){
        status.dataset.state = 'error';
        status.textContent = messages[error.code] || 'Não foi possível obter sua localização.';
      }
    }, {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }

  function scheduleRefresh(){
    clearTimeout(observerTimer);
    observerTimer = setTimeout(() => {
      ensureTransparencyNote();
      if(proximityActive) refresh();
    },80);
  }

  // Substitui o listener legado da página de Serviços quando o usuário escolhe usar GPS.
  document.addEventListener('click',event => {
    const button = event.target.closest('#useLocation');
    if(!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestDeviceLocation();
  },true);

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(document.getElementById('conteudo') || document.body,{childList:true,subtree:true});
  scheduleRefresh();

  window.__rapsServiceProximity = {
    source:GEO_SOURCE,
    haversineKm,
    refresh,
    get active(){ return proximityActive; },
    get deviceLocation(){ return deviceLocation ? {...deviceLocation} : null; }
  };
})();
