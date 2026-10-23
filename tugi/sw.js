'use strict';
const VERSION='0.1.12-tug59-r4',PREFIX='luna-tugi-shell-',CACHE=PREFIX+VERSION;
const ROOT=new URL('./',self.registration.scope);
const FILES=['./','./index.html','./approved.css','./app.css','./core.js','./sync.js','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./approved-photo-1.jpg','./approved-photo-2.jpg'];
const ALLOWED=new Set(FILES.map(path=>new URL(path,ROOT).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(path=>new Request(new URL(path,ROOT),{cache:'reload'})));})()));
// Existing windows retain their worker until closed: never force an update over an active editor.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||req.headers.has('authorization')||url.origin!==ROOT.origin||url.search||!ALLOWED.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req,{ignoreSearch:false});if(cached)return cached;try{const response=await fetch(req);if(response.ok&&response.type!=='opaque'){event.waitUntil(cache.put(req,response.clone()));return response;}return response;}catch{return new Response('LUNA TUGI ainda não está disponível offline. Volta a ligar e abre a aplicação.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}})());
});

// Activation is requested only by the same-origin update page after an explicit user click.
self.addEventListener('message',event=>{
 const origin=event.source?.url&&new URL(event.source.url).origin;
 if(origin!==ROOT.origin)return;
 if(event.data?.type==='TUGI_VERSION')event.ports?.[0]?.postMessage({version:VERSION});
 if(event.data?.type==='TUGI_ACTIVATE'&&event.data.version===VERSION)event.waitUntil(self.skipWaiting());
});
