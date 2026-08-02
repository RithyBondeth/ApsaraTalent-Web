import { beforeEach, describe, expect, it, vi } from "vitest";
import type { INotification } from "@/utils/interfaces/notification/notification.interface";

import { useNotificationStore } from "./notification.store";
import { useUpdatePushTokenStore } from "./update-push-token.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

const notification = (id: string, isRead = false): INotification => ({
  id,
  title: "New message",
  message: "You have a new message",
  type: "chat",
  data: { messageId: `message-${id}` },
  isRead,
  createdAt: "2026-07-23T00:00:00.000Z",
  updatedAt: "2026-07-23T00:00:00.000Z",
});

describe("notification API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useNotificationStore.setState({
      loading: false,
      error: null,
      notifications: [],
      total: 0,
      page: 1,
      limit: 20,
      unreadCount: 0,
    });
    useUpdatePushTokenStore.setState({ loading: false, error: null });
  });

  it("loads notifications and the unread count", async () => {
    const items = [notification("notification-1")];
    axiosMocks.get
      .mockResolvedValueOnce({ data: { items, total: 1, page: 2, limit: 10 } })
      .mockResolvedValueOnce({ data: { unreadCount: 4 } });

    await useNotificationStore
      .getState()
      .queryNotifications({ page: 2, limit: 10, unreadOnly: true });
    await useNotificationStore.getState().queryUnreadCount();

    expect(axiosMocks.get.mock.calls[0]?.[1]).toEqual({
      params: { page: 2, limit: 10, unreadOnly: true },
    });
    expect(useNotificationStore.getState()).toMatchObject({
      notifications: items,
      total: 1,
      page: 2,
      limit: 10,
      unreadCount: 4,
      loading: false,
      error: null,
    });
  });

  it("updates local badge and notification state", () => {
    const item = notification("notification-1");

    useNotificationStore.getState().incrementUnreadCount();
    useNotificationStore.getState().addNotification(item);
    useNotificationStore.getState().addNotification(item);

    expect(useNotificationStore.getState().notifications).toEqual([item]);
    expect(useNotificationStore.getState().unreadCount).toBe(3);
    useNotificationStore.getState().resetUnreadCount();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("marks one, all, and chat-linked notifications as read", async () => {
    const first = notification("notification-1");
    const second = notification("notification-2");
    axiosMocks.patch.mockResolvedValue({ data: {} });
    useNotificationStore.setState({ notifications: [first, second], unreadCount: 2 });

    await useNotificationStore.getState().markRead("notification-1");
    expect(useNotificationStore.getState().notifications[0]?.isRead).toBe(true);

    useNotificationStore
      .getState()
      .markReadByChatMessageId("message-notification-2");
    expect(useNotificationStore.getState().notifications[1]?.isRead).toBe(true);

    useNotificationStore.setState({
      notifications: [notification("notification-1"), notification("notification-2")],
      unreadCount: 2,
    });
    await useNotificationStore.getState().markAllRead();
    expect(useNotificationStore.getState().notifications.every((item) => item.isRead)).toBe(true);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("rolls a read update back if the server rejects it", async () => {
    axiosMocks.patch.mockRejectedValueOnce(new Error("offline"));
    useNotificationStore.setState({
      notifications: [notification("notification-1")],
      unreadCount: 1,
    });

    await useNotificationStore.getState().markRead("notification-1");

    expect(useNotificationStore.getState().notifications[0]?.isRead).toBe(false);
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it("deletes one notification and then all notifications", async () => {
    axiosMocks.delete.mockResolvedValue({ data: {} });
    useNotificationStore.setState({
      notifications: [notification("notification-1"), notification("notification-2", true)],
      unreadCount: 1,
    });

    await useNotificationStore.getState().deleteNotification("notification-1");
    expect(useNotificationStore.getState()).toMatchObject({
      notifications: [notification("notification-2", true)],
      unreadCount: 0,
    });
    await useNotificationStore.getState().deleteAllNotifications();
    expect(useNotificationStore.getState()).toMatchObject({ notifications: [], unreadCount: 0 });
    expect(axiosMocks.delete).toHaveBeenCalledTimes(2);
  });

  it("updates the device push token", async () => {
    axiosMocks.post.mockResolvedValueOnce({ data: {} });

    await useUpdatePushTokenStore.getState().updatePushToken("push-token-1");

    expect(axiosMocks.post).toHaveBeenCalledWith(expect.any(String), { token: "push-token-1" });
    expect(useUpdatePushTokenStore.getState()).toMatchObject({ loading: false, error: null });
  });
});
