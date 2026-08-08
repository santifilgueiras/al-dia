// Service worker de Al Día: cachea el shell de la app (HTML/manifest/íconos)
// para que abra rápido y funcione con conexión mala o sin conexión.
// Las llamadas a /api/* (fichas, resumen) siempre van a la red -- nunca
// tiene sentido servir una respuesta vieja de la IA desde el cache.
const CACHE_NAME = 'al-dia-v2';
const APP_SHELL = [
  '/mockup-firme.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (event.request.method !== 'GET') return;

  // El HTML de la app (navegación y el archivo mismo) va network-first: si
  // hay internet, siempre trae la versión más nueva -- si no, cae al
  // cache. Con stale-while-revalidate acá, cada vez que Santiago suba un
  // cambio, el usuario vería la versión VIEJA una carga entera de más
  // (el fetch de fondo recién actualiza el cache para la carga siguiente) --
  // confuso para una app que todavía se actualiza seguido.
  const esHTML = event.request.mode === 'navigate' || url.pathname === '/mockup-firme.html';
  if (esHTML) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para íconos/manifest (cambian poquísimo) sí vale stale-while-revalidate:
  // responde del cache al toque y actualiza de fondo para la próxima.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
