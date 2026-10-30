/* No HTML pages, prices, quote data, API responses or POST bodies are cached. */
const VERSION='la-umrah-static-v2';
const OFFLINE='/hors-connexion.html';
const ASSETS=[OFFLINE,'/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('la-umrah-static-')&&name!==VERSION)await caches.delete(name);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const request=event.request;const url=new URL(request.url);
 if(url.origin!==self.location.origin||request.method!=='GET'||url.pathname.startsWith('/api/'))return;
 if(request.mode==='navigate'){event.respondWith(fetch(request,{cache:'no-store'}).catch(async()=>await caches.match(OFFLINE)||Response.error()));return;}
 // Exact allowlist only. No Next RSC responses or runtime image/query caches.
 if(ASSETS.includes(url.pathname)&&!url.search){event.respondWith((async()=>await caches.match(request)||fetch(request))());}
});
