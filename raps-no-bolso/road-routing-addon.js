// Piloto Goiânia: comparar percursos pelas ruas entre serviços da mesma categoria.
// Requer ação + consentimento explícito; não salva GPS, não consulta localização em segundo plano.
// Motor Valhalla demo: apenas uso experimental, sem SLA e com limite de requisições.
(() => {
  'use strict';
  const GEO_RESOURCE = '7559175a-98ac-4719-bf30-5e6455ba57c5';
  const GEO_API = 'https://dadosabertos.go.gov.br/pt_BR/api/3/action/datastore_search_sql';
  const GEO_SOURCE = 'https://dadosabertos.go.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude/resource/7559175a-98ac-4719-bf30-5e6455ba57c5';
  const ROUTER = 'https://valhalla1.openstreetmap.de/sources_to_targets';
  const ROUTER_SOURCE = 'https://valhalla.github.io/valhalla/';
  const ID_HEADER = 'rafaeel147-sketch.github.io/antes-do-primeiro-gole1/raps-no-bolso';
  const GROUPS = [
    ['hospital','Hospitais / pronto-socorro'],
    ['upa','UPAs 24h'],
    ['caps','CAPS e CAPS AD'],
    ['ubs','Unidades básicas / CAIS / CIAMS'],
    ['psiquiatria','Pronto-socorro psiquiátrico'],
    ['ambulatorio','Ambulatório'],
    ['todos','Toda a rede cadastrada (separada por tipo)']
  ];
  const KNOWN_CODES = {
    'HUGO — Hospital de Urgências de Goiás':'2338262',
    'HUGOL — Hospital Estadual de Urgências':'7743068',
    'UPA Itaipu — Dr. João Batista de Sousa Júnior':'7304188',
    'UPA Noroeste — Maria Pires Perillo':'7821379',
    'UPA Chácara do Governador — Dr. Paulo de Siqueira Garcia':'2339552',
    'UPA Jardim América — Dr. Domingos Viggiano':'2339528',
    'CAPSi Água Viva':'2339498',
    'CAPS Beija Flor':'3049604',
    'CAPS Esperança':'2659719',
    'CAPSiJ Cativar':'0478113',
    'CAPSi Girassol':'3024504',
    'CAPS AD Ipê':'7600437',
    'CAPS III AD Noroeste':'7340354',
    'CAPS III Novo Mundo':'2626713',
    'CAPS II Vida':'3024490',
    'CAPS II AD Oeste':'0466174',
    'CAPS II Transtorno Liberdade':'0241997',
    'Ambulatório Municipal de Psiquiatria':'2339587',
    'Pronto Socorro Psiquiátrico Professor Wassily Chuc':'2339463'
  };
  // CAPS AD Casa não possui CNES associado de maneira inequívoca; continua listado sem ranking.
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = id => GROUPS.find(([key])=>key===id)?.[1] || id;
  const value = id => document.getElementById(id);
  const safeId = raw => String(raw||'').replace(/\D/g,'').padStart(7,'0');
  const norm = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const validCoord = (lat,lon) => Number.isFinite(lat)&&Number.isFinite(lon)
    && lat>=-16.87 && lat<=-16.51 && lon>=-49.61 && lon<=-49.10;
  let viewSerial=0;
  let lastCalculation=0;
  let currentPosition=null;
  const coordCache=new Map();
  let latestResults=null;

  function readHtml(route,selector) {
    try {
      const html=pages[route]();
      const t=document.createElement('template');
      t.innerHTML=html;
      return Array.from(t.content.querySelectorAll(selector));
    } catch (error) {
      console.warn('[RAPS] Diretório indisponível para comparar trajetos',route,error?.message||error);
      return [];
    }
  }
  function extractAddress(card) {
    const line=Array.from(card.querySelectorAll('p')).find(el=>el.querySelector('strong')?.textContent?.trim().startsWith('Endereço:'));
    return line?.textContent?.replace(/^Endereço:\s*/i,'').trim() || '';
  }
  function extractSource(card){
    return Array.from(card.querySelectorAll('a')).find(el=>el.textContent.includes('Fonte oficial'))?.href||'';
  }
  function catalog() {
    const result=[];
    const hospitals=readHtml('hospitais-urgencia','.priority-hospital-list article');
    for (const card of hospitals){
      const name=card.querySelector('h2')?.textContent?.trim()||'';
      result.push({name,address:extractAddress(card),kind:'hospital',cnes:safeId(card.dataset.hospitalCnes||KNOWN_CODES[name]),source:extractSource(card),hours:''});
    }
    for (const card of readHtml('servicos-goiania','#serviceResults article.service-card')){
      const name=card.querySelector('h3')?.textContent?.trim()||'';
      const badge=card.querySelector('.service-card-top .badge')?.textContent||'';
      const kind=badge.startsWith('UPA')?'upa':badge.startsWith('CAPS')?'caps':badge.includes('Urgência psiquiátrica')?'psiquiatria':badge.includes('Ambulatório')?'ambulatorio':'';
      if(!kind) continue;
      const hours=Array.from(card.querySelectorAll('p')).find(el=>el.textContent.startsWith('Horário:'))?.textContent?.replace(/^Horário:\s*/i,'')||'';
      result.push({name,address:extractAddress(card),kind,cnes:KNOWN_CODES[name]?safeId(KNOWN_CODES[name]):'',source:extractSource(card),hours});
    }
    for (const card of readHtml('ubs-goiania','#ubsResults article.service-card')){
      const name=card.querySelector('h3')?.textContent?.trim()||'';
      const text=card.textContent||'';
      const match=text.match(/CNES:\s*(\d{7})/i);
      const hours=Array.from(card.querySelectorAll('p')).find(el=>el.textContent.startsWith('Horário:'))?.textContent?.replace(/^Horário:\s*/i,'')||'';
      result.push({name,address:extractAddress(card),kind:'ubs',cnes:match?.[1]||'',source:extractSource(card),hours});
    }
    return result.filter(x=>x.name&&x.address);
  }
  function pointFrom(record){
    const lat=Number(String(record?.latitude??'').replace(',','.'));
    const lon=Number(String(record?.longitude??'').replace(',','.'));
    const rawId=String(record?.cnes||'').replace(/\D/g,'');
    if(!rawId||rawId.length>7||!validCoord(lat,lon)||!norm(record?.municipio).includes('GOIANIA'))return null;
    return {id:safeId(rawId),lat,lon};
  }
  async function fetchJson(url,timeout=10000,headers={}){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeout);
    try {
      const response=await fetch(url,{method:'GET',mode:'cors',credentials:'omit',
        referrerPolicy:'no-referrer',cache:'no-store',headers,signal:controller.signal});
      if(!response.ok)throw new Error('HTTP '+response.status);
      return await response.json();
    }finally{clearTimeout(timer)}
  }
  async function fetchGeo(ids){
    const unique=Array.from(new Set(ids.filter(x=>/^\d{7}$/.test(x))));
    if(!unique.length)return;
    const test=window.__rapsRoadTestCoordinates;
    if(test&&typeof test==='object'){
      for(const id of unique){
        const p=test[id];
        if(p&&validCoord(Number(p.lat),Number(p.lon??p.lng)))coordCache.set(id,{lat:Number(p.lat),lon:Number(p.lon??p.lng)});
        else coordCache.set(id,null);
      }
      return;
    }
    const missing=unique.filter(id=>!coordCache.has(id));
    if(!missing.length)return;
    // O CNES aberto traz alguns IDs de 6 dígitos, por isso consultamos ambas as formas.
    const cnesIds=Array.from(new Set(missing.flatMap(id=>[id,String(Number(id))])));
    const sql='SELECT cnes, latitude, longitude, municipio FROM "'+GEO_RESOURCE+
      '" WHERE cnes IN ('+cnesIds.map(id=>"'"+id+"'").join(',')+')';
    const url=GEO_API+'?sql='+encodeURIComponent(sql);
    let payload;
    try {payload=await fetchJson(url,12000)}
    catch(_) {
      // CKAN de Goiás oferece JSONP; esta requisição contém apenas códigos públicos.
      payload=await new Promise((resolve,reject)=>{
        const fn='__rapsRoadGeo_'+Date.now()+'_'+Math.random().toString(36).slice(2);
        const script=document.createElement('script');
        const cleanup=()=>{clearTimeout(timer);script.remove();try{delete window[fn]}catch(_){window[fn]=undefined}};
        const timer=setTimeout(()=>{cleanup();reject(new Error('Tempo esgotado na fonte CNES'))},12000);
        window[fn]=d=>{cleanup();resolve(d)};
        script.onerror=()=>{cleanup();reject(new Error('Fonte CNES indisponível'))};
        script.referrerPolicy='no-referrer';script.src=url+'&callback='+encodeURIComponent(fn);
        document.head.appendChild(script);
      });
    }
    if(payload?.success===false)throw new Error('Fonte CNES não confirmou consulta');
    for(const record of payload?.result?.records||[]){
      const pt=pointFrom(record);
      if(pt&&missing.includes(pt.id))coordCache.set(pt.id,{lat:pt.lat,lon:pt.lon});
    }
    missing.forEach(id=>{if(!coordCache.has(id))coordCache.set(id,null)});
  }
  function mapsLink(s,mode,pos){
    const u=new URL('https://www.google.com/maps/dir/');
    u.searchParams.set('api','1');
    if(pos)u.searchParams.set('origin',pos.lat+','+pos.lon);
    u.searchParams.set('destination',s.address);
    u.searchParams.set('travelmode',mode==='pedestrian'?'walking':mode==='transit'?'transit':'driving');
    return u.toString();
  }
  function matrixUrl(source,items,mode){
    const req={sources:[{lat:source.lat,lon:source.lon}],
      targets:items.map(x=>({lat:x.geo.lat,lon:x.geo.lon})),
      costing:mode==='pedestrian'?'pedestrian':'auto',units:'kilometers',id:'raps-no-bolso-piloto-goiania'};
    return ROUTER+'?json='+encodeURIComponent(JSON.stringify(req));
  }
  function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
  async function matrixRows(source,items,mode,isStillActive){
    const injected=window.__rapsRoadTestMatrix;
    if(injected&&typeof injected==='object'){
      return items.map(s=>{
        const v=injected[s.cnes];
        return v&&Number.isFinite(v.distance)&&Number.isFinite(v.time)
          ? {distance:v.distance,time:v.time}:null;
      });
    }
    const result=[];
    // Apenas lotes pequenos e iniciados pelo usuário: servidor comunitário não é infraestrutura de emergência.
    for(let offset=0;offset<items.length;offset+=20){
      if(offset)await wait(1250);
      // Não enviar novas posições se a pessoa saiu da tela ou deixou o app em segundo plano.
      if(isStillActive && !isStillActive())break;
      const slice=items.slice(offset,offset+20);
      try {
        const response=await fetchJson(matrixUrl(source,slice,mode),13000,{'X-Client-Id':ID_HEADER});
        const row=response?.sources_to_targets?.[0];
        if(!Array.isArray(row)||row.length!==slice.length)throw new Error('Matriz de rotas incompleta');
        row.forEach(v=>{
          result.push(v&&typeof v.distance==='number'&&Number.isFinite(v.distance)&&v.distance>=0
            &&typeof v.time==='number'&&Number.isFinite(v.time)&&v.time>=0
            ? {distance:v.distance,time:v.time}:null);
        });
      }catch(error){
        console.warn('[RAPS] Roteamento indisponível para um lote:',error?.message||error);
        slice.forEach(()=>result.push(null));
      }
    }
    return result;
  }
  function status(text,state=''){
    const el=value('roadStatus');
    if(el){el.textContent=text;el.dataset.state=state;}
  }
  function renderResults(list,mode,criterion,pos){
    const target=value('roadResults');if(!target)return;
    const groups=GROUPS.filter(([id])=>id!=='todos');
    const selected=value('roadKind')?.value||'todos';
    const compared=list.filter(x=>x.metrics);
    const unranked=list.length-compared.length;
    const fullyCompared=unranked===0&&compared.length===list.length;
    const ranking=criterion==='time'?'menor tempo estimado':'menor distância de percurso';
    const coverage=compared.length+' de '+list.length+' registros com trajeto calculado.';
    const disclaimer=fullyCompared?'Comparação completa dos registros selecionados neste diretório; confirme acesso, horários e rota no mapa.':
      'Comparação PARCIAL: '+unranked+' registro(s) sem rota calculada. Não é possível afirmar qual é o mais próximo entre todos.';
    status(coverage+' '+disclaimer,fullyCompared?'ok':'error');
    let out='<section class="panel soft"><h2>Resultado experimental</h2><p><strong>'+esc(coverage)+'</strong> '+esc(disclaimer)+'</p>'+
      '<p class="small">Dados do CNES/GO + rede viária OpenStreetMap/Valhalla. Tempos estimados, sem congestionamento em tempo real, espera, lotação, triagem ou transporte público. Confirme antes de sair.</p></section>';
    for(const [kind,title] of groups){
      const items=list.filter(x=>x.kind===kind);
      if(!items.length)continue;
      items.sort((a,b)=>{
        const av=a.metrics?.[criterion],bv=b.metrics?.[criterion];
        return (Number.isFinite(av)?av:Infinity)-(Number.isFinite(bv)?bv:Infinity)||
          a.name.localeCompare(b.name,'pt-BR');
      });
      out+='<section class="road-group" aria-label="'+esc(title)+'"><h2>'+esc(title)+' ('+items.length+')</h2>';
      for(const [index,s] of items.entries()){
        const marker=s.metrics ? '<strong class="road-metric">'+esc(s.metrics.distance.toFixed(1))+' km pelas vias · ≈ '+esc(Math.max(1,Math.round(s.metrics.time/60)))+' min</strong>' :
          '<strong class="road-unranked">Trajeto não calculado</strong>';
        out+='<article class="panel road-card"><div class="road-card-main"><h3>'+esc(s.name)+'</h3>'+
          (index===0&&s.metrics?'<span class="badge road-best">Menor '+(criterion==='distance'?'percurso':'tempo')+' entre trajetos disponíveis neste tipo</span>':'')+
          '<p class="small">'+esc(s.address)+'</p>'+marker+
          (s.hours?'<p class="small">Horário informado: '+esc(s.hours)+'</p>':'')+
          '<div class="hero-actions">'+
          '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(mapsLink(s,mode,pos))+'">Ver trajeto no mapa ↗</a>'+
          '<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+esc(mapsLink(s,'transit',pos))+'">Ônibus no mapa ↗</a>'+
          (s.source?'<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+esc(s.source)+'">Fonte oficial ↗</a>':'')+
          '</div></div></article>';
      }
      out+='</section>';
    }
    target.innerHTML=out;
    latestResults={list,mode,criterion};
  }
  async function compareRoutes(){
    const serial=viewSerial;
    const button=value('roadCalculate');
    const consent=value('roadConsent')?.checked;
    if(!consent){status('Autorize explicitamente o envio temporário da posição ao serviço externo de rotas. Sem autorização, use as rotas individuais no mapa.','error');return;}
    if(!navigator.geolocation){status('Seu aparelho não oferece geolocalização. Use as rotas individuais pelo endereço.','error');return;}
    if(lastCalculation&&Date.now()-lastCalculation<12000){status('Para respeitar o serviço comunitário, aguarde entre novas comparações.','error');return;}
    const kind=value('roadKind')?.value||'todos',mode=value('roadMode')?.value||'auto',criterion=value('roadSort')?.value||'distance';
    if(mode==='transit'){status('O cálculo interno por ônibus não está disponível. Abra o transporte público no mapa individual; não inventaremos tempos de linhas.','error');return;}
    lastCalculation=Date.now();
    if(button)button.disabled=true;
    const resultEl=value('roadResults');if(resultEl)resultEl.textContent='';
    status('Solicitando GPS somente para esta comparação…');
    try {
      const pos=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
        p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude}),
        reject,{enableHighAccuracy:false,timeout:12000,maximumAge:60000}));
      if(serial!==viewSerial||!value('roadResults'))return;
      if(!validCoord(pos.lat,pos.lon))throw new Error('Localização fora do piloto de Goiânia; consulte as rotas individuais.');
      currentPosition=pos;
      const all=catalog();
      const selected=kind==='todos'?all:all.filter(x=>x.kind===kind);
      if(!selected.length)throw new Error('Não há serviços desta categoria cadastrados.');
      status('Consultando coordenadas públicas dos '+selected.length+' registros; o GPS permanece no navegador até enviar a comparação de rotas…');
      await fetchGeo(selected.map(x=>x.cnes).filter(Boolean));
      if(serial!==viewSerial||!value('roadResults'))return;
      const eligible=selected.filter(x=>x.cnes&&coordCache.get(x.cnes));
      const matrixItems=eligible.map(x=>({...x,geo:coordCache.get(x.cnes)}));
      status('Calculando percursos reais para '+matrixItems.length+' unidade(s) com coordenadas disponíveis. Os resultados podem ser parciais.');
      const rows=matrixItems.length?await matrixRows(pos,matrixItems,mode,()=>serial===viewSerial && Boolean(value('roadResults')) && !document.hidden):[];
      if(serial!==viewSerial||!value('roadResults'))return;
      const byKey=new Map(matrixItems.map((s,i)=>[s.cnes+'|'+s.name,rows[i]]));
      const full=selected.map(x=>({...x,metrics:byKey.get(x.cnes+'|'+x.name)||null}));
      renderResults(full,mode,criterion,pos);
    }catch(error){
      const failure='Não foi possível calcular a rota agora: '+String(error?.message||error)+'.';
      const chosen=catalog().filter(x=>kind==='todos'||x.kind===kind);
      renderResults(chosen.map(s=>({...s,metrics:null})),mode,criterion,currentPosition);
      status(failure+' Nenhuma posição foi salva; os destinos permanecem disponíveis para abrir no mapa.','error');
    }finally{
      if(button)button.disabled=false;
      // Cada nova comparação exige uma nova autorização; o GPS não fica retido em memória.
      if(value('roadConsent'))value('roadConsent').checked=false;
      currentPosition=null;
    }
  }
  function unrankedPreview(){
    const el=value('roadResults');if(!el)return;
    const kind=value('roadKind')?.value||'todos';
    const mode=value('roadMode')?.value||'auto';
    const all=catalog().filter(s=>kind==='todos'||s.kind===kind);
    const byGroup=GROUPS.filter(([id])=>id!=='todos');
    let html='<p class="small">Sem GPS, nenhum serviço é classificado como o mais próximo. Abrir mapa não depende de cadastro.</p>';
    for(const [id,title] of byGroup){
      const arr=all.filter(x=>x.kind===id);
      if(!arr.length)continue;
      html+='<details class="panel disclosure"><summary>'+esc(title)+' — '+arr.length+' registro(s)</summary><div class="road-fallback-list">';
      for(const s of arr){
        html+='<p><strong>'+esc(s.name)+'</strong> · <a target="_blank" rel="noopener noreferrer" href="'+esc(mapsLink(s,mode,null))+'">Traçar rota no mapa ↗</a></p>';
      }
      html+='</div></details>';
    }
    el.innerHTML=html;
  }
  pages['rotas-rede'] = () => {
    viewSerial++;
    currentPosition=null;
    const options=GROUPS.map(([id,text])=>'<option value="'+id+'"'+(id==='todos'?' selected':'')+'>'+esc(text)+'</option>').join('');
    return '<div class="page road-page">'+
      pageHead('Menor trajeto até atendimento','Compare as rotas pelas ruas em Goiânia; a opção de GPS é voluntária. Primeiro escolha o tipo de serviço.','Piloto experimental')+
      '<section class="panel priority-emergency"><h2>Emergência grave?</h2><p>Não aguarde cálculo de rota nem resultado de mapa. Ligue SAMU 192.</p><a class="btn danger" href="tel:192">Ligar SAMU 192</a></section>'+
      '<section class="panel road-panel"><h2>Comparar deslocamento</h2>'+
      '<p>O trajeto mais curto não garante atendimento. Hospital, UPA, CAPS e UBS atendem necessidades diferentes; na opção “Toda a rede”, a comparação fica separada por categoria.</p>'+
      '<div class="road-fields"><label>Tipo de atendimento<select id="roadKind">'+options+'</select></label>'+
      '<label>Como pretende ir?<select id="roadMode"><option value="auto">Carro (estimativa viária)</option><option value="pedestrian">A pé</option><option value="transit">Ônibus (abrir no mapa)</option></select></label>'+
      '<label>Ordenar por<select id="roadSort"><option value="distance">Menor percurso (km)</option><option value="time">Menor tempo estimado</option></select></label></div>'+
      '<label class="support-check road-consent"><input type="checkbox" id="roadConsent">Autorizo nesta solicitação o compartilhamento temporário da minha posição GPS com o serviço público externo Valhalla/OpenStreetMap para comparar trajetos. Minha posição não será salva no RAPS no Bolso. Ao abrir o mapa externo, seus próprios termos se aplicam.</label>'+
      '<div class="hero-actions"><button type="button" class="btn" id="roadCalculate">Comparar trajetos agora</button><button type="button" class="btn secondary" id="roadShowWithoutGps">Ver unidades sem GPS</button></div>'+
      '<p class="small">Para ônibus, não calculamos distância/tempo automaticamente: veja itinerários atuais no Google Maps. Os cálculos em carro/a pé usam uma instância comunitária sem garantia de disponibilidade, mapas ou tráfego em tempo real. Apenas Goiânia nesta versão.</p>'+
      '<p id="roadStatus" role="status" aria-live="polite">Nenhuma posição solicitada. Escolha uma categoria e autorize se quiser comparar trajetos.</p>'+
      '<div class="small">Fontes: <a href="'+GEO_SOURCE+'" target="_blank" rel="noopener noreferrer">CNES/Dados Abertos GO ↗</a> · <a href="'+ROUTER_SOURCE+'" target="_blank" rel="noopener noreferrer">Valhalla/OpenStreetMap ↗</a>. Coordenadas de estabelecimentos podem estar desatualizadas; confira endereço e atendimento.</div></section>'+
      '<div id="roadResults" class="road-results"></div></div>';
  };
  const oldHome=pages.inicio;
  pages.inicio=()=>{
    const template=document.createElement('template');
    template.innerHTML=oldHome();
    const anchor=template.content.querySelector('.home-quick-services')||template.content.querySelector('.home-grid');
    anchor?.insertAdjacentHTML('afterend','<section class="panel road-home-shortcut"><h2>Qual atendimento tem o menor trajeto?</h2>'+
      '<p>Compare hospital, UPA, CAPS e UBS por ruas, a pé ou de carro. GPS só se você autorizar; ônibus é aberto no mapa.</p>'+
      '<a class="btn" href="?p=rotas-rede" data-route="rotas-rede">Comparar trajetos por serviço</a></section>');
    return template.innerHTML;
  };
  const oldFind=pages['onde-ajuda'];
  pages['onde-ajuda']=()=>{
    const html=oldFind();
    return html.replace('<p class="home-note">Confirme horários',
      '<section class="panel soft"><h2>Menor trajeto pelas ruas</h2><p>Compare todos os destinos cadastrados por tipo, com localização opcional e resultados parciais quando faltarem coordenadas.</p>'+
      '<a class="btn secondary" href="?p=rotas-rede" data-route="rotas-rede">Comparar trajetos</a></section><p class="home-note">Confirme horários');
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('#roadCalculate'))compareRoutes();
    if(event.target.closest('#roadShowWithoutGps')){status('Lista por categoria, sem GPS e sem classificação de distância.');unrankedPreview();}
  });
  document.addEventListener('change',event=>{
    if(!event.target.matches('#roadKind,#roadMode,#roadSort'))return;
    latestResults=null;
    currentPosition=null;
    status('Filtros modificados. Autorize e calcule novamente para obter trajetos; nenhum ranking foi reaproveitado.');
    unrankedPreview();
  });
  document.addEventListener('click',event=>{
    if(event.target.closest('a[data-route="rotas-rede"]'))setTimeout(unrankedPreview,0);
  });
  window.RAPSRoadRoutingTest={
    catalog:()=>catalog().map(x=>({name:x.name,kind:x.kind,cnes:x.cnes})),
    preview:unrankedPreview
  };
})();
