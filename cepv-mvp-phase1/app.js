const routes = [...document.querySelectorAll('[data-route]')];
const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('.nav-item')];
const mobileNav = [...document.querySelectorAll('.mobile-nav [data-route]')];
const mobileRoute = document.getElementById('mobileRoute');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.getElementById('menuBackdrop');
const menuToggle = document.getElementById('menuToggle');

function go(route, push=true){
  const target = document.getElementById(`view-${route}`) || document.getElementById('view-inicio');
  views.forEach(v=>v.classList.toggle('active', v===target));
  navItems.forEach(b=>b.classList.toggle('active', b.dataset.route===route));
  mobileNav.forEach(b=>b.classList.toggle('active', b.dataset.route===route));
  if(mobileRoute) mobileRoute.textContent = target.dataset.title || 'PET / CEPV';
  if(push && location.hash !== `#${route}`) history.pushState(null,'',`#${route}`);
  document.title = `${target.dataset.title || 'PET / CEPV'} — PET / CEPV`;
  sidebar?.classList.remove('open'); backdrop?.classList.remove('show');
  window.scrollTo({top:0,behavior:'smooth'});
}
routes.forEach(el=>el.addEventListener('click',e=>{e.preventDefault();go(el.dataset.route)}));
window.addEventListener('hashchange',()=>go(location.hash.slice(1)||'inicio',false));
go(location.hash.slice(1)||'inicio',false);
menuToggle?.addEventListener('click',()=>{sidebar?.classList.toggle('open');backdrop?.classList.toggle('show')});
backdrop?.addEventListener('click',()=>{sidebar?.classList.remove('open');backdrop.classList.remove('show')});

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const f=btn.dataset.filter;document.querySelectorAll('.pet-card').forEach(card=>card.classList.toggle('hidden',f!=='todos'&&card.dataset.cat!==f));
}));

const docSearch=document.getElementById('docSearch');const docFilter=document.getElementById('docFilter');
function filterDocs(){const q=(docSearch?.value||'').toLowerCase().trim();const f=docFilter?.value||'todos';document.querySelectorAll('#docList article').forEach(a=>{const text=a.innerText.toLowerCase();const okQ=!q||text.includes(q);const okF=f==='todos'||a.dataset.type===f;a.classList.toggle('hidden',!(okQ&&okF));});}
docSearch?.addEventListener('input',filterDocs);docFilter?.addEventListener('change',filterDocs);

const input=document.getElementById('fileInput');const zone=document.getElementById('dropzone');const panel=document.getElementById('analysisPanel');const homeInput=document.getElementById('homeFileInput');const homePanel=document.getElementById('homeAnalysis');
['dragenter','dragover'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag')}));
['dragleave','drop'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('drag')}));
zone?.addEventListener('drop',e=>processFile(e.dataTransfer.files?.[0],panel));
input?.addEventListener('change',()=>processFile(input.files?.[0],panel));
homeInput?.addEventListener('change',()=>processFile(homeInput.files?.[0],homePanel));
document.querySelectorAll('[data-home-test]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById('homeTest')?.scrollIntoView({behavior:'smooth',block:'center'})));

async function sha256(file){const buf=await file.arrayBuffer();const hash=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function humanSize(n){if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;return `${(n/1048576).toFixed(2)} MB`;}
async function processFile(file,targetPanel){if(!file||!targetPanel)return;targetPanel.innerHTML='<div class="empty-analysis"><span>⌁</span><h3>Processando localmente…</h3><p>Nenhum dado está sendo enviado.</p></div>';const hash=await sha256(file);const ext=(file.name.split('.').pop()||'').toLowerCase();let metrics={};if(['txt','md','json'].includes(ext)||file.type.startsWith('text/')){const text=await file.text();metrics={Caracteres:text.length,Palavras:(text.trim().match(/\S+/g)||[]).length,Linhas:text.split(/\r?\n/).length};if(ext==='json'){try{JSON.parse(text);metrics.JSON='válido'}catch{metrics.JSON='inválido'}}}
  const cards=[['Arquivo',file.name],['Tamanho',humanSize(file.size)],['Tipo',file.type||ext.toUpperCase()||'desconhecido'],...Object.entries(metrics)];
  targetPanel.innerHTML=`<span class="kicker">ANÁLISE ESTRUTURAL LOCAL</span><h3 style="font:700 25px Georgia,serif;margin:8px 0 14px;overflow-wrap:anywhere">${escapeHtml(file.name)}</h3><div class="result-grid">${cards.map(([k,v])=>`<div class="result-card"><span>${escapeHtml(String(k))}</span><b>${escapeHtml(String(v))}</b></div>`).join('')}</div><div class="hash-box"><b>SHA-256</b><br>${hash}</div><p style="color:#6e6256;font-size:12px;margin-top:12px">${ext==='pdf'?'Nesta Fase 1 o PDF recebe metadados e hash. Extração textual local entra no próximo incremento.':'Processamento concluído inteiramente no navegador.'}</p>`;
}
function escapeHtml(s){return s.replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}

// Phase 1.2 — visual orchestrator: Coruja central + PETs ativos
(() => {
  const content = document.querySelector('.content');
  if(!content || document.getElementById('orchestratorBar')) return;

  const style = document.createElement('style');
  style.id = 'orchestratorStyles';
  style.textContent = `
  .orchestrator-bar{position:sticky;top:12px;z-index:18;margin:0 auto 30px;max-width:1180px;padding:10px 14px 11px;border:1px solid rgba(183,119,25,.28);border-radius:22px;background:rgba(255,250,240,.90);box-shadow:0 14px 38px rgba(51,36,20,.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
  .orchestrator-eyebrow{text-align:center;font-size:8px;font-weight:900;letter-spacing:.18em;color:var(--gold);margin-bottom:5px}.orchestrator-stage{display:grid;grid-template-columns:minmax(0,1fr) 116px minmax(0,1fr);align-items:center;gap:10px}.pet-wing{display:flex;align-items:center;gap:8px;min-width:0}.pet-wing-left{justify-content:flex-end}.pet-wing-right{justify-content:flex-start}
  .orchestrator-pet{position:relative;border:1px solid rgba(183,119,25,.25);background:#fff9ee;color:var(--ink);min-width:60px;height:52px;padding:5px 7px;border-radius:15px;display:grid;place-items:center;align-content:center;gap:1px;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}.orchestrator-pet span{font-size:23px;line-height:1}.orchestrator-pet small{font-size:8px;line-height:1.1;color:var(--muted);font-weight:800;white-space:nowrap}.orchestrator-pet:hover{transform:translateY(-2px);border-color:var(--gold)}
  .orchestrator-pet.active{border-color:var(--gold);background:#fff1d2;box-shadow:0 0 0 3px rgba(183,119,25,.12),0 8px 22px rgba(183,119,25,.18);animation:petWorking 1.1s ease-in-out infinite}.orchestrator-pet.active:after{content:"";position:absolute;right:5px;top:5px;width:6px;height:6px;border-radius:50%;background:#4f8c61;box-shadow:0 0 0 4px rgba(79,140,97,.12)}
  .boss-node{position:relative;isolation:isolate;border:1px solid var(--gold);background:#211b17;color:#fff7e8;width:116px;min-height:82px;border-radius:20px;padding:8px 7px 7px;display:grid;place-items:center;align-content:center;box-shadow:0 10px 25px rgba(33,27,23,.18);overflow:visible}.boss-node .boss-emoji{font-size:31px;line-height:1;z-index:2;animation:owlBreathe 2.4s ease-in-out infinite}.boss-node b{font:700 13px Georgia,serif;z-index:2}.boss-node small{font-size:8px;color:#e7c88f;z-index:2;max-width:94px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.boss-halo{position:absolute;inset:-6px;border:1px solid rgba(183,119,25,.55);border-radius:25px;z-index:-1;animation:bossHalo 2.2s ease-out infinite}
  .orchestrator-status{margin:7px auto 0;max-width:680px;display:flex;align-items:center;justify-content:center;gap:7px;text-align:center;font-size:10px;color:var(--muted);min-height:18px}.orchestrator-status b{color:var(--ink)}.working-dot{width:7px;height:7px;border-radius:50%;background:#4f8c61;box-shadow:0 0 0 4px rgba(79,140,97,.12);flex:0 0 auto}
  @keyframes petWorking{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.04)}}@keyframes owlBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}@keyframes bossHalo{0%{opacity:.7;transform:scale(.94)}70%,100%{opacity:0;transform:scale(1.08)}}
  @media(max-width:980px){.orchestrator-bar{top:70px;margin-bottom:20px;padding:7px 8px 8px;border-radius:18px}.orchestrator-stage{grid-template-columns:minmax(0,1fr) 88px minmax(0,1fr);gap:5px}.pet-wing{display:grid;gap:4px}.pet-wing-left{grid-template-columns:repeat(2,34px);justify-content:end}.pet-wing-right{grid-template-columns:repeat(2,34px);justify-content:start}.orchestrator-pet{min-width:0;width:34px;height:34px;padding:0;border-radius:10px}.orchestrator-pet span{font-size:19px}.orchestrator-pet small{display:none}.boss-node{width:88px;min-height:64px;border-radius:16px;padding:5px}.boss-node .boss-emoji{font-size:25px}.boss-node b{font-size:11px}.boss-node small{font-size:7px;max-width:76px}.orchestrator-eyebrow{display:none}.orchestrator-status{margin-top:4px;font-size:9px;gap:5px}.orchestrator-status #workingDetail{display:none}}
  @media(max-width:390px){.orchestrator-stage{grid-template-columns:minmax(0,1fr) 78px minmax(0,1fr)}.pet-wing-left,.pet-wing-right{grid-template-columns:repeat(2,31px)}.orchestrator-pet{width:31px;height:31px}.orchestrator-pet span{font-size:17px}.boss-node{width:78px;min-height:59px}.boss-node b{font-size:10px}.boss-node small{display:none}}
  @media(prefers-reduced-motion:reduce){.orchestrator-pet.active,.boss-node .boss-emoji,.boss-halo{animation:none!important}.orchestrator-pet{transition:none}}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('section');
  bar.className = 'orchestrator-bar';
  bar.id = 'orchestratorBar';
  bar.setAttribute('aria-label','Equipe PET em atividade');
  bar.innerHTML = `
    <div class="orchestrator-eyebrow">EQUIPE EM AÇÃO</div>
    <div class="orchestrator-stage">
      <div class="pet-wing pet-wing-left" aria-label="PETs à esquerda da Coruja">
        <button class="orchestrator-pet" data-pet="macaco" type="button" aria-label="Macaco — execução"><span>🐒</span><small>Macaco</small></button>
        <button class="orchestrator-pet" data-pet="galinha" type="button" aria-label="Galinha à Moral — crítica"><span>🐔</span><small>Galinha</small></button>
        <button class="orchestrator-pet" data-pet="papagaio" type="button" aria-label="Papagaio — conversa"><span>🦜</span><small>Papagaio</small></button>
      </div>
      <button class="boss-node" id="bossNode" type="button" aria-label="Coruja Boss — coordenação"><span class="boss-halo" aria-hidden="true"></span><span class="boss-emoji">🦉</span><b>Coruja Boss</b><small id="bossState">Coordenando</small></button>
      <div class="pet-wing pet-wing-right" aria-label="PETs à direita da Coruja">
        <button class="orchestrator-pet" data-pet="sherlock" type="button" aria-label="Sherlock Holmes — investigação"><span>🔎</span><small>Sherlock</small></button>
        <button class="orchestrator-pet" data-pet="sara" type="button" aria-label="Sara-PET — impacto humano"><span>🐇</span><small>Sara</small></button>
        <button class="orchestrator-pet" data-pet="jessica" type="button" aria-label="Jéssica-PET — saúde e risco"><span>🐍</span><small>Jéssica</small></button>
        <button class="orchestrator-pet" data-pet="davinci" type="button" aria-label="Da Vinci — design"><span>🎨</span><small>Da Vinci</small></button>
      </div>
    </div>
    <div class="orchestrator-status" aria-live="polite"><span class="working-dot" aria-hidden="true"></span><b id="workingLabel">Coruja coordenando</b><span id="workingDetail">A equipe entra conforme a tarefa.</span></div>`;
  content.prepend(bar);

  const petButtons = [...bar.querySelectorAll('.orchestrator-pet')];
  const bossNode = bar.querySelector('#bossNode');
  const bossState = bar.querySelector('#bossState');
  const workingLabel = bar.querySelector('#workingLabel');
  const workingDetail = bar.querySelector('#workingDetail');
  const routeState = {
    inicio:{pets:['davinci','papagaio'],boss:'Coordenando',label:'Coruja coordenando',detail:'Da Vinci e Papagaio apresentam o projeto.'},
    metodologia:{pets:['galinha','macaco'],boss:'Orquestrando método',label:'Método em foco',detail:'Galinha testa as regras; Macaco estrutura o fluxo.'},
    pets:{pets:['papagaio'],boss:'Apresentando equipe',label:'Equipe PET ativa',detail:'Papagaio traduz as funções enquanto a Coruja coordena.'},
    evidencias:{pets:['sherlock','galinha'],boss:'Validando',label:'Evidência sob revisão',detail:'Sherlock rastreia; Galinha tenta refutar.'},
    biblioteca:{pets:['sherlock','macaco'],boss:'Organizando fontes',label:'Biblioteca em foco',detail:'Sherlock localiza; Macaco organiza os artefatos.'},
    laboratorio:{pets:['macaco'],boss:'Coordenando execução',label:'Laboratório local',detail:'Macaco executa o processamento determinístico no navegador.'}
  };
  const petInfo = {macaco:['Macaco executando','Código, estrutura e artefatos.'],galinha:['Galinha verificando','Crítica, refutação e falso positivo.'],papagaio:['Papagaio comunicando','Clareza, conversa e tradução.'],sherlock:['Sherlock investigando','Fontes, documentos e evidências.'],sara:['Sara avaliando impacto','Relações, cuidado e contexto humano.'],jessica:['Jéssica avaliando risco','Saúde, medicamentos e limites técnicos.'],davinci:['Da Vinci criando','Design e comunicação visual.']};
  function setPetState(pets=[],boss='Coordenando',label='Coruja coordenando',detail='A equipe entra conforme a tarefa.'){
    const active=new Set(pets);petButtons.forEach(btn=>{const on=active.has(btn.dataset.pet);btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false')});
    bossState.textContent=boss;workingLabel.textContent=label;workingDetail.textContent=detail;
  }
  function currentRoute(){return(location.hash||'#inicio').replace('#','')||'inicio'}
  function applyRouteState(){const s=routeState[currentRoute()]||routeState.inicio;setPetState(s.pets,s.boss,s.label,s.detail)}
  document.addEventListener('click',e=>{const route=e.target.closest('[data-route]');if(route)setTimeout(applyRouteState,0);const pet=e.target.closest('.orchestrator-pet');if(pet){const [label,detail]=petInfo[pet.dataset.pet]||['PET especialista','Função especializada.'];setPetState([pet.dataset.pet],'Selecionando especialista',label,detail);setTimeout(applyRouteState,2200)}});
  bossNode.addEventListener('click',()=>{setPetState([],'Coordenando','Coruja Boss','Coordenação, preflight, integração e controle de qualidade.');setTimeout(applyRouteState,2200)});
  window.addEventListener('hashchange',applyRouteState);
  ['homeFileInput','fileInput'].forEach(id=>{const el=document.getElementById(id);el?.addEventListener('change',()=>{if(el.files?.[0])setPetState(['macaco'],'Coordenando execução','Macaco processando','Calculando metadados e SHA-256 localmente.')})});
  ['homeAnalysis','analysisPanel'].forEach(id=>{const p=document.getElementById(id);if(!p)return;new MutationObserver(()=>{if(p.querySelector('.hash-box'))setPetState(['macaco','galinha'],'Validando saída','Resultado estrutural pronto','Macaco concluiu; Galinha confere a saída determinística.')}).observe(p,{childList:true,subtree:true})});
  applyRouteState();
})();