const CACHE_NAME = 'salesrsm-v3';
const urlsToCache = [
  '/',
  '/index.html'
];

// Recursos opcionales - se intentan cachear pero no bloquean la instalación
const optionalUrls = [
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.ico'
];

// Instalación - cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Cacheando recursos esenciales...');
        // Cachear los esenciales
        await cache.addAll(urlsToCache);
        // Intentar cachear los opcionales individualmente
        for (const url of optionalUrls) {
          try {
            await cache.add(url);
          } catch (e) {
            console.warn(`No se pudo cachear ${url}:`, e.message);
          }
        }
      })
      .catch((err) => {
        console.error('Error cacheando:', err);
        return Promise.resolve();
      })
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
            // Verificar que la respuesta sea válida
            if (!networkResponse || networkResponse.status === 0) {
              throw new Error('Respuesta de red inválida');
            }
            
            // No cachear si no es GET o si es una navegación
            if (event.request.method !== 'GET') {
              return networkResponse;
            }
            
            // Opcional: agregar a cache dinámicamente
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache).catch(() => {
                // Ignorar errores de cacheo dinámico
              });
            });
            return networkResponse;
          })
          .catch((error) => {
            console.error('Error en fetch:', error);
            // Si falla la red y es una navegación, devolver index.html (SPA)
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Para otros errores, devolver respuesta vacía o error
            return new Response('Error de conexión', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            });
          });
      })
  );
});
