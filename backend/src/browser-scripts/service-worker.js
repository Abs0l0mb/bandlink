const CACHE_NAME = 'dashboard-service-worker-cache';

self.addEventListener('install', function(event) {
    event.waitUntil(
        self.skipWaiting()
    )
});

self.addEventListener('activate', function(event) {

    event.waitUntil(

        (async () => {

            console.log('[ServiceWorker] Activated');

        })()
    )
});

self.addEventListener('fetch', function(event) {
    
    const url = new URL(event.request.url);
    
    if (url.pathname.indexOf('/api/') === 0)
        return;

    event.respondWith(

        (async () => {

            try {

                const response = await fetch(event.request);

                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, response.clone());

                console.log(`[ServiceWorker] Cached: ${event.request.url}`);

                return response;
            }
            catch(error) {

                const cached = await caches.match(event.request);

                console.log(`[ServiceWorker] From cache: ${event.request.url}`);

                return cached;
            }

        })()
    )
});