const CACHE='luna-suite-v14';
const APPS=['./shopping.html','./notes-v013.html','./finance-v0298.html','./training.html'];
const CORE=['./index.html','./luna-core.js','./manifest.webmanifest','./notes-v01.webmanifest','./finance-v01.webmanifest','./icon.svg','./notes-icon.svg','./shopping-icon.svg?v=3','./training.webmanifest'];

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);await cache.addAll(CORE);
  const missing=[];for(const path of APPS){const cached=await cache.match(path);if(!cached||!cached.ok)missing.push(path)}
  // Cache.addAll rejects non-2xx responses. Existing valid app pages are retained.
  if(missing.length)await cache.addAll(missing);
  await self.skipWaiting();
 })());
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>(key.startsWith('luna-suite-')||key.startsWith('luna-compras-')||key.startsWith('luna-notes-')||key.startsWith('luna-finance-'))&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 const app=APPS.find(path=>url.pathname.endsWith('/'+path.slice(2)));
 const cacheKey=app||event.request;
 let cacheWrite=Promise.resolve();
 const responsePromise=fetch(app?new Request(event.request,{cache:'no-store'}):event.request).then(response=>{
  if(response.ok){const copy=response.clone();cacheWrite=caches.open(CACHE).then(cache=>cache.put(cacheKey,copy))}
  return response;
 }).catch(async()=>{let cached=await caches.match(cacheKey);return cached&&cached.ok?cached:Response.error()});
 event.respondWith(responsePromise);
 event.waitUntil(responsePromise.then(()=>cacheWrite).catch(()=>{}));
});
