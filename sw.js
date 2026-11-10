/* Service worker « réseau d'abord » : avec Internet, toujours la dernière version publiée ;
   sans Internet, la dernière copie gardée sur l'appareil. La progression des élèves (localStorage)
   n'est jamais touchée. */
var CACHE = 'maths3e';
var FICHIERS = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).catch(function () {}));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      if (r && r.ok) { var copie = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copie); }); }
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});
