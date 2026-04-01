const CACHE_NAME = 'salesrsm-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico'
];

// Instalación - cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(' Cacheando recursos...');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error(' Error cacheando:', err))
  );
  self.skipWaiting();
});

// Activación - limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(' Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - estrategia Cache First, luego Network
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones de API (no cachear)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver respuesta cacheada
        if (response) {
          return response;
        }
        // No cache - ir a la red
        return fetch(event.request)
          .then((networkResponse) => {
            // No cachear si no es GET o si es una navegación
            if (event.request.method !== 'GET') {
              return networkResponse;
            }
            // Opcional: agregar a cache dinámicamente
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // Si falla la red y es una navegación, devolver index.html (SPA)
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});