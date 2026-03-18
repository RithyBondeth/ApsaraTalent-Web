// Firebase Messaging Service Worker
// Handles background push notifications when the app tab is not focused.
// Must be at /public/firebase-messaging-sw.js so it is served from the root: /firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// ── Firebase config (must match .env.local values) ──────────────────────────
// These are public-safe values (no secrets). The service worker cannot read
// Next.js environment variables, so values are inlined here.
firebase.initializeApp({
  apiKey: "AIzaSyDnITQGotWtXV-5We43hQTWhOSSlGA6nXU",
  authDomain: "apsara-talent-2af93.firebaseapp.com",
  projectId: "apsara-talent-2af93",
  storageBucket: "apsara-talent-2af93.firebasestorage.app",
  messagingSenderId: "768444244872",
  appId: "1:768444244872:web:cd7139525ad5dbb08a503d",
});

const messaging = firebase.messaging();

// ── Background message handler ───────────────────────────────────────────────
// Fires when a push arrives and the app tab is closed or in the background.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "New notification";
  const body = payload.notification?.body || payload.data?.body || "";
  const icon = payload.notification?.icon || payload.data?.senderAvatar || "/icon.svg";

  const senderId = payload.data?.senderId;
  const tag = senderId ? `chat-${senderId}` : undefined;
  const url = payload.data?.url || "/notification";

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/icon.svg",
    data: { ...(payload.data || {}), url },
    vibrate: [200, 100, 200],
    ...(tag && { tag }),
    renotify: true,
    requireInteraction: true,
  });

  // ── Notify open tabs to refresh their unread badge ───────────────────────
  // If the user has the app open in another tab while this push arrives,
  // post a message so the foreground tab can re-fetch the unread count.
  clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
    for (const client of clientList) {
      client.postMessage({ type: "NOTIFICATION_RECEIVED" });
    }
  });
});

// ── Notification click handler ───────────────────────────────────────────────
// Opens or focuses the correct page when the user clicks the notification.
// For chat notifications, deep-links directly to the sender's chat thread.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Prefer the url from notification data (e.g. /message?chat=<senderId>),
  // fall back to the notifications page.
  const urlToOpen =
    event.notification.data?.url ||
    event.notification.data?.fcmOptions?.link ||
    "/notification";

  const targetUrl = new URL(urlToOpen, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If there is already a tab open on the same URL, focus it
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        // If any app tab is open, navigate it to the target URL and focus it
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // No tab open — open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
