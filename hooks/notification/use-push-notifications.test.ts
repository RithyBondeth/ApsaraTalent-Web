import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const messagingMocks = vi.hoisted(() => ({
  getMessaging: vi.fn(() => ({ id: "messaging" })),
  getToken: vi.fn(),
  isSupported: vi.fn(),
  onMessage: vi.fn(),
}));
const userMocks = vi.hoisted(() => ({ current: null as unknown }));
const pushTokenMocks = vi.hoisted(() => ({ update: vi.fn() }));
const notificationMocks = vi.hoisted(() => ({ query: vi.fn(), increment: vi.fn() }));

vi.mock("firebase/messaging", () => messagingMocks);
vi.mock("@/lib/firebase", () => ({ getFirebaseApp: () => ({ id: "firebase-app" }) }));
vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: userMocks.current }),
}));
vi.mock("@/stores/apis/notification/update-push-token.store", () => ({
  useUpdatePushTokenStore: { getState: () => ({ updatePushToken: pushTokenMocks.update }) },
}));
vi.mock("@/stores/apis/notification/notification.store", () => ({
  useNotificationStore: {
    getState: () => ({
      queryUnreadCount: notificationMocks.query,
      incrementUnreadCount: notificationMocks.increment,
    }),
  },
}));

import { PUSH_TOKEN_STORAGE_KEY } from "@/utils/constants/cookie.constant";
import { usePushNotifications } from "./use-push-notifications";

describe("usePushNotifications", () => {
  const originalVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  const showNotification = vi.fn();
  const update = vi.fn().mockResolvedValue(undefined);
  const register = vi.fn();
  const addServiceWorkerListener = vi.fn();
  const removeServiceWorkerListener = vi.fn();
  const registration = { update, showNotification };
  let foregroundHandler: ((payload: Record<string, unknown>) => void) | undefined;
  let serviceWorkerMessageHandler: ((event: MessageEvent) => void) | undefined;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    userMocks.current = { id: "user-1" };
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY = "test-vapid-key";
    messagingMocks.isSupported.mockResolvedValue(true);
    messagingMocks.getToken.mockResolvedValue("push-token-1");
    messagingMocks.onMessage.mockImplementation((_messaging, handler) => {
      foregroundHandler = handler;
      return vi.fn();
    });
    pushTokenMocks.update.mockResolvedValue(undefined);
    register.mockResolvedValue(registration);
    addServiceWorkerListener.mockImplementation((event, handler) => {
      if (event === "message") serviceWorkerMessageHandler = handler;
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        register,
        ready: Promise.resolve(registration),
        addEventListener: addServiceWorkerListener,
        removeEventListener: removeServiceWorkerListener,
      },
    });
    vi.stubGlobal("Notification", {
      permission: "granted",
      requestPermission: vi.fn().mockResolvedValue("granted"),
    });
    foregroundHandler = undefined;
    serviceWorkerMessageHandler = undefined;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY = originalVapidKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("registers push messaging and saves a changed token", async () => {
    renderHook(() => usePushNotifications());

    await waitFor(() => expect(pushTokenMocks.update).toHaveBeenCalledWith("push-token-1"));

    expect(register).toHaveBeenCalledWith("/firebase-messaging-sw.js", { scope: "/" });
    expect(update).toHaveBeenCalled();
    expect(messagingMocks.getToken).toHaveBeenCalledWith(
      { id: "messaging" },
      { vapidKey: "test-vapid-key", serviceWorkerRegistration: registration },
    );
    expect(localStorage.getItem(PUSH_TOKEN_STORAGE_KEY)).toBe("push-token-1");
  });

  it("does not upload an unchanged cached token", async () => {
    localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, "push-token-1");
    renderHook(() => usePushNotifications());

    await waitFor(() => expect(messagingMocks.getToken).toHaveBeenCalled());
    expect(pushTokenMocks.update).not.toHaveBeenCalled();
  });

  it("shows foreground notifications and updates the intended user's badge", async () => {
    renderHook(() => usePushNotifications());
    await waitFor(() => expect(messagingMocks.onMessage).toHaveBeenCalled());

    foregroundHandler?.({
      notification: { title: "New message", body: "Hello", icon: "/sender.png" },
      data: { senderId: "user-2", targetUserId: "user-1", url: "/message?user=user-2" },
    });
    await Promise.resolve();

    expect(showNotification).toHaveBeenCalledWith(
      "New message",
      expect.objectContaining({
        body: "Hello",
        icon: "/sender.png",
        tag: "chat-user-2",
        data: expect.objectContaining({ url: "/message?user=user-2" }),
      }),
    );
    expect(notificationMocks.increment).toHaveBeenCalledOnce();

    foregroundHandler?.({ data: { targetUserId: "another-user" } });
    expect(notificationMocks.increment).toHaveBeenCalledOnce();
  });

  it("refreshes unread state on visibility and service-worker messages", async () => {
    renderHook(() => usePushNotifications());
    await waitFor(() => expect(addServiceWorkerListener).toHaveBeenCalled());
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });

    document.dispatchEvent(new Event("visibilitychange"));
    serviceWorkerMessageHandler?.(
      new MessageEvent("message", { data: { type: "NOTIFICATION_RECEIVED" } }),
    );

    expect(notificationMocks.query).toHaveBeenCalledTimes(2);
  });

  it("skips setup without a user and removes listeners on cleanup", async () => {
    userMocks.current = null;
    const empty = renderHook(() => usePushNotifications());
    expect(messagingMocks.isSupported).not.toHaveBeenCalled();
    empty.unmount();

    userMocks.current = { id: "user-1" };
    const active = renderHook(() => usePushNotifications());
    await waitFor(() => expect(addServiceWorkerListener).toHaveBeenCalled());
    active.unmount();
    expect(removeServiceWorkerListener).toHaveBeenCalledWith("message", expect.any(Function));
  });
});
