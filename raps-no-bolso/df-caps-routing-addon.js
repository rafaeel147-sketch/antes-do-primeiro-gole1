// CAPS no DF — seleção por modalidade + comparação de percursos com GPS consentido.
// Diretório de 19 serviços: GDF, 09/09/2026. Coordenadas históricas: IPEDF GeoNode (2023).
// Não confundir rota mais curta com unidade de referência, adequação clínica ou acolhimento disponível.
(() => {
  'use strict';
  const SOURCE='https://www.gdfsaude.df.gov.br/web/guest/w/setembro-amarelo-saiba-onde-e-como-buscar-apoio-em-saude-mental-no-df';
  const GEO_SOURCE='https://catalogo.ipe.df.gov.br/layers/geonode_data:geonode:saude_sala_situacao_2';
  const DF_CAPS_SOURCE='https://info.saude.df.gov.br/busca-saude-caps/';
  const ROUTER='https://valhalla1.openstreetmap.de/sources_to_targets';
  const CLIENT='rafaeel147-sketch.github.io/antes-do-primeiro-gole1/raps-no-bolso';
  const KINDS=Object.freeze([
    ['adulto','CAPS adulto — sofrimento psíquico grave'],
    ['ad','CAPS AD — álcool e outras drogas'],
    ['infanto','CAPSi — crianças e adolescentes']
  ]);
  const U=(key,name,kind,address,phone='',lat=null,lon=null,extra='')=>({
    key,name,kind,address:address+', Distrito Federal, Brasil',phone,geo:lat===null?null:{lat,lon},extra
  });
  // Coordenadas IPEDF só nos estabelecimentos com correspondência plausível de sede/endereço.
  // Gama, Brasília/Cruzeiro, CAPSi Recanto, Candango/SCS e Ceilândia/QNN16
  // têm mudança/ausência de sede verificável: NÃO PARTICIPAM de ranking viário.
  const CAPS=Object.freeze([
    U('capsi-asa-norte','CAPSi Asa Norte','infanto','SMHN, Quadra 3, Conjunto 1, Bloco A, Asa Norte, Brasília','(61) 3449-4754',-15.78496722,-47.88698503),
    U('capsi-taguatinga','CAPSi Taguatinga','infanto','QNF, Área Especial 24, Taguatinga Norte','(61) 3449-6682',-15.819282,-48.070457),
    U('capsi-recanto','CAPSi Recanto das Emas','infanto','Quadra 307, Área Especial 1, Recanto das Emas','(61) 3449-6903'),
    U('capsi-sobradinho','CAPSi Sobradinho','infanto','Quadra 4, Área Especial, Lote 6, Sobradinho','(61) 3449-5643',-15.654012,-47.795438),
    U('caps-brazlandia','CAPS I Brazlândia','adulto','Quadra 01, Área Especial 02, Setor Veredas, Brazlândia','(61) 3449-6399',-15.672254,-48.200256,'Atende diversas faixas etárias.'),
    U('caps-brasilia','CAPS II Brasília','adulto','SHCE/Sul, Quadra 1409, Lote 01, Cruzeiro Novo, Brasília','(61) 3349-4755'),
    U('caps-taguatinga','CAPS II Taguatinga','adulto','QNA 39, Área Especial 19, Taguatinga Norte','(61) 3449-6680',-15.834394,-48.053011),
    U('caps-paranoa','CAPS II Paranoá','adulto','Quadra 02, Conjunto K, Área Especial 01, Paranoá','(61) 3449-5317',-15.781411,-47.781716),
    U('caps-planaltina','CAPS II Planaltina','adulto','Via W/L 04, Setor Hospitalar Oeste, Planaltina','(61) 3449-5828',-15.624441,-47.650795),
    U('caps-riacho','CAPS II Riacho Fundo','adulto','EPNB, Km 04, Área Especial, Riacho Fundo','(61) 3449-5001',-15.892266,-48.03448),
    U('caps-gama','CAPS III Gama','adulto','SNO, Quadra 02, Ponte Alta Norte, Gama'),
    U('caps-samambaia','CAPS III Samambaia','adulto','Quadra 302, Conjunto 05, Lote 01, Samambaia','(61) 3449-6906',-15.879962,-48.081894,'Serviço 24 horas segundo a publicação do GDF.'),
    U('capsad-guara','CAPS AD II Guará','ad','QE 23, Área Especial, subsolo do Centro de Saúde 02, Guará II','(61) 2017-1145',-15.832933,-47.973326,'Telefone com ramais 3781–3783.'),
    U('capsad-itapoa','CAPS AD II Itapoã','ad','Quadra 378, Conjunto A, Área Especial 04, Del Lago, Itapoã','(61) 3449-5315',-15.744862,-47.7616),
    U('capsad-santamaria','CAPS AD II Santa Maria','ad','Quadra 312, Conjunto H, Casa 12, Santa Maria Norte','(61) 2017-1145',-16.012962,-48.004626,'Telefone com ramais 5640 e 5641.'),
    U('capsad-sobradinho','CAPS AD II Sobradinho II','ad','AR 17, Chácara 14, Sobradinho II','(61) 2017-1145',-15.646723,-47.816654,'Telefone com ramal 2115.'),
    U('capsad-candango','CAPS AD III Brasília Candango','ad','Setor Comercial Sul, Quadra 05, Bloco B, Loja 73, Asa Sul, Brasília','(61) 3349-4751',null,null,'Serviço 24 horas segundo a publicação do GDF.'),
    U('capsad-ceilandia','CAPS AD III Ceilândia','ad','QNN 16, Área Especial, próximo à estação Guariroba, Ceilândia','(61) 3449-6151',null,null,'Serviço 24 horas segundo a publicação do GDF.'),
    U('capsad-samambaia','CAPS AD III Samambaia','ad','QS 107, Conjunto 7, Lotes 3 e 4, Samambaia Sul','(61) 3449-6902',-15.883597,-48.099377,'Serviço 24 horas segundo a publicação do GDF.')
  ]);
  const eligible=CAPS.filter(x=>x.geo);
  const $=id=>document.getElementById(id);
  const esc=raw=>String(raw??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const gpsDF=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-16.2&&lat<=-15.3&&lon>=-48.55&&lon<=-47.25;
  let generation=0,lastRequestAt=0;
  function directions(unit,mode,pos=null){
    const url=new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api','1');
    if(pos)url.searchParams.set('origin',pos.lat+','+pos.lon);
    url.searchParams.set('destination',unit.address);
    url.searchParams.set('travelmode',mode==='pedestrian'?'walking':mode==='transit'?'transit':'driving');
    return url.toString();
  }
  function getSelected(){
    const kind=$('dfCapsKind')?.value||'todos';
    return CAPS.filter(c=>kind==='todos'||c.kind===kind);
  }
  function status(txt,error=false){
    const el=$('dfCapsStatus');
    if(el){el.textContent=txt;el.dataset.state=error?'error':'ok'}
  }
  function label(kind){return KINDS.find(x=>x[0]===kind)?.[1]||kind}
  function draw(metrics=null,pos=null,mode='auto',criterion='distance'){
    const el=$('dfCapsResults');
    if(!el)return;
    const selected=getSelected();
    const measured=selected.filter(c=>metrics?.[c.key] && Number.isFinite(metrics[c.key][criterion]));
    const note=metrics
      ? '<strong>Comparação PARCIAL:</strong> '+measured.length+' de '+selected.length+
        ' CAPS desta seleção têm trajeto pelas ruas calculado. Não afirmamos qual é o mais próximo entre todos os serviços.'
      : 'Lista de '+selected.length+' CAPS, sem ranking de proximidade. Escolha um serviço ou use o GPS para comparar trajetos; não precisa de CEP.';
    let html='<section class="panel soft df-caps-coverage"><p>'+note+'</p>'+
      '<p class="small">A menor rota não garante que o serviço atenda seu público ou território. Os CAPS recebem demanda espontânea; confirme modalidade, horário e acolhimento antes de sair.</p></section>';
    for(const [kind,title] of KINDS){
      const items=selected.filter(x=>x.kind===kind).map((x,i)=>({...x,originalIndex:i,metric:metrics?.[x.key]||null}));
      if(!items.length)continue;
      items.sort((a,b)=>{
        const d1=a.metric?.[criterion],d2=b.metric?.[criterion];
        return (Number.isFinite(d1)?d1:Infinity)-(Number.isFinite(d2)?d2:Infinity)||a.originalIndex-b.originalIndex;
      });
      const available=items.filter(x=>x.metric && Number.isFinite(x.metric[criterion]));
      html+='<section class="df-caps-group"><h2>'+esc(title)+' ('+items.length+')</h2>'+
        '<p class="small">'+available.length+' de '+items.length+' trajeto(s) calculado(s) nesta modalidade.</p>';
      for(const [i,x] of items.entries()){
        const unitMetric=x.metric;
        const badge=unitMetric && i===0?'<strong class="road-best">Menor trajeto entre os calculados nesta modalidade — não necessariamente de toda a rede</strong>':'';
        const metric=unitMetric?'<p class="road-metric">'+unitMetric.distance.toFixed(1)+' km pelas ruas · ≈ '+Math.max(1,Math.round(unitMetric.time/60))+' min estimados</p>':
          '<p class="road-unranked">Trajeto não calculado — posição no ranking indeterminada</p>';
        const extra=x.extra?'<p class="small">'+esc(x.extra)+'</p>':'';
        const phone=x.phone?'<a class="btn secondary" href="tel:'+esc(x.phone.replace(/\D/g,''))+'">📞 '+esc(x.phone)+'</a>':'';
        html+='<article class="panel df-caps-card" data-df-caps="'+esc(x.key)+'">'+
          '<h3>'+esc(x.name)+'</h3><p class="small">'+esc(x.address)+'</p>'+extra+badge+metric+
          (!x.geo?'<p class="small">Coordenada atual não validada; use a rota por endereço.</p>':
            '<p class="small">Coordenada histórica IPEDF; confira a entrada da unidade no mapa.</p>')+
          '<div class="hero-actions"><a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(directions(x,mode,pos))+'">Traçar rota ↗</a>'+
          '<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+esc(directions(x,'transit',pos))+'">Ônibus/metrô ↗</a>'+
          phone+'</div></article>';
      }
      html+='</section>';
    }
    el.innerHTML=html;
    status(metrics?'Resultado parcial: '+measured.length+' de '+selected.length+' CAPS com percurso calculado.':
      'Todas as '+selected.length+' unidades selecionadas estão disponíveis, inclusive sem GPS.');
  }
  function matrixUrl(pos,units,mode){
    const json={sources:[pos],targets:units.map(x=>x.geo),costing:mode==='pedestrian'?'pedestrian':'auto',
      units:'kilometers',id:'raps-no-bolso-caps-df'};
    return ROUTER+'?json='+encodeURIComponent(JSON.stringify(json));
  }
  async function calculateMatrix(pos,units,mode,token){
    const mock=window.__rapsDFCapsTestMatrix;
    if(mock && typeof mock==='object'){
      return Object.fromEntries(units.map(x=>[x.key,Number.isFinite(mock[x.key]?.distance) && Number.isFinite(mock[x.key]?.time) ? mock[x.key]:null]));
    }
    const results={};
    for(let offset=0;offset<units.length;offset+=15){
      if(offset>0)await new Promise(resolve=>setTimeout(resolve,1300));
      if(token!==generation||document.hidden||!$('dfCapsResults'))return null;
      const batch=units.slice(offset,offset+15);
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),13000);
      try{
        const response=await fetch(matrixUrl(pos,batch,mode),{
          method:'GET',mode:'cors',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',
          headers:{'X-Client-Id':CLIENT},signal:controller.signal
        });
        if(!response.ok)throw new Error('HTTP '+response.status);
        const json=await response.json();
        const row=json?.sources_to_targets?.[0];
        if(!Array.isArray(row)||row.length!==batch.length)throw new Error('Matriz de trajetos incompleta');
        batch.forEach((x,i)=>{
          const m=row[i];
          results[x.key]=m&&Number.isFinite(m.distance)&&m.distance>=0&&Number.isFinite(m.time)&&m.time>=0?
            {distance:m.distance,time:m.time}:null;
        });
      }catch(e){
        console.warn('[RAPS DF CAPS] Roteamento indisponível em um lote:',e?.message||e);
        batch.forEach(x=>{results[x.key]=null});
      }finally{clearTimeout(timeout)}
    }
    return results;
  }
  async function locateCaps(){
    const token=generation,button=$('dfCapsLocate');
    if(!button)return;
    if(!navigator.geolocation){status('GPS indisponível. Os CAPS permanecem listados com rotas por endereço.',true);return}
    if(lastRequestAt&&Date.now()-lastRequestAt<8000){status('Para respeitar o roteador, aguarde antes de tentar novamente.',true);return}
    const mode=$('dfCapsMode')?.value||'auto';
    if(mode==='transit'){
      draw(null,null,'transit');
      status('Para transporte público, abra a rota no mapa; não calculamos horário de ônibus.',true);
      return;
    }
    lastRequestAt=Date.now();button.disabled=true;
    const criterion=$('dfCapsSort')?.value||'distance';
    status('Solicitando permissão GPS apenas para esta busca…');
    try{
      const pos=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
        p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude}),reject,
        {enableHighAccuracy:false,timeout:12000,maximumAge:60000}
      ));
      if(token!==generation||!$('dfCapsResults'))return;
      if(!gpsDF(pos.lat,pos.lon))throw new Error('GPS fora da área do piloto no DF');
      const units=getSelected().filter(x=>x.geo);
      status('Localização autorizada. Calculando percursos nas vias para '+units.length+' CAPS com coordenadas públicas…');
      const result=await calculateMatrix(pos,units,mode,token);
      if(token!==generation||!$('dfCapsResults'))return;
      if(!result || !Object.values(result).some(m=>m&&Number.isFinite(m.distance)))throw new Error('roteador comunitário indisponível');
      draw(result,pos,mode,criterion);
    }catch(e){
      if(token!==generation||!$('dfCapsResults'))return;
      draw(null,null,mode,criterion);
      const denied=e?.code===1;
      status(denied?'GPS recusado: todos os CAPS continuam listados sem CEP e com rota por endereço.':
        'Não foi possível calcular a rota agora: '+String(e?.message||e)+'. Veja as unidades e abra o mapa.',true);
    }finally{
      if(token===generation&&$('dfCapsLocate'))$('dfCapsLocate').disabled=false;
    }
  }
  pages['df-caps']=()=>{
    generation++;
    const kinds='<option value="todos">Todos (separados por modalidade)</option>'+
      KINDS.map(([key,label])=>'<option value="'+key+'">'+esc(label)+'</option>').join('');
    const preview=CAPS.map(x=>'<article class="panel df-caps-card" data-df-caps="'+esc(x.key)+'">'+
      '<h3>'+esc(x.name)+'</h3><p class="small">'+esc(x.address)+'</p>'+
      '<p class="road-unranked">Trajeto não calculado</p>'+
      '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(directions(x,'auto'))+'">Traçar rota ↗</a></article>').join('');
    return '<div class="page df-pilot-page df-caps-page">'+
      pageHead('Encontrar CAPS no Distrito Federal','Sem CEP: veja os 19 serviços e compare a menor rota entre CAPS da mesma modalidade, quando houver coordenadas confiáveis.','Piloto experimental — DF')+
      '<section class="panel priority-emergency"><h2>Crise grave ou risco imediato?</h2>'+
        '<p>Não espere cálculo de rota. Ligue para o SAMU 192; UPA e hospitais gerais também fazem parte da rede de urgência.</p>'+
        '<a class="btn danger" href="tel:192">Ligar SAMU 192</a></section>'+
      '<section class="panel df-caps-control">'+
        '<h2>Qual CAPS você procura?</h2>'+
        '<p>O mais próximo nem sempre é o serviço adequado. CAPS adulto, CAPS AD (álcool e outras drogas) e CAPSi atendem públicos diferentes. Primeiro confira a modalidade; cada grupo terá seu próprio ranking.</p>'+
        '<div class="road-fields"><label>Modalidade<select id="dfCapsKind">'+kinds+'</select></label>'+
        '<label>Como pretende ir?<select id="dfCapsMode"><option value="auto">Carro</option><option value="pedestrian">A pé</option><option value="transit">Ônibus/metrô no mapa</option></select></label>'+
        '<label>Ordenar<select id="dfCapsSort"><option value="distance">Menor percurso pelas ruas</option><option value="time">Menor tempo estimado</option></select></label></div>'+
        '<p class="small">Ao tocar em “Usar minha localização”, o navegador pedirá GPS. Se autorizado, a posição será enviada temporariamente ao serviço externo Valhalla/OpenStreetMap para comparar percursos. Não será salva no aplicativo. Você também pode abrir rotas sem GPS.</p>'+
        '<button id="dfCapsLocate" class="btn" type="button">📍 Usar minha localização e comparar CAPS</button>'+
        '<p id="dfCapsStatus" role="status" aria-live="polite">GPS não solicitado. Os 19 CAPS estão listados abaixo.</p>'+
        '<p class="small">Os 19 serviços constam da lista do GDF de setembro de 2026. A camada IPEDF usada nas coordenadas é histórica (2023), e alguns endereços mudaram. Por isso o ranking é <strong>PARCIAL</strong>, sem afirmar que identificou o mais próximo de toda a rede. Não indica vagas, filas, acesso territorial, trânsito ou horário em tempo real.</p>'+
        '<p class="small">Fontes: <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Lista do GDF ↗</a> · <a href="'+GEO_SOURCE+'" target="_blank" rel="noopener noreferrer">Camada cartográfica IPEDF ↗</a> · <a href="'+DF_CAPS_SOURCE+'" target="_blank" rel="noopener noreferrer">Busca Saúde CAPS SES-DF ↗</a></p>'+
      '</section><div id="dfCapsResults" class="df-caps-results">'+preview+'</div></div>';
  };
  const originalDf=pages['df-servicos'];
  pages['df-servicos']=()=>{
    const template=document.createElement('template');
    template.innerHTML=originalDf();
    const card=[...template.content.querySelectorAll('.df-service-card')].find(x=>/CAPS e CAPS AD/.test(x.querySelector('h3')?.textContent||''));
    if(card){
      const actions=card.querySelector('.hero-actions');
      if(actions)actions.innerHTML=link('df-caps','📍 Encontrar CAPS mais próximo por modalidade — sem CEP','btn')+
        '<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+DF_CAPS_SOURCE+'">Fonte SES-DF ↗</a>';
      const p=card.querySelector('p');
      if(p)p.textContent='Lista de 19 CAPS dentro do aplicativo. Ao clicar, seu navegador poderá solicitar GPS e sua posição será compartilhada temporariamente com o roteador externo para comparar trajetos. Sem GPS, use as rotas por endereço.';
    }
    const note=[...template.content.querySelectorAll('.panel.warning p')].find(x=>x.textContent.includes('catálogo geográfico de CAPS'));
    if(note)note.textContent='UPAs e CAPS já têm busca sem CEP e comparação de trajetos PARCIAL. A lista geográfica completa de outros serviços ainda está em validação; consulte as fontes oficiais.';
    return template.innerHTML;
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('#dfCapsLocate'))locateCaps();
    if(event.target.closest('a[data-route="df-caps"]'))
      setTimeout(()=>{if($('dfCapsLocate'))locateCaps()},0);
  });
  document.addEventListener('change',event=>{
    if(!event.target.matches('#dfCapsKind,#dfCapsMode,#dfCapsSort'))return;
    generation++;
    draw(null,null,$('dfCapsMode')?.value||'auto',$('dfCapsSort')?.value||'distance');
    status('Filtro alterado. Para comparar novamente, toque no botão de localização.');
  });
  window.RAPSDFCapsTest={
    all:()=>CAPS.map(x=>({key:x.key,kind:x.kind,name:x.name,hasGeo:!!x.geo,address:x.address})),
    geocoded:()=>eligible.map(x=>({key:x.key,geo:x.geo}))
  };
})();
