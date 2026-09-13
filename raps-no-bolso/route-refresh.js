// Reprocessa a rota depois que todos os módulos adicionais foram carregados.
// Isso permite abrir diretamente URLs de módulos adicionados após o app principal.
(function loadPostAppAddons(){
  const scripts = ['./fase4-safe-addon.js','./services-goiania-addon.js','./ubs-goiania-addon.js'];

  function loadNext(index){
    if(index >= scripts.length){
      render(currentRoute(), false);
      return;
    }
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadNext(index + 1);
    script.onerror = () => loadNext(index + 1);
    document.body.appendChild(script);
  }

  loadNext(0);
})();
