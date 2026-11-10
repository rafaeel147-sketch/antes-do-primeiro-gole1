// UPAs do Distrito Federal: busca direta por GPS sem CEP ou redirecionamento para formulário externo.
// Endereços: IGESDF /unidades/ (consultado em novembro de 2026).
// Coordenadas disponíveis: GeoNode IPEDF (camada saude_sala_situacao_2, publicada em 2023).
// Somente unidades com coordenadas verificadas participam da matriz viária; comparação PARCIAL.
(() => {
  'use strict';
  const IGES = 'https://igesdf.org.br/unidades/';
  const IPEDF = 'https://catalogo.ipe.df.gov.br/layers/geonode_data:geonode:saude_sala_situacao_2';
  const ROUTER = 'https://valhalla1.openstreetmap.de/sources_to_targets';
  const CLIENT = 'rafaeel147-sketch.github.io/antes-do-primeiro-gole1/raps-no-bolso';
  const UNIT = (key,name,address,lat=null,lon=null)=>({key,name,address,point:lat===null?null:{lat,lon}});
  const UPAS = Object.freeze([
    UNIT('vicente','UPA Vicente Pires','Rua 10, Quadra 4D, Vicente Pires, Brasília - DF, Brasil'),
    UNIT('sobradinho','UPA Sobradinho','DF-420, Km 2, Complexo de Saúde, Setor de Mansões, Sobradinho - DF, Brasil',-15.639681,-47.819615),
    UNIT('sao-sebastiao','UPA São Sebastião','Quadra 102, Conjunto 1, Área Especial 1, São Sebastião Oeste - DF, Brasil',-15.900887,-47.777779),
    UNIT('samambaia','UPA Samambaia','QS 107, Conjunto 4, Samambaia Sul - DF, Brasil',-15.883444,-48.100199),
    UNIT('riacho','UPA Riacho Fundo II','QN 31, Conjunto 3, Lote 1, Riacho Fundo II - DF, Brasil'),
    UNIT('recanto','UPA Recanto das Emas','Quadra 400/600, Área Especial, Recanto das Emas - DF, Brasil',-15.911805,-48.057412),
    UNIT('planaltina','UPA Planaltina','Setor Habitacional Mestre D’Armas, Quadra 23, Módulo 2, Lote 1, Planaltina - DF, Brasil'),
    UNIT('paranoa','UPA Paranoá','Quadra 1/2, Conjunto 1, Área Especial 4, Paranoá Parque - DF, Brasil'),
    UNIT('bandeirante','UPA Núcleo Bandeirante','DF-075, Km 180, Área Especial, EPNB, Núcleo Bandeirante - DF, Brasil',-15.875978,-47.98223),
    UNIT('gama','UPA Gama','Setor de Indústria, QI 7, Gama - DF, Brasil'),
    UNIT('ceilandia2','UPA Ceilândia II','Setor O, QNO 21, Área Especial D, Ceilândia - DF, Brasil'),
    UNIT('ceilandia','UPA Ceilândia','QNN 27, Lote D, Ceilândia Norte - DF, Brasil',-15.825228,-48.121121),
    UNIT('brazlandia','UPA Brazlândia','Vila São José, Quadra 37, Área Especial 1, Brazlândia - DF, Brasil')
  ]);
  const geocoded = UPAS.filter(x=>x.point);
  const $ = id=>document.getElementById(id);
  let serial=0,position=null,lastTry=0;
  const esc=raw=>String(raw==null?'':raw).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const accurate=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&lat>-16.12&&lat< -15.35&&lon>-48.55&&lon< -47.3;
  const maps=(item,mode,pos=null)=>{
    const u=new URL('https://www.google.com/maps/dir/');
    u.searchParams.set('api','1');
    if(pos)u.searchParams.set('origin',pos.lat+','+pos.lon);
    u.searchParams.set('destination',item.address);
    u.searchParams.set('travelmode',mode==='pedestrian'?'walking':mode==='transit'?'transit':'driving');
    return u.toString();
  };
  const dist=(a,b)=>{
    const r=Math.PI/180,x=(b.lat-a.lat)*r,y=(b.lon-a.lon)*r;
    return 12742.0176*Math.asin(Math.min(1,Math.sqrt(Math.sin(x/2)**2+
      Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(y/2)**2)));
  };
  function status(message,isError=false){
    const el=$('dfUpaStatus');if(!el)return;
    el.textContent=message;el.dataset.state=isError?'error':'ok';
  }
  function renderList(metrics=null,pos=null,mode='auto',criterion='distance'){
    const el=$('dfUpaResults');if(!el)return;
    const found=UPAS.map((item,index)=>({...item,index,metrics:metrics?.[item.key]||null}));
    if(metrics){
      found.sort((a,b)=>{
        const av=a.metrics?.[criterion],bv=b.metrics?.[criterion];
        return (Number.isFinite(av)?av:Infinity)-(Number.isFinite(bv)?bv:Infinity)||a.index-b.index;
      });
    }
    const count=found.filter(x=>x.metrics).length;
    const note=metrics
      ? '<p class="small">Comparação <strong>PARCIAL</strong>: '+count+' de '+UPAS.length+
        ' UPAs têm trajeto pelas ruas calculado. Não é possível afirmar qual é a mais próxima de TODAS as UPAs do DF. As demais aparecem sem ranking.</p>'
      : '<p class="small">Lista completa das '+UPAS.length+' UPAs do IGESDF, sem ordem de proximidade. Nenhum CEP ou GPS é necessário para abrir uma rota no mapa.</p>';
    const html='<section class="panel soft">'+note+'</section>'+found.map(item=>{
      const m=item.metrics;
      const metric=m?'<strong class="road-metric">'+m.distance.toFixed(1)+' km pelas vias · ≈ '+Math.max(1,Math.round(m.time/60))+' min (estimativa)</strong>':
        '<strong class="road-unranked">Trajeto não calculado — não classificado por distância</strong>';
      const flag=m&&found[0]===item?'<span class="badge road-best">Menor percurso entre rotas calculadas</span>':'';
      return '<article class="panel df-upa-card" data-df-upa="'+esc(item.key)+'"><h3>'+esc(item.name)+'</h3>'+
        flag+'<p class="small">'+esc(item.address)+'</p>'+metric+
        (item.point?'<p class="small">Coordenada histórica IPEDF (2023); confira a entrada no mapa.</p>':
           '<p class="small">Coordenada de entrada não validada; rota por endereço.</p>')+
        '<div class="hero-actions"><a class="btn" href="'+esc(maps(item,mode,pos))+'" target="_blank" rel="noopener noreferrer">Traçar rota ↗</a>'+
        '<a class="btn secondary" href="'+esc(maps(item,'transit',pos))+'" target="_blank" rel="noopener noreferrer">Ônibus no mapa ↗</a></div></article>';
    }).join('');
    el.innerHTML=html;
    status(metrics ? 'Matriz viária concluída para '+count+' de '+UPAS.length+' unidades; resultado parcial.' :
      '13 UPAs exibidas. Autorize a localização para comparar os destinos com coordenadas disponíveis.');
  }
  function buildMatrixUrl(pos,mode){
    const data={sources:[{lat:pos.lat,lon:pos.lon}],targets:geocoded.map(x=>x.point),
      costing:mode==='pedestrian'?'pedestrian':'auto',units:'kilometers',id:'raps-no-bolso-df-upa-piloto'};
    return ROUTER+'?json='+encodeURIComponent(JSON.stringify(data));
  }
  async function routing(pos,mode,id){
    const mock=window.__rapsDFUpaTestMatrix;
    if(mock&&typeof mock==='object'){
      return Object.fromEntries(geocoded.map(x=>[x.key,mock[x.key]||null]));
    }
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),13000);
    try{
      const res=await fetch(buildMatrixUrl(pos,mode),{
        mode:'cors',method:'GET',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',
        headers:{'X-Client-Id':CLIENT},signal:controller.signal
      });
      if(!res.ok)throw new Error('Roteador HTTP '+res.status);
      const data=await res.json();
      const row=data?.sources_to_targets?.[0];
      if(!Array.isArray(row)||row.length!==geocoded.length)throw new Error('Matriz incompleta');
      if(id!==serial||!$('dfUpaResults')||document.hidden)return null;
      return Object.fromEntries(geocoded.map((u,i)=>{
        const r=row[i];
        const valid=r&&Number.isFinite(r.distance)&&r.distance>=0&&Number.isFinite(r.time)&&r.time>=0;
        return [u.key,valid?{distance:r.distance,time:r.time}:null];
      }));
    }finally{clearTimeout(timeout)}
  }
  async function findRoute(){
    const id=serial;
    const button=$('dfUpaLocate');
    if(!button)return;
    if(!navigator.geolocation){status('GPS não disponível. As 13 UPAs continuam listadas; abra uma rota pelo endereço.',true);return}
    if(lastTry && Date.now()-lastTry<8000){status('Evite consultas repetidas: aguarde alguns segundos.',true);return}
    lastTry=Date.now();
    const mode=$('dfUpaMode')?.value||'auto';
    const criterion=$('dfUpaSort')?.value||'distance';
    if(mode==='transit'){
      renderList(null,null,'transit');
      status('Para ônibus, toque em “Ônibus no mapa” na unidade desejada. Não calculamos horários de linhas.',true);
      return;
    }
    button.disabled=true;
    status('Solicitando sua localização ao navegador; nenhuma informação é enviada antes da autorização.');
    try{
      const point=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
        p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude}),reject,
        {enableHighAccuracy:false,maximumAge:60000,timeout:12000}
      ));
      if(id!==serial||!$('dfUpaResults'))return;
      if(!accurate(point.lat,point.lon))throw new Error('GPS fora da região do Distrito Federal');
      position=point;
      // Não chamar a "mais próxima": apenas a matriz entre UPAs com coordenadas verificadas.
      status('Localização autorizada. Calculando menor percurso entre '+geocoded.length+' UPAs com coordenadas públicas…');
      const results=await routing(point,mode,id);
      if(id!==serial||!$('dfUpaResults'))return;
      if(!results || !Object.values(results).some(x=>x&&Number.isFinite(x.distance)))throw new Error('serviço comunitário de rotas indisponível');
      renderList(results,point,mode,criterion);
    }catch(error){
      if(id!==serial||!$('dfUpaResults'))return;
      // Falhas não impedem o acesso: nunca utilizar ranking geográfico como equivalente a rota viária.
      renderList(null,null,mode,criterion);
      const denied=error?.code===1;
      status(denied?'Localização não autorizada. A lista e as rotas por endereço continuam disponíveis.':
        'Não foi possível comparar trajetos: '+String(error?.message||error)+'. Utilize a rota por endereço no mapa.',true);
    }finally{
      if(id===serial&&$('dfUpaLocate'))$('dfUpaLocate').disabled=false;
      position=null;
    }
  }
  pages['df-upas']=()=>{
    serial++;
    position=null;
    return '<div class="page df-pilot-page df-upa-page">'+
      pageHead('UPAs 24 horas no Distrito Federal','Sem digitar CEP: veja as 13 unidades e, se quiser, autorize seu GPS para comparar o menor trajeto pelas vias disponíveis.','RAPS no Bolso — DF')+
      '<section class="panel priority-emergency"><h2>Emergência grave?</h2><p>Não espere cálculo de rota. Ligue SAMU 192.</p><a class="btn danger priority-emergency-call" href="tel:192">Ligar SAMU 192</a></section>'+
      '<section class="panel df-upa-control"><h2>Encontre uma UPA sem informar endereço</h2>'+
        '<p><strong>Nada de CEP.</strong> Ao tocar em “Usar localização e comparar”, o navegador solicitará GPS. Com sua permissão, a posição será enviada temporariamente ao roteador comunitário Valhalla/OpenStreetMap para calcular trajetos; não será salva pelo RAPS no Bolso.</p>'+
        '<div class="road-fields"><label>Como pretende ir?<select id="dfUpaMode"><option value="auto">Carro</option><option value="pedestrian">A pé</option><option value="transit">Ônibus (no mapa)</option></select></label>'+
        '<label>Ordenar rotas calculadas<select id="dfUpaSort"><option value="distance">Menor distância pelas ruas</option><option value="time">Menor tempo estimado</option></select></label></div>'+
        '<button class="btn" type="button" id="dfUpaLocate">📍 Usar minha localização e comparar</button>'+
        '<p id="dfUpaStatus" class="small" role="status" aria-live="polite">Nenhuma localização solicitada. Todas as 13 UPAs aparecem abaixo.</p>'+
        '<p class="small">Os endereços das 13 UPAs são do IGESDF. Apenas '+geocoded.length+' coordenadas foram identificadas no IPEDF (camada de 2023); a comparação viária será PARCIAL e pode falhar sem internet. Não é estimativa de vaga, fila, trânsito em tempo real ou garantia de atendimento.</p>'+
        '<div class="hero-actions"><a href="'+IGES+'" target="_blank" rel="noopener noreferrer" class="btn secondary">Fonte das 13 UPAs ↗</a>'+
        '<a href="'+IPEDF+'" target="_blank" rel="noopener noreferrer" class="btn secondary">Fonte das coordenadas ↗</a></div></section>'+
      '<div id="dfUpaResults" class="df-upa-results" aria-label="Relação de UPAs 24 horas">'+UPAS.map(u=>
        '<article class="panel df-upa-card" data-df-upa="'+esc(u.key)+'"><h3>'+esc(u.name)+'</h3><p>'+esc(u.address)+'</p>'+
        '<p class="small">Trajeto não calculado — não classificado por distância</p>'+
        '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(maps(u,'auto'))+'">Traçar rota ↗</a></article>').join('')+'</div>'+
      '</div>';
  };
  const priorDf=pages['df-servicos'];
  pages['df-servicos']=()=>{
    const template=document.createElement('template');
    template.innerHTML=priorDf();
    const card=[...template.content.querySelectorAll('.df-service-card')].find(x=>/UPA 24 horas/.test(x.querySelector('h3')?.textContent||''));
    if(card){
      const actions=card.querySelector('.hero-actions');
      if(actions){
        actions.innerHTML=link('df-upas','📍 Encontrar UPA sem CEP — usar GPS','btn')+
          '<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+IGES+'">Consultar fonte oficial ↗</a>';
      }
      const desc=card.querySelector('p');
      if(desc)desc.textContent='Veja as 13 UPAs 24h do DF aqui no aplicativo. Ao escolher, o GPS será solicitado para comparar percursos; sem GPS, a lista continua disponível.';
    }
    const warning=[...template.content.querySelectorAll('.panel.warning p')].find(x=>x.textContent.includes('Não calculamos'));
    if(warning)warning.textContent='A busca de UPA funciona aqui sem CEP, com comparação de percurso ainda parcial. O catálogo geográfico de CAPS, UBS e outros serviços ainda está em validação; para eles, consulte as fontes oficiais.';
    return template.innerHTML;
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('#dfUpaLocate'))findRoute();
    // O clique intencional em "encontrar UPA" substitui a busca externa por CEP.
    // A navegação principal é tratada antes deste listener (app.js).
    if(event.target.closest('a[data-route="df-upas"]'))
      setTimeout(()=>{if($('dfUpaLocate'))findRoute()},0);
  });
  document.addEventListener('change',event=>{
    if(!event.target.matches('#dfUpaMode,#dfUpaSort'))return;
    // Toda mudança de modalidade invalida o ranking anterior. Exige novo acionamento.
    serial++;
    position=null;
    renderList(null,null,$('dfUpaMode')?.value||'auto',$('dfUpaSort')?.value||'distance');
    status('Modo alterado. Toque novamente em “Usar minha localização” para recalcular.');
  });
  window.RAPSDFUPATest={
    all:()=>UPAS.map(x=>({key:x.key,name:x.name,address:x.address,hasGeo:Boolean(x.point)})),
    geocoded:()=>geocoded.map(x=>({key:x.key,lat:x.point.lat,lon:x.point.lon}))
  };
})();
