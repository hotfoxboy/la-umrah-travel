/* Only the offline page, icons and font are cached. No pages, RSC, API or POST data. */
const SCOPE = new URL(self.registration.scope);
const BASE = SCOPE.pathname.replace(/\/$/, '');
const CACHE_PREFIX = `la-umrah-static:${encodeURIComponent(SCOPE.pathname)}:`;
const VERSION = `${CACHE_PREFIX}v5`;
const path = name => new URL(name, SCOPE).pathname;
const OFFLINE = path('hors-connexion.html');
const ASSETS = [OFFLINE, path('fonts/quicksand-latin.woff2'), ...['icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png'].map(name => path(`icons/${name}`))];
self.addEventListener('install',event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate',event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith(CACHE_PREFIX) && name !== VERSION) await caches.delete(name);
    await self.clients.claim();
  })());
});
self.addEventListener('message',event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch',event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname) || request.method !== 'GET' || url.pathname.startsWith(`${BASE}/api/`)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request,{cache:'no-store'}).catch(async () => await caches.match(OFFLINE) || Response.error()));
    return;
  }
  if (ASSETS.includes(url.pathname) && !url.search) event.respondWith((async () => await caches.match(request) || fetch(request))());
});
