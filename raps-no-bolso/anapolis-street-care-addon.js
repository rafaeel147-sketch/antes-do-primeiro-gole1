// Piloto Anápolis — cadastro público CNES e conferência municipal em 17/11/2026.
// O Consultório na Rua é itinerante: não rastrear equipes ou pessoas, não confundir base com atendimento.
(()=>{
'use strict';
const GOV='https://www.anapolis.go.gov.br/secretaria/secretaria-municipal-de-saude/';
const CNES='https://dadosabertos.go.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude/resource/7559175a-98ac-4719-bf30-5e6455ba57c5';
const UPAS='https://www.anapolis.go.gov.br/com-instalacao-da-upa-no-antigo-hospital-municipal-alfredo-abrahao-volta-atender-perfil-habitual-de-traumas-e-queimaduras/';
const RUA='https://www.anapolis.go.gov.br/consultorio-na-rua-realiza-atendimentos-na-praca-bom-jesus/';
const MS='https://www.gov.br/saude/pt-br/composicao/saps/esf/consultorio-na-rua/consultorio-na-rua';
const RIGHTS='https://www.gov.br/mdh/pt-br/assuntos/noticias/2026/defeso-eleitoral/setembro/pessoas-em-situacao-de-rua-saiba-como-acessar-servicos-publicos-e-onde-buscar-atendimento/';
const U=(id,kind,name,address,phone,geo,source,note)=>({id,kind,name,address:address+', Anápolis - GO, Brasil',phone,geo,source,note});
const DATA=[
 U('8013462','adulto','CAPS Vidativa','Rua 1º de Maio, 26, Centro','6239021698',{lat:-16.3272119,lon:-48.9522523},'https://cnes2.datasus.gov.br/Mod_Conjunto.asp?VCo_Unidade=5201108013462','CAPS adulto. CNES atualizado em novembro de 2026 indica este endereço; página municipal apresenta endereço divergente. Confirme por telefone antes de sair.'),
 U('3406830','ad','CAPS AD Viver','Rua Quintino Bocaiúva, 1427, Centro','6226040481',{lat:-16.3317124156298,lon:-48.957180976867676},GOV+'caps-ad-viver/','Álcool e outras drogas; prefeitura informa 24h.'),
 U('5531292','infanto','CAPSi Crescer','Rua 7 de Setembro, 743, Centro','6226040473',{lat:-16.3090698,lon:-48.939377},GOV+'caps-infantil-crescer/','Crianças e adolescentes; segunda a sexta, 7h–18h segundo a prefeitura.'),
 U('7529368','urgencia','UPA Alair Mafra — sede provisória','Rua Estrela do Sul, Vila Jussara, antigo Hospital Jamel Cecílio','',null,UPAS,'24h. Transferida durante reforma da Vila Esperança. Não usar a coordenada CNES da antiga sede; rota por endereço provisório, sem ranking.'),
 U('4771141','urgencia','Centro Médico Jaiara','Avenida Fernando Costa, Vila Jaiara','62995736775',{lat:-16.29429,lon:-48.96676},'https://www.anapolis.go.gov.br/centro-medico-jaiara/','Pronto atendimento clínico 24h; unidade mista, não é hospital de alta complexidade.'),
 U('0418951','urgencia','Unidade Mista / Centro Médico Vila Norte','Rua SW 4, Quadra 10, 20, Vila Norte','6226040463',{lat:-16.281956239620285,lon:-48.92141145288918},UPAS,'Pronto atendimento; confira horário/porta de entrada no telefone.'),
 U('9858741','pediatrica','UPA Pediátrica Dr. Lineu Gonzaga Jaime','Rua Geni Ribeiro Guimarães, s/n, Maracanã','6226040465',{lat:-16.310326609709286,lon:-48.957728147506714},GOV+'upa-pediatrica-dr-lineu-gonzaga-jaime/','Urgência pediátrica, menores de 16 anos, 24h.'),
 U('3771962','hospital','HEANA — Hospital Estadual Dr. Henrique Santillo','Avenida Brasil Norte, 3105, Cidade Universitária','6233119100',{lat:-16.299102502792557,lon:-48.94204258918762},'https://goias.gov.br/saude/heana/','Média e alta complexidade; acesso por regulação estadual. Não presumir porta aberta.'),
 U('0616036','hospital','Hospital Alfredo Abrahão','Rua P-32, Jardim Progresso','', {lat:-16.285556725125595,lon:-48.959377646227445},UPAS,'Referência municipal para trauma e queimaduras; confirmar fluxo de acesso.'),
 U('florescer','ambulatorio','Espaço Florescer — nova sede','Rua Engenheiro Portela, 1113, Vila Góis','',null,'https://www.anapolis.go.gov.br/novo-espaco-florescer-comeca-atendimento-a-populacao-nesta-quarta-14/','Atendimento especializado mediante encaminhamento dos CAPS; nova sede desde outubro de 2026.')
].concat(window.RAPSAnapolisPrimaryData||[]);
const GROUPS=[
 ['adulto','CAPS adulto — sofrimento psíquico grave'],['ad','CAPS AD — álcool e outras drogas'],
 ['infanto','CAPSi — crianças e adolescentes'],['urgencia','UPA e pronto atendimento geral'],
 ['pediatrica','UPA pediátrica'],['hospital','Hospitais — confira a regulação'],
 ['ubs','UBS / USF — atenção básica'],['ambulatorio','Ambulatório de saúde mental']
];
const FILTERS={
 'ana-caps':['adulto','ad','infanto'],'ana-upas':['urgencia','pediatrica'],
 'ana-hospitais':['hospital'],'ana-ubs':['ubs'],'ana-florescer':['ambulatorio']
};
const TITLES={'ana-caps':'CAPS em Anápolis','ana-upas':'UPAs e pronto atendimento em Anápolis','ana-hospitais':'Hospitais de Anápolis','ana-ubs':'UBS e USF em Anápolis','ana-florescer':'Ambulatório de saúde mental em Anápolis'};
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext=(url,label)=>'<a class="btn secondary" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>';
const dial=(num,label)=>'<a class="btn" href="tel:'+esc(num)+'">'+esc(label)+'</a>';
const emergency=()=>'<section class="panel priority-emergency"><h2>Emergência ou risco imediato?</h2><p>Não aguarde cálculo de rota. Ligue para o SAMU.</p>'+dial('192','📞 Ligar SAMU 192')+'</section>';
const maps=(addr,mode='auto',pos=null)=>{
 const u=new URL('https://www.google.com/maps/dir/');
 u.searchParams.set('api','1');u.searchParams.set('destination',addr);
 if(pos)u.searchParams.set('origin',pos.lat+','+pos.lon);
 u.searchParams.set('travelmode',mode==='pedestrian'?'walking':mode==='transit'?'transit':'driving');return u.toString();
};
const sourceFor=x=>x.source?.startsWith('https://')?x.source:CNES;
let serial=0,activeRoute='',last=0;
function records(){const kinds=FILTERS[activeRoute]||[];const f=$('anaKind')?.value||'todos';return DATA.filter(x=>kinds.includes(x.kind)&&(f==='todos'||x.kind===f));}
function status(msg){if($('anaStatus'))$('anaStatus').textContent=msg;}
function draw(metrics=null,pos=null,mode='auto',criterion='distance'){
 const el=$('anaResults');if(!el)return;
 const rows=records(),n=rows.filter(x=>metrics?.[x.id]).length;
 let h='<section class="panel soft"><p><strong>'+rows.length+' registros selecionados.</strong> '+(metrics?'Trajetos calculados: '+n+' de '+rows.length+'. '+(n<rows.length?'Comparação PARCIAL: não é possível afirmar o menor percurso de toda a seleção.':'Comparação dos registros desta seleção, não de toda a rede municipal.'):'Sem GPS: sem classificação por distância.')+'</p><p class="small">Coordenadas públicas CNES, não auditadas em campo. Confirme endereço, funcionamento, referência territorial e acesso. O menor trajeto não garante atendimento.</p></section>';
 for(const [kind,title] of GROUPS){
  const subset=rows.filter(x=>x.kind===kind).sort((a,b)=>(metrics?.[a.id]?.[criterion]??Infinity)-(metrics?.[b.id]?.[criterion]??Infinity)||a.name.localeCompare(b.name,'pt-BR'));
  if(!subset.length)continue;
  h+='<section class="df-caps-group"><h2>'+esc(title)+' ('+subset.length+')</h2>';
  subset.forEach((x,i)=>{
   const m=metrics?.[x.id];h+='<article class="panel df-caps-card ana-unit" data-ana-unit="'+esc(x.id)+'"><h3>'+esc(x.name)+'</h3><p>'+esc(x.address)+'</p><p class="small">'+esc(x.note||'Confira a unidade.')+'</p>'+
    (m?'<p class="road-metric">'+m.distance.toFixed(1)+' km pelas vias · ≈ '+Math.max(1,Math.round(m.time/60))+' min estimados</p>'+(i===0?'<p class="small road-best">Menor '+(criterion==='time'?'tempo':'percurso')+' entre os trajetos calculados nesta categoria.</p>':''):'<p class="small road-unranked">Trajeto não calculado</p>')+
    '<div class="hero-actions">'+ext(maps(x.address,mode,pos),'Traçar rota')+ext(maps(x.address,'transit',pos),'Ônibus no mapa')+(x.phone?dial(x.phone,'📞 Ligar '+x.phone):'')+ext(sourceFor(x),'Fonte')+'</div></article>';
  });h+='</section>';
 }
 el.innerHTML=h;status(metrics?'Resultado: '+n+' de '+rows.length+' trajetos calculados.':'Lista disponível sem CEP e sem GPS.');
}
async function matrix(pos,rows,mode,token){
 const out={};
 for(let i=0;i<rows.length;i+=20){
  if(i)await new Promise(r=>setTimeout(r,1300));
  if(token!==serial||!$('anaResults')||document.hidden)return null;
  const batch=rows.slice(i,i+20);
  const payload={sources:[pos],targets:batch.map(x=>x.geo),costing:mode==='pedestrian'?'pedestrian':'auto',units:'kilometers',id:'raps-no-bolso-anapolis'};
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),13000);
  try{
   const res=await fetch('https://valhalla1.openstreetmap.de/sources_to_targets?json='+encodeURIComponent(JSON.stringify(payload)),{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'X-Client-Id':'rafaeel147-sketch.github.io/antes-do-primeiro-gole1/raps-no-bolso'},signal:controller.signal});
   if(!res.ok)throw Error('HTTP '+res.status);
   const data=await res.json(),cells=data?.sources_to_targets?.[0];
   if(!Array.isArray(cells)||cells.length!==batch.length)throw Error('Matriz incompleta');
   batch.forEach((x,j)=>{const m=cells[j];if(m&&Number.isFinite(m.distance)&&m.distance>=0&&Number.isFinite(m.time)&&m.time>=0)out[x.id]={distance:m.distance,time:m.time};});
  }catch(e){console.warn('[RAPS Anápolis] lote de rotas indisponível',e.message);}
  finally{clearTimeout(timer);}
 }
 return out;
}
async function locate(){
 const b=$('anaLocate'),token=serial;if(!b)return;
 if(!navigator.geolocation){status('GPS indisponível. Abra uma rota por endereço.');return;}
 if($('anaMode')?.value==='transit'){draw(null,null,'transit');status('Ônibus: abra o itinerário no mapa; sem cálculo interno.');return;}
 if(last&&Date.now()-last<8000){status('Aguarde alguns segundos entre consultas ao roteador.');return;}
 last=Date.now();b.disabled=true;
 const mode=$('anaMode').value,criterion=$('anaSort').value;
 status('Solicitando GPS, somente com sua autorização…');
 try{
  const p=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:12000,maximumAge:60000,enableHighAccuracy:false}));
  if(token!==serial||!$('anaResults'))return;
  const pos={lat:p.coords.latitude,lon:p.coords.longitude};
  if(!Number.isFinite(pos.lat)||!Number.isFinite(pos.lon)||pos.lat<-16.8||pos.lat>-15.8||pos.lon<-49.5||pos.lon>-48.3)throw Error('GPS fora da área piloto de Anápolis');
  const available=records().filter(x=>x.geo);
  if(!available.length){draw(null,null,mode,criterion);status('Nenhuma coordenada validada para esta seleção. Abra a rota por endereço.');return;}
  status('Calculando percursos pelas vias para '+available.length+' registros georreferenciados…');
  const result=await matrix(pos,available,mode,token);
  if(token!==serial||!$('anaResults'))return;
  draw(result||{},pos,mode,criterion);
  if(!result||!Object.keys(result).length)status('Roteador indisponível ou sem resultado. As rotas por endereço continuam disponíveis.');
 }catch(e){if(token===serial&&$('anaResults')){draw(null,null,mode,criterion);status(e.code===1?'GPS recusado; lista e rotas por endereço disponíveis.':'Não foi possível comparar: '+e.message+'. Use a rota por endereço.');}}
 finally{if($('anaLocate'))$('anaLocate').disabled=false;}
}
function pageFor(route){
 activeRoute=route;serial++;
 const opts=GROUPS.filter(([k])=>FILTERS[route].includes(k));
 setTimeout(()=>{if(activeRoute===route&&$('anaResults'))draw()},0);
 return '<div class="page ana-page df-pilot-page">'+pageHead(TITLES[route],'Sem CEP ou cadastro. Consulte o tipo de atendimento e compare os trajetos calculáveis.','Anápolis — piloto experimental')+
 emergency()+'<section class="panel df-caps-control"><h2>Encontrar atendimento</h2><div class="road-fields">'+
 '<label>Tipo<select id="anaKind"><option value="todos">Todos desta seleção, por tipo</option>'+opts.map(([k,t])=>'<option value="'+k+'">'+esc(t)+'</option>').join('')+'</select></label>'+
 '<label>Deslocamento<select id="anaMode"><option value="auto">Carro</option><option value="pedestrian">A pé</option><option value="transit">Ônibus no mapa</option></select></label>'+
 '<label>Ordenar<select id="anaSort"><option value="distance">Menor percurso</option><option value="time">Menor tempo estimado</option></select></label></div>'+
 '<p class="small">Ao solicitar GPS, sua posição será enviada temporariamente ao roteador comunitário Valhalla/OpenStreetMap, somente após autorização do navegador. Não é salva pelo RAPS no Bolso. A lista e as rotas funcionam sem GPS; o roteador externo pode falhar.</p>'+
 '<button id="anaLocate" class="btn" type="button">📍 Usar localização e comparar</button><p id="anaStatus" role="status" aria-live="polite">GPS não solicitado.</p>'+
 '<p class="small">Fonte cadastral: '+ext(CNES,'CNES/GO')+' '+ext(GOV,'Secretaria de Saúde')+'</p></section><div id="anaResults"></div>'+link('anapolis','Voltar para Anápolis','btn secondary')+'</div>';
}
Object.keys(FILTERS).forEach(r=>pages[r]=()=>pageFor(r));
const service=(route,icon,title,description)=>'<article class="panel df-service-card"><h3>'+icon+' '+esc(title)+'</h3><p>'+esc(description)+'</p>'+link(route,'Abrir atendimento','btn')+'</article>';
pages.anapolis=()=>'<div class="page df-pilot-page ana-home">'+pageHead('Encontrar atendimento em Anápolis','Escolha o tipo de serviço. Sem CPF, CEP ou cadastro; GPS opcional e rotas por endereço.','Anápolis — novo piloto')+emergency()+
 '<div class="df-services-grid">'+
 service('ana-caps','💙','CAPS / CAPS AD / CAPSi','Saúde mental, álcool e outras drogas, crianças e adolescentes. A comparação respeita cada modalidade.')+
 service('ana-upas','🚑','UPAs e pronto atendimento','Urgência geral e pediátrica; UPA Alair Mafra em endereço provisório durante a reforma.')+
 service('ana-hospitais','🏥','Hospitais','Referências hospitalares, incluindo acesso regulado. Confirme a porta de entrada.')+
 service('ana-ubs','🩺','UBS e USF','Atenção básica: '+(window.RAPSAnapolisPrimaryData||[]).length+' registros públicos CNES; confirme a referência territorial.')+
 service('ana-florescer','🌱','Espaço Florescer','Ambulatório de saúde mental mediante encaminhamento; nova sede.')+
 service('consultorio-rua-anapolis','🤝','Consultório na Rua','Cuidado de saúde para pessoas em situação de rua, sem exigir endereço fixo. Saiba como acionar a equipe.')+
 '</div><p class="small">Piloto em validação, não representa toda a rede nem disponibilidade ao vivo. O novo CAPS III da Vila Esperança continua em obras segundo a prefeitura.</p>'+
 link('selecionar-regiao','Trocar região','btn secondary')+'</div>';
const streetPage=(name,body,back)=>'<div class="page df-pilot-page">'+pageHead('Consultório na Rua — '+name,'Atenção integral para pessoas em situação de rua. Não é necessário informar endereço fixo, CPF ou CEP ao aplicativo.','SUS — atenção primária')+emergency()+
 '<section class="panel"><h2>Como funciona</h2><p>Equipes de saúde itinerantes fazem cuidado no território, redução de danos e articulação com UBS, CAPS e outros serviços. Não é uma ambulância e não tem localização fixa em tempo real neste aplicativo.</p><p>Se não encontrar a equipe, procure uma UBS. A falta de documentos ou comprovante de residência não deve impedir o acolhimento no SUS.</p>'+ext(MS,'Ministério da Saúde')+ext(RIGHTS,'Direitos e acesso ao SUS')+'</section>'+body+link(back,'Voltar aos serviços','btn secondary')+'</div>';
pages['consultorio-rua-anapolis']=()=>streetPage('Anápolis',
 '<section class="panel"><h2>Como acionar</h2><p>A Prefeitura informou em maio de 2023 que a equipe itinerante tinha base na USF São Carlos, de segunda a sexta, 7h–17h, e podia ser acionada pelo telefone abaixo. Confirmação do horário e telefone em novembro de 2026: pendente. O CNES de unidade móvel aponta outro endereço cadastral; não é localização ao vivo da equipe.</p>'+dial('6239022031','📞 Telefone divulgado em 2023')+
 '<h3>USF São Carlos — referência de atenção básica</h3><p>Rua 05, s/n, São Carlos. Telefone atual no portal municipal: (62) 2604-0437. Confirme com a UBS onde encontrar a equipe.</p>'+dial('6226040437','📞 Ligar para USF São Carlos')+ext(maps('USF São Carlos, Rua 05, São Carlos, Anápolis - GO, Brasil'),'Rota até a UBS (não até a equipe)')+
 ext(RUA,'Fonte municipal de 2023')+ext(GOV+'rede-assistencial-de-atencao-basica-regioes-de-saude-ii-iii-e-iv/unidade-basica-de-saude-sao-carlos/','Cadastro municipal da USF')+'</section>', 'anapolis');
pages['consultorio-rua-goiania']=()=>streetPage('Goiânia',
 '<section class="panel"><h2>Como encontrar a equipe</h2><p>O financiamento estadual de equipes do Consultório na Rua foi documentado em 2025. Locais atuais das equipes, telefones específicos e escalas: NÃO DETERMINADOS nesta revisão. Procure a UBS do território e peça orientação para acionar a equipe.</p>'+
 link('ubs-goiania','Encontrar UBS em Goiânia','btn')+ext('https://goias.gov.br/saude/extrato-da-portaria-no-2975-2025-ses-go/','Fonte oficial estadual')+'</section>','inicio');
pages['consultorio-rua-df']=()=>streetPage('Distrito Federal',
 '<section class="panel"><h2>Como encontrar a equipe</h2><p>A SES-DF documenta equipes itinerantes por território. O telefone abaixo é da gerência responsável por populações em situação vulnerável, divulgado em 2026 para esclarecimentos, e não uma central de despacho da equipe. Procure uma UBS para ser orientado.</p>'+
 dial('6134494102','📞 Gerência SES-DF — orientação')+ext('https://info.saude.df.gov.br/busca-saude-ubs/','Busca UBS da SES-DF')+
 ext('https://www.gdfsaude.df.gov.br/web/guest/w/saude-abre-consulta-publica-sobre-linha-de-cuidado-da-populacao-em-situacao-de-rua-do-df','Fonte da SES-DF')+'</section>','df-servicos');
pages['consultorio-na-rua']=()=>'<div class="page">'+pageHead('Consultório na Rua','Escolha sua região. A equipe é itinerante; não exibimos localização em tempo real.','SUS — população em situação de rua')+emergency()+
 '<div class="df-services-grid">'+service('consultorio-rua-anapolis','🤝','Anápolis','Referência, contatos e acesso pela UBS.')+service('consultorio-rua-goiania','🤝','Goiânia','Orientação e acesso à atenção básica.')+service('consultorio-rua-df','🤝','Distrito Federal','Orientação da SES-DF e UBS.')+'</div></div>';
const prevHome=pages.inicio;
pages.inicio=()=>{
 const t=document.createElement('template');t.innerHTML=prevHome();
 const entry=t.content.querySelector('.df-region-entry .hero-actions');
 if(entry)entry.insertAdjacentHTML('beforeend',link('anapolis','Anápolis — piloto','btn'));
 const anchor=t.content.querySelector('.home-quick-services');
 if(anchor)anchor.insertAdjacentHTML('afterend','<section class="panel"><h2>🤝 Consultório na Rua</h2><p>Atendimento de saúde à população em situação de rua. Sem endereço fixo, sem cadastro obrigatório.</p>'+link('consultorio-na-rua','Encontrar Consultório na Rua','btn')+'</section>');
 return t.innerHTML;
};
const prevRegion=pages['selecionar-regiao'];
pages['selecionar-regiao']=()=>{const t=document.createElement('template');t.innerHTML=prevRegion();t.content.querySelector('.df-region-choice .hero-actions')?.insertAdjacentHTML('beforeend',link('anapolis','Anápolis — piloto','btn'));return t.innerHTML;};
const prevDf=pages['df-servicos'];
pages['df-servicos']=()=>{const t=document.createElement('template');t.innerHTML=prevDf();const grid=t.content.querySelector('.df-services-grid');if(grid)grid.insertAdjacentHTML('afterend','<section class="panel"><h2>🤝 Consultório na Rua — DF</h2><p>Saúde para quem está em situação de rua. Equipes itinerantes.</p>'+link('consultorio-rua-df','Como acionar o serviço','btn')+'</section>');return t.innerHTML;};
document.addEventListener('click',e=>{
 if(e.target.closest('#anaLocate'))locate();
 const r=e.target.closest('a[data-route]')?.dataset.route;
 if(FILTERS[r])setTimeout(()=>{if($('anaLocate')&&activeRoute===r)locate()},50);
});
document.addEventListener('change',e=>{if(!e.target.matches('#anaKind,#anaMode,#anaSort'))return;serial++;if($('anaLocate'))$('anaLocate').disabled=false;draw(null,null,$('anaMode').value,$('anaSort').value);status('Filtro alterado; use o GPS novamente se desejar comparar.');});
window.RAPSAnapolisTest={catalog:()=>DATA.map(x=>({id:x.id,kind:x.kind,name:x.name,geo:!!x.geo,address:x.address}))};
})();
