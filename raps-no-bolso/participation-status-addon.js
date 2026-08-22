// Complemento do módulo Participe do SUS: edição local do status de acompanhamento.
// O status é memória do usuário e não confirmação oficial de Conselho, gestão ou serviço.
(() => {
  const DB='raps-no-bolso-participacao';
  const STORE='registros';
  const STATUSES=['Rascunho local','Registrada localmente','Identificada','Apresentada','Em análise','Autorizada','Em execução','Concluída','Não realizada','Arquivada'];
  let decorating=false;

  function openDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB,1);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
  }
  async function getRecord(id){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  }
  async function setStatus(id,status){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      const store=tx.objectStore(STORE);
      const req=store.get(id);
      req.onsuccess=()=>{
        const record=req.result;
        if(!record)return;
        record.status=status;
        record.statusUpdatedAt=new Date().toISOString();
        store.put(record);
      };
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  function escapeHtml(value=''){
    return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  async function decorate(){
    if(decorating)return;
    decorating=true;
    try{
      const buttons=[...document.querySelectorAll('[data-delete-participation]')];
      for(const button of buttons){
        const card=button.closest('.record-card');
        if(!card || card.dataset.statusEditor==='1')continue;
        const id=button.dataset.deleteParticipation;
        const record=await getRecord(id).catch(()=>null);
        if(!record)continue;
        const current=record.status || (record.type==='proposal'?'Rascunho local':'Identificada');
        const options=STATUSES.map(s=>`<option ${s===current?'selected':''}>${escapeHtml(s)}</option>`).join('');
        const editor=document.createElement('div');
        editor.className='record-status-editor';
        editor.style.cssText='margin-top:12px;padding:10px;border-radius:12px;background:var(--soft,#f8fafc);display:grid;gap:6px';
        editor.innerHTML=`<label style="display:grid;gap:6px;font-weight:700">Status de acompanhamento<select data-participation-status="${escapeHtml(id)}" style="width:100%;padding:9px;border-radius:9px;border:1px solid var(--line,#cbd5e1);font:inherit;background:var(--surface,#fff);color:inherit">${options}</select></label><small>Atualização local. Não confirma decisão oficial do serviço, gestão ou Conselho.</small>`;
        const actions=card.querySelector('.record-actions');
        if(actions)card.insertBefore(editor,actions);else card.appendChild(editor);
        const pill=card.querySelector('.record-status');
        if(pill)pill.textContent=current;
        card.dataset.statusEditor='1';
      }
    }finally{decorating=false;}
  }

  document.addEventListener('change',async e=>{
    const select=e.target.closest('[data-participation-status]');
    if(!select)return;
    select.disabled=true;
    try{
      await setStatus(select.dataset.participationStatus,select.value);
      const card=select.closest('.record-card');
      const pill=card?.querySelector('.record-status');
      if(pill)pill.textContent=select.value;
    }finally{select.disabled=false;}
  });

  const root=document.getElementById('conteudo');
  if(root){
    const observer=new MutationObserver(()=>setTimeout(decorate,0));
    observer.observe(root,{childList:true,subtree:true});
  }
  document.addEventListener('click',e=>{if(e.target.closest('[data-route]'))setTimeout(decorate,60)});
  window.addEventListener('popstate',()=>setTimeout(decorate,60));
  setTimeout(decorate,60);
})();
