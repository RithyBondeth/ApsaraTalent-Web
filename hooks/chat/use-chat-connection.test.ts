import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const userMocks = vi.hoisted(() => ({ current: null as unknown }));
const chatMocks = vi.hoisted(() => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  getUnreadCount: vi.fn(),
  getRecentChats: vi.fn(),
  socket: { connected: true } as { connected: boolean } | null,
}));

vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: userMocks.current }),
}));
vi.mock("@/stores/features/chat/chat.store", () => ({
  useChatStore: { getState: () => chatMocks },
}));

import { useChatConnection } from "./use-chat-connection";

describe("useChatConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userMocks.current = null;
    chatMocks.socket = { connected: true };
    setVisibility("visible");
  });

  // jsdom's visibilityState is read-only; redefine it to drive the listener.
  const setVisibility = (state: DocumentVisibilityState) => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => state,
    });
  };

  it("does nothing without an authenticated user", () => {
    renderHook(() => useChatConnection());
    expect(chatMocks.connect).not.toHaveBeenCalled();
  });

  it("connects the authenticated user and disconnects on cleanup", () => {
    const user = { id: "user-1", role: "employee" };
    userMocks.current = user;
    const { unmount } = renderHook(() => useChatConnection());

    expect(chatMocks.connect).toHaveBeenCalledWith(user);
    unmount();
    expect(chatMocks.disconnect).toHaveBeenCalledOnce();
  });

  /*
    The message badge is maintained locally for latency, so it can drift — a
    missed event, a read on another device, a replay after a reconnect. Before
    this, getUnreadCount() ran only when the socket first connected, so nothing
    ever corrected it within a session.
  */
  it("re-reads unread state when the tab regains focus", () => {
    userMocks.current = { id: "user-1", role: "employee" };
    renderHook(() => useChatConnection());
    chatMocks.getUnreadCount.mockClear();
    chatMocks.getRecentChats.mockClear();

    document.dispatchEvent(new Event("visibilitychange"));

    expect(chatMocks.getUnreadCount).toHaveBeenCalledOnce();
    // The rows have to agree with the total: markAsRead recomputes the badge
    // by summing them, so a stale row would immediately undo the re-read.
    expect(chatMocks.getRecentChats).toHaveBeenCalledOnce();
  });

  it("does not re-read while the tab is hidden or the socket is down", () => {
    userMocks.current = { id: "user-1", role: "employee" };
    renderHook(() => useChatConnection());
    chatMocks.getUnreadCount.mockClear();

    setVisibility("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(chatMocks.getUnreadCount).not.toHaveBeenCalled();

    setVisibility("visible");
    chatMocks.socket = null;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(chatMocks.getUnreadCount).not.toHaveBeenCalled();
  });

  it("stops listening once unmounted", () => {
    userMocks.current = { id: "user-1", role: "employee" };
    const { unmount } = renderHook(() => useChatConnection());
    unmount();
    chatMocks.getUnreadCount.mockClear();

    document.dispatchEvent(new Event("visibilitychange"));
    expect(chatMocks.getUnreadCount).not.toHaveBeenCalled();
  });
});
