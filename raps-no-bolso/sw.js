const CACHE='raps-no-bolso-v9';
const CORE=['./','./index.html','./app.css','./participation.css','./care-path.css','./app.js','./rights-addon.js','./rights-2026-addon.js','./rights-child-mental-2026-addon.js','./alcohol-drugs-addon.js','./participation-addon.js','./participation-status-addon.js','./care-path-addon.js','./route-refresh.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html')))
  );
});
