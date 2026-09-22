const CACHE='luna-compras-auto-v1';
const APP='./v075c.html';
const CORE=[APP,'./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('luna-compras-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname.endsWith('/v075c.html')){
  e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(APP,copy));return r}).catch(()=>caches.match(APP)));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});
