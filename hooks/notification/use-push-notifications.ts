"use client";

import { useEffect, useRef } from "react";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import axios from "@/lib/axios";
import { API_UPDATE_PUSH_TOKEN_URL } from "@/utils/constants/apis/user_url";
import { firebaseApp } from "@/lib/firebase";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";

const PUSH_TOKEN_STORAGE_KEY = "apsara-push-token";

export const usePushNotifications = () => {
  /* --------------------------------- All States -------------------------------- */
  const userId = useGetCurrentUserStore((s) => s.user?.id);
  const initializedRef = useRef(false);

  /* ---------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (!userId || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    let isCancelled = false;
    let unsubscribeForegroundMessage: (() => void) | undefined;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void useNotificationStore.getState().fetchUnreadCount();
      }
    };
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_RECEIVED") {
        void useNotificationStore.getState().fetchUnreadCount();
      }
    };

    const setupPushNotifications = async () => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
      }

      const supported = await isSupported().catch(() => false);
      if (!supported) return;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) return;

      const permission =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "denied";

      if (permission === "default") {
        const result = await Notification.requestPermission();
        if (result !== "granted") return;
      } else if (permission !== "granted") {
        return;
      }

      let registration: ServiceWorkerRegistration;
      try {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" },
        );
        // Trigger an update check so the latest public SW is picked up quickly.
        void registration.update();
      } catch (error) {
        console.error("[Push] Service worker registration failed:", error);
        return;
      }

      if (isCancelled) {
        return;
      }

      const readyRegistration =
        (await navigator.serviceWorker.ready.catch(() => null)) || registration;

      const messaging = getMessaging(firebaseApp);
      let token: string | null = null;
      try {
        token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: readyRegistration || registration,
        });
      } catch (error) {
        console.error("[Push] Failed to get token:", error);
      }

      if (isCancelled) {
        return;
      }

      if (token) {
        const cached = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
        if (cached !== token) {
          try {
            await axios.post(API_UPDATE_PUSH_TOKEN_URL, { token });
            localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
            console.log("[Push] Token saved.");
          } catch (error) {
            console.error("[Push] Failed to save token:", error);
          }
        }
      }

      // Foreground message handler — fires when the app tab is focused.
      // Chrome blocks `new Notification()` in foreground contexts, so we
      // route through the service worker's showNotification() instead.
      unsubscribeForegroundMessage = onMessage(messaging, (payload) => {
        if (Notification.permission !== "granted") return;

        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "New notification";
        const body = payload.notification?.body || payload.data?.body || "";

        // Use sender avatar as the icon when provided by the backend.
        const icon =
          payload.notification?.icon ||
          payload.data?.senderAvatar ||
          "/icon.svg";

        // Tag groups messages from the same sender — new message replaces old
        // instead of stacking multiple banners.
        const senderId = payload.data?.senderId;
        const tag = senderId ? `chat-${senderId}` : undefined;

        // Deep-link URL — clicking the notification opens the correct chat thread.
        const url = payload.data?.url || "/notification";

        navigator.serviceWorker.ready.then((reg) => {
          if (isCancelled) {
            return;
          }

          reg.showNotification(title, {
            body,
            icon,
            badge: "/icon.svg",
            data: { ...(payload.data || {}), url },
            vibrate: [200, 100, 200],
            ...(tag && { tag }),
            requireInteraction: true,
          } as NotificationOptions & {
            renotify?: boolean;
            vibrate?: number[];
          });
        });

        // ── Real-time badge update (foreground) ──────────────────────────────
        // A push arrived while the tab is focused — bump the bell badge immediately
        // without waiting for a re-fetch, so the sidebar counter updates instantly.
        useNotificationStore.getState().incrementUnreadCount();
      });

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // The service worker also posts a 'NOTIFICATION_RECEIVED' message to all
      // clients when it handles a background push. This lets us update the badge
      // even if the tab is visible but was somehow out of sync.
      navigator.serviceWorker.addEventListener("message", handleSwMessage);
    };

    void setupPushNotifications();

    return () => {
      isCancelled = true;
      initializedRef.current = false;
      unsubscribeForegroundMessage?.();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker.removeEventListener("message", handleSwMessage);
    };
  }, [userId]);
};
