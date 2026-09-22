const CACHE='luna-notes-auto-v1';
const APP='./notes-v013.html';
const ASSETS=[APP,'./notes-v01.webmanifest','./notes-icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('luna-notes-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname.endsWith('/notes-v013.html')){
  e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(APP,x));return r}).catch(()=>caches.match(APP)));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)));
});
