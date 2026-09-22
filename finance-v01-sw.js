const BUILD='2026-09-22-auto3-features';
const C='luna-finance-auto-v3';
const APP='./finance-v0298.html';
const A=[APP,'./finance-v01.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(x=>x.startsWith('luna-finance-')&&x!==C).map(x=>caches.delete(x)));
 await self.clients.claim();
 const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of clients){try{await client.navigate(client.url)}catch(_){}}
})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname.endsWith('/finance-v0298.html')){
  e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(r=>{const q=r.clone();caches.open(C).then(c=>c.put(APP,q));return r}).catch(()=>caches.match(APP)));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>{const q=r.clone();caches.open(C).then(c=>c.put(e.request,q));return r}).catch(()=>caches.match(e.request)));
});
