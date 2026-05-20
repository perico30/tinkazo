// TINKAZO Service Worker with Workbox — v3 (force cache refresh / remove Supabase cache)
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js"
);

// Import custom push notification handler
importScripts("/custom-sw.js");

// Force activate immediately and claim all clients
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes('-v3'))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

if (workbox) {
  console.log("[SW] Workbox v3 loaded successfully");

  const { registerRoute } = workbox.routing;
  const { NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // Cache pages with NetworkFirst (always try network, fall back to cache)
  registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
      cacheName: "tinkazo-pages-v3",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Cache JS/CSS assets with NetworkFirst (so updates apply immediately)
  registerRoute(
    ({ request }) =>
      ["style", "script", "worker"].includes(request.destination),
    new NetworkFirst({
      cacheName: "tinkazo-assets-v3",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    })
  );

  // Cache images with StaleWhileRevalidate (show cached, update in background)
  registerRoute(
    ({ request }) => request.destination === "image",
    new StaleWhileRevalidate({
      cacheName: "tinkazo-images-v3",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache fonts with StaleWhileRevalidate
  registerRoute(
    ({ request }) => request.destination === "font",
    new StaleWhileRevalidate({
      cacheName: "tinkazo-fonts-v3",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    })
  );

  // Supabase requests must not be cached by Service Worker to avoid connection errors, session sync issues and cold start timeout conflicts.
} else {
  console.warn("[SW] Workbox failed to load");
}
