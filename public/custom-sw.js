// Custom Service Worker for Push Notifications - TINKAZO
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.message || data.body || "Nueva notificación",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-96.png",
      vibrate: [200, 100, 200],
      tag: data.tag || "tinkazo-notification",
      renotify: true,
      data: { url: data.url || "/" },
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "TINKAZO", options)
    );
  } catch (err) {
    console.error("Error processing push:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
