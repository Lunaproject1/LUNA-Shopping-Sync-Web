const C='luna-finance-v0298-pwa2-hotfix2';
const A=['./finance-v0298.html','./finance-v01.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('luna-finance-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const q=r.clone();caches.open(C).then(c=>c.put(e.request,q));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./finance-v0298.html'))));
});