// Reprocessa a rota depois que todos os módulos adicionais foram carregados.
// Isso permite abrir diretamente URLs de módulos adicionados após o app principal.
(function loadFase4SafeAddon(){
  const finish = () => render(currentRoute(), false);
  const script = document.createElement('script');
  script.src = './fase4-safe-addon.js';
  script.onload = finish;
  script.onerror = finish;
  document.body.appendChild(script);
})();
