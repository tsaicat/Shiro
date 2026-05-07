// Shiro PWA Service Worker
const CACHE = 'shiro-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Cache the app files on fetch for offline support
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Handle notification clicks — focus the app window
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // If app window already open, focus it
      for (const client of list) {
        if (client.url.includes('shiro') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('./shiro-pwa-v1.0.html');
      }
    })
  );
});

// Handle push events (future-proofing for push notifications)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  self.registration.showNotification(data.title || '🔔 Shiro Reminder!', {
    body: data.body || 'Nyaa~ Time for your task!',
    icon: 'shiro-icon.png',
    badge: 'shiro-icon.png',
    vibrate: [200, 100, 200],
    requireInteraction: true
  });
});
