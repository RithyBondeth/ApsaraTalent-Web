import { useEffect, useRef } from "react";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import axios from "@/lib/axios";
import { API_UPDATE_PUSH_TOKEN_URL } from "@/utils/constants/apis/user_url";
import { firebaseApp } from "@/utils/firebase/firebase";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

const PUSH_TOKEN_STORAGE_KEY = "apsara-push-token";

export const usePushNotifications = () => {
  const userId = useGetCurrentUserStore((s) => s.user?.id);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

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

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
      const readyRegistration = await navigator.serviceWorker.ready;

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
      onMessage(messaging, (payload) => {
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
      });
    };

    void setupPushNotifications();
  }, [userId]);
};
