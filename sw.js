const CACHE='home-crossfit-100-v3.3.0';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 // Páginas: red primero (siempre la versión más nueva), caché si no hay conexión.
 if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));}return r;}).catch(()=>caches.match('./index.html')));return;}
 // Resto: caché inmediata y actualización en segundo plano.
 e.respondWith(caches.match(req).then(cached=>{const net=fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));}return r;}).catch(()=>cached);return cached||net;}));
});
