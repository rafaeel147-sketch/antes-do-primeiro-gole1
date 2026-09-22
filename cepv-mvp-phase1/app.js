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

const input=document.getElementById('fileInput');const zone=document.getElementById('dropzone');const panel=document.getElementById('analysisPanel');
['dragenter','dragover'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag')}));
['dragleave','drop'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('drag')}));
zone?.addEventListener('drop',e=>handleFile(e.dataTransfer.files?.[0]));
input?.addEventListener('change',()=>handleFile(input.files?.[0]));

async function sha256(file){const buf=await file.arrayBuffer();const hash=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function humanSize(n){if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;return `${(n/1048576).toFixed(2)} MB`;}
async function handleFile(file){if(!file||!panel)return;panel.innerHTML='<div class="empty-analysis"><span>⌁</span><h3>Processando localmente…</h3><p>Nenhum dado está sendo enviado.</p></div>';const hash=await sha256(file);const ext=(file.name.split('.').pop()||'').toLowerCase();let metrics={};if(['txt','md','json'].includes(ext)||file.type.startsWith('text/')){const text=await file.text();metrics={Caracteres:text.length,Palavras:(text.trim().match(/\S+/g)||[]).length,Linhas:text.split(/\r?\n/).length};if(ext==='json'){try{JSON.parse(text);metrics.JSON='válido'}catch{metrics.JSON='inválido'}}}
  const cards=[['Arquivo',file.name],['Tamanho',humanSize(file.size)],['Tipo',file.type||ext.toUpperCase()||'desconhecido'],...Object.entries(metrics)];
  panel.innerHTML=`<span class="kicker">ANÁLISE ESTRUTURAL LOCAL</span><h3 style="font:700 28px Georgia,serif;margin:8px 0 16px">${escapeHtml(file.name)}</h3><div class="result-grid">${cards.map(([k,v])=>`<div class="result-card"><span>${escapeHtml(String(k))}</span><b>${escapeHtml(String(v))}</b></div>`).join('')}</div><div class="hash-box"><b>SHA-256</b><br>${hash}</div><p style="color:#6e6256;font-size:12px;margin-top:12px">${ext==='pdf'?'Nesta Fase 1 o PDF recebe metadados e hash. Extração textual local entra no próximo incremento.':'Processamento concluído inteiramente no navegador.'}</p>`;
}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
