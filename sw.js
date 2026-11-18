const CACHE = 'organizador-417dfd1108'
const FILES = ["./","apple-touch-icon.png","assets/bricolage-grotesque-latin-ext-wght-normal-CcLUaPy7.woff2","assets/bricolage-grotesque-latin-wght-normal-DLoelf7F.woff2","assets/bricolage-grotesque-vietnamese-wght-normal-BUzh504Q.woff2","assets/dist-C93lqtQh.js","assets/dist-DxC2iP80.js","assets/esm-269-pfQq.js","assets/esm-DFKBpN0p.js","assets/esm-KXsgKn9R.js","assets/index-BJ5EnZl6.css","assets/index-Cckuq1f7.js","assets/web-BgYWfbcK.js","assets/web-ChIHLz9W.js","assets/web-DsTV1Qt7.js","googleab6bf071f2bfcc67.html","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest","privacy.html"]
self.addEventListener('install', (e) => {
  // cache: 'reload' salta la caché HTTP (GitHub Pages usa max-age=600): sin esto se podía guardar un index.html viejo bajo la versión nueva.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})
// Avisos push (iPhone/PC): el servidor manda { title, body, tag }.
self.addEventListener('push', (e) => {
  let p = {}
  try { p = e.data ? e.data.json() : {} } catch { p = { title: 'Organizador', body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(p.title || 'Organizador', { body: p.body || '', tag: p.tag, icon: './icon-192.png', data: { url: p.url || './' } }))
})
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const open = cs[0]
      return open ? open.focus() : self.clients.openWindow((e.notification.data && e.notification.data.url) || './')
    }),
  )
})
// Primero lo guardado (funciona sin internet); si no está, red.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || (e.request.mode === 'navigate' ? caches.match('./') : fetch(e.request))),
  )
})
