import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { beforeEach, describe, expect, it, vi } from "vitest";

type BackgroundHandler = (payload: Record<string, unknown>) => void;
type ClickHandler = (event: {
  notification: { close: () => void; data?: Record<string, unknown> };
  waitUntil: (promise: Promise<unknown>) => void;
}) => void;

describe("Firebase messaging service worker", () => {
  let backgroundHandler: BackgroundHandler;
  let clickHandler: ClickHandler;
  let showNotification: ReturnType<typeof vi.fn>;
  let matchAll: ReturnType<typeof vi.fn>;
  let openWindow: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    showNotification = vi.fn();
    matchAll = vi.fn().mockResolvedValue([]);
    openWindow = vi.fn().mockResolvedValue(undefined);
    const source = readFileSync(
      resolve(process.cwd(), "public/firebase-messaging-sw.js"),
      "utf8",
    );
    const messaging = {
      onBackgroundMessage: vi.fn((handler: BackgroundHandler) => {
        backgroundHandler = handler;
      }),
    };
    const context = {
      URL,
      importScripts: vi.fn(),
      firebase: {
        initializeApp: vi.fn(),
        messaging: vi.fn(() => messaging),
      },
      clients: { matchAll, openWindow },
      self: {
        location: { origin: "https://app.example.com" },
        registration: { showNotification },
        addEventListener: vi.fn((name: string, handler: ClickHandler) => {
          if (name === "notificationclick") clickHandler = handler;
        }),
      },
    };

    runInNewContext(source, context, { filename: "firebase-messaging-sw.js" });
  });

  it("shows a bounded background notification and refreshes open tabs", async () => {
    const postMessage = vi.fn();
    matchAll.mockResolvedValue([{ postMessage }]);

    backgroundHandler({
      notification: { title: "New message", body: "Hello" },
      data: {
        senderId: "user-2",
        senderAvatar: "/avatar.png",
        url: "/message?chat=user-2",
      },
    });
    await Promise.resolve();

    expect(showNotification).toHaveBeenCalledWith(
      "New message",
      expect.objectContaining({
        body: "Hello",
        icon: "/avatar.png",
        tag: "chat-user-2",
        data: expect.objectContaining({ url: "/message?chat=user-2" }),
      }),
    );
    expect(postMessage).toHaveBeenCalledWith({
      type: "NOTIFICATION_RECEIVED",
    });
  });

  it("focuses an existing tab matching the notification URL", async () => {
    const focus = vi.fn().mockResolvedValue(undefined);
    matchAll.mockResolvedValue([
      { url: "https://app.example.com/message?chat=user-2", focus },
    ]);
    const close = vi.fn();
    let completion: Promise<unknown> | undefined;

    clickHandler({
      notification: { close, data: { url: "/message?chat=user-2" } },
      waitUntil: (promise) => {
        completion = promise;
      },
    });
    await completion;

    expect(close).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
    expect(openWindow).not.toHaveBeenCalled();
  });

  it("navigates an app tab or opens a new tab as fallbacks", async () => {
    const navigate = vi.fn();
    const focus = vi.fn().mockResolvedValue(undefined);
    matchAll.mockResolvedValueOnce([
      { url: "https://app.example.com/feed", navigate, focus },
    ]);
    let firstCompletion: Promise<unknown> | undefined;
    clickHandler({
      notification: {
        close: vi.fn(),
        data: { fcmOptions: { link: "/matching" } },
      },
      waitUntil: (promise) => {
        firstCompletion = promise;
      },
    });
    await firstCompletion;
    expect(navigate).toHaveBeenCalledWith("https://app.example.com/matching");
    expect(focus).toHaveBeenCalledOnce();

    matchAll.mockResolvedValueOnce([]);
    let secondCompletion: Promise<unknown> | undefined;
    clickHandler({
      notification: { close: vi.fn() },
      waitUntil: (promise) => {
        secondCompletion = promise;
      },
    });
    await secondCompletion;
    expect(openWindow).toHaveBeenCalledWith(
      "https://app.example.com/notification",
    );
  });
});
