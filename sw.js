const CACHE='luna-suite-v9';
const APPS=['./shopping.html','./notes-v013.html','./finance-v0298.html'];
const CORE=['./index.html','./luna-core.js',...APPS,'./manifest.webmanifest','./notes-v01.webmanifest','./finance-v01.webmanifest','./icon.svg','./notes-icon.svg','./shopping-icon.svg?v=3'];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>(key.startsWith('luna-suite-')||key.startsWith('luna-compras-')||key.startsWith('luna-notes-')||key.startsWith('luna-finance-'))&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients){try{await client.navigate(client.url)}catch(_){}}
 })());
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 const app=APPS.find(path=>url.pathname.endsWith('/'+path.slice(2)));
 if(app){
  event.respondWith(fetch(new Request(event.request,{cache:'no-store'})).then(response=>{
   const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(app,copy));return response;
  }).catch(()=>caches.match(app)));
  return;
 }
 event.respondWith(fetch(event.request).then(response=>{
  const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
 }).catch(()=>caches.match(event.request)));
});
