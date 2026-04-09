self.addEventListener('push', (event) => {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = { title: 'Love Pages', body: event.data.text(), url: '/' };
    }

    const options = {
        body: payload.body || '',
        icon: payload.icon || '/favicon.ico',
        badge: '/favicon.ico',
        data: { url: payload.url || '/dashboard' },
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(clients.openWindow(url));
});
