/**
 * O.N.Precision Service Worker
 * Caching strategy for better performance and offline support
 */

const CACHE_NAME = 'onp-cache-v1';
const STATIC_CACHE = 'onp-static-v1';
const DYNAMIC_CACHE = 'onp-dynamic-v1';

// Files to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/products.html',
    '/works.html',
    '/company.html',
    '/contact.html',
    '/equipment.html',
    '/recruit.html',
    '/news.html',
    '/404.html',
    '/assets/css/style.css',
    '/assets/js/translations.js',
    '/assets/js/main.js',
    '/assets/images/favicon.png',
    '/assets/images/og-image.jpg',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log('[SW] Install error:', err))
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                        .map((key) => {
                            console.log('[SW] Removing old cache:', key);
                            return caches.delete(key);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (except Google Fonts)
    if (url.origin !== location.origin &&
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    // Update cache in background (stale-while-revalidate)
                    event.waitUntil(updateCache(request));
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetchAndCache(request);
            })
            .catch(() => {
                // Fallback for HTML pages
                if (request.headers.get('accept').includes('text/html')) {
                    return caches.match('/404.html');
                }
            })
    );
});

// Fetch and cache new resources
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);

        // Don't cache if not successful
        if (!response || response.status !== 200) {
            return response;
        }

        // Cache the new resource
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());

        return response;
    } catch (error) {
        console.log('[SW] Fetch error:', error);
        throw error;
    }
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, response);
    } catch (error) {
        // Silently fail - user still has cached version
    }
}

// Listen for skip waiting message
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
