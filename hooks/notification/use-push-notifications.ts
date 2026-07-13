"use client";

import { useEffect, useRef } from "react";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { useUpdatePushTokenStore } from "@/stores/apis/notification/update-push-token.store";
import { getFirebaseApp } from "@/lib/firebase";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { PUSH_TOKEN_STORAGE_KEY } from "@/utils/constants/cookie.constant";

/* ----------------------------------- Usage ---------------------------------- */
/**
 * Requests browser notification permission, registers the Firebase service
 * worker, and wires up foreground push handlers for the current user.
 *
 * Usage:
 *   // Mount once in the authenticated layout — handles its own deduplication.
 *   usePushNotifications();
 *
 *   // The hook automatically:
 *   //  - Requests notification permission on first run
 *   //  - Saves the FCM push token to the backend if it changed
 *   //  - Updates the unread notification badge on foreground / background pushes
 */

/* ----------------------------------- Hook ----------------------------------- */
export const usePushNotifications = () => {
  /* ------------------------------- All States ------------------------------- */
  const userId = useGetCurrentUserStore((s) => s.user?.id);
  const initializedRef = useRef(false);

  /* -------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (!userId || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    let isCancelled = false;
    let unsubscribeForegroundMessage: (() => void) | undefined;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void useNotificationStore.getState().queryUnreadCount();
      }
    };
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_RECEIVED") {
        void useNotificationStore.getState().queryUnreadCount();
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

      const messaging = getMessaging(getFirebaseApp());
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
            await useUpdatePushTokenStore.getState().updatePushToken(token);
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
        // Only bump the badge if this push was addressed to the current user.
        // Skipping the check when targetUserId is absent keeps backward compat.
        // Interview badge + page updates are handled by the interviewUpdate
        // socket event, not here.
        const targetUserId = payload.data?.targetUserId;
        if (!targetUserId || targetUserId === userId) {
          useNotificationStore.getState().incrementUnreadCount();
        }
      });

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // The service worker also posts a 'NOTIFICATION_RECEIVED' message to all
      // clients when it handles a background push. This lets us update the badge
      // even if the tab is visible but was somehow out of sync.
      navigator.serviceWorker.addEventListener("message", handleSwMessage);
    };

    void setupPushNotifications();

    /* --------------------------------- Cleanup --------------------------------- */
    return () => {
      isCancelled = true;
      initializedRef.current = false;
      unsubscribeForegroundMessage?.();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker.removeEventListener("message", handleSwMessage);
    };
  }, [userId]);
};
