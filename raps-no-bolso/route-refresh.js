// Reprocessa a rota depois que todos os módulos adicionais foram carregados.
// Isso permite abrir diretamente URLs de módulos adicionados após o app principal.
(function loadPostAppAddons(){
  const scripts = ['./fase4-safe-addon.js','./services-goiania-addon.js','./ubs-goiania-addon.js','./proximity-addon.js'];
  const failedScripts = [];

  function finishLoading(){
    window.__rapsAddonLoadFailures = failedScripts.slice();
    if (failedScripts.length) {
      document.body.dataset.rapsAddonLoadError = '1';
      console.error('[RAPS no Bolso] Addons que falharam ao carregar:', failedScripts);
    } else {
      delete document.body.dataset.rapsAddonLoadError;
    }
    render(currentRoute(), false);
  }

  function loadNext(index){
    if(index >= scripts.length){
      finishLoading();
      return;
    }
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadNext(index + 1);
    script.onerror = () => {
      failedScripts.push(scripts[index]);
      console.error('[RAPS no Bolso] Falha ao carregar addon:', scripts[index]);
      loadNext(index + 1);
    };
    document.body.appendChild(script);
  }

  loadNext(0);
})();