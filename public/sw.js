// TINKAZO Service Worker with Workbox
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js"
);

// Import custom push notification handler
importScripts("/custom-sw.js");

if (workbox) {
  console.log("[SW] Workbox loaded successfully");

  const { registerRoute } = workbox.routing;
  const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // Cache pages with NetworkFirst (always try network, fall back to cache)
  registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
      cacheName: "tinkazo-pages",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Cache JS/CSS assets with CacheFirst
  registerRoute(
    ({ request }) =>
      ["style", "script", "worker"].includes(request.destination),
    new CacheFirst({
      cacheName: "tinkazo-assets",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache images with CacheFirst
  registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
      cacheName: "tinkazo-images",
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
      cacheName: "tinkazo-fonts",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    })
  );

  // Cache API requests to Supabase with NetworkFirst
  registerRoute(
    ({ url }) => url.hostname.includes("supabase.co"),
    new NetworkFirst({
      cacheName: "tinkazo-api",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        }),
      ],
    })
  );
} else {
  console.warn("[SW] Workbox failed to load");
}
