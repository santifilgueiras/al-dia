// Service worker de Al Día: cachea el shell de la app (HTML/manifest/íconos)
// para que abra rápido y funcione con conexión mala o sin conexión.
// Las llamadas a /api/* (fichas, resumen) siempre van a la red -- nunca
// tiene sentido servir una respuesta vieja de la IA desde el cache.
const CACHE_NAME = 'al-dia-v8';
const APP_SHELL = [
  '/mockup-firme.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/sounds/ambiente.mp3',
  // Motor de repaso espaciado y merge de estados en conflicto (ver
  // lib/scheduling.js y lib/estado.js) -- se cargan como <script src> antes
  // del script principal, así que tienen que estar precacheados para que la
  // app funcione offline sin romper.
  '/lib/scheduling.js',
  '/lib/estado.js',
  // Catálogos/bibliografía/duraciones (antes hardcodeados en mockup-firme.html,
  // ver scripts/extraer-datos.js) -- precargados acá para que la app funcione
  // offline con todo el catálogo disponible desde la primera visita.
  '/data/catalogo-medicina.json',
  '/data/catalogo-psicologia.json',
  '/data/catalogo-ingenieria.json',
  '/data/catalogo-ingenieria-civil.json',
  '/data/catalogo-ingenieria-electrica.json',
  '/data/catalogo-ingenieria-mecanica.json',
  '/data/catalogo-ingenieria-quimica.json',
  '/data/catalogo-ingenieria-naval.json',
  '/data/catalogo-ingenieria-alimentos.json',
  '/data/catalogo-ingenieria-produccion.json',
  '/data/catalogo-agrimensura.json',
  '/data/modulo-icons.json',
  '/data/textos.json',
  '/data/duraciones.json',
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
  // Bug real encontrado (2026-08-19): este handler solo excluía /api/, así
  // que las lecturas del progreso guardado a supabase.co (otro origen,
  // GET) caían en la rama de stale-while-revalidate de más abajo, pensada
  // para íconos/manifest -- el usuario podía ver una versión VIEJA de su
  // propio progreso (ej. una nota recién agregada, desaparecida) porque
  // cargarEstadoUsuario() recibía la respuesta cacheada en vez de ir
  // siempre a la red. Cualquier pedido a otro origen (Supabase, o lo que
  // sea) tiene que pasar de largo del todo -- este service worker solo
  // cachea SU PROPIO origen (el shell de la app).
  if (url.origin !== self.location.origin) return;
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

// Recordatorio diario: el server manda el payload ya armado (título +
// mensaje con el conteo real de temas pendientes) -- el service worker solo
// lo muestra. Si el payload no es JSON válido (no debería pasar) cae a un
// mensaje genérico en vez de romper.
self.addEventListener('push', (event) => {
  let data = { titulo: '🩺 Al Día', mensaje: 'Tenés temas pendientes para repasar hoy.' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) { /* usa el default de arriba */ }

  event.waitUntil(
    self.registration.showNotification(data.titulo, {
      body: data.mensaje,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'recordatorio-diario',
      renotify: true,
      data: { url: '/mockup-firme.html' },
    })
  );
});

// Al tocar la notificación: si ya hay una pestaña de la app abierta, la
// enfoca en vez de abrir una nueva.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/mockup-firme.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('mockup-firme.html') && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
