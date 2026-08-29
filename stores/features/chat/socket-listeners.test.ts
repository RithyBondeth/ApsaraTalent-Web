import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  IChatPreview,
  IMessage,
} from "@/utils/interfaces/chat/chat.interface";
import type { TChatState } from "./types";
import { createMockSocket } from "@/tests/helpers/mock-socket";

const notificationMocks = vi.hoisted(() => ({
  add: vi.fn(),
  query: vi.fn(),
}));
const interviewMocks = vi.hoisted(() => ({ refetch: vi.fn() }));
const currentUserMocks = vi.hoisted(() => ({ getState: vi.fn() }));
const employeeMatchingMocks = vi.hoisted(() => ({
  refetch: vi.fn(),
  refreshCount: vi.fn(),
}));
const companyMatchingMocks = vi.hoisted(() => ({
  refetch: vi.fn(),
  refreshCount: vi.fn(),
}));
const toastMocks = vi.hoisted(() => ({ info: vi.fn() }));

vi.mock("@/stores/apis/notification/notification.store", () => ({
  useNotificationStore: {
    getState: () => ({
      addNotification: notificationMocks.add,
      queryUnreadCount: notificationMocks.query,
    }),
  },
}));
vi.mock("@/stores/apis/matching/interview.store", () => ({
  useInterviewStore: {
    getState: () => ({ silentRefetch: interviewMocks.refetch }),
  },
}));
vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: { getState: currentUserMocks.getState },
}));
vi.mock("@/stores/apis/matching/get-current-employee-matching.store", () => ({
  useGetCurrentEmployeeMatchingStore: {
    getState: () => ({ silentRefetch: employeeMatchingMocks.refetch }),
  },
}));
vi.mock("@/stores/apis/matching/get-current-company-matching.store", () => ({
  useGetCurrentCompanyMatchingStore: {
    getState: () => ({ silentRefetch: companyMatchingMocks.refetch }),
  },
}));
vi.mock("@/stores/apis/matching/count-current-employee-matching.store", () => ({
  useCountCurrentEmployeeMatchingStore: {
    getState: () => ({
      refreshEmpMatchingCount: employeeMatchingMocks.refreshCount,
    }),
  },
}));
vi.mock("@/stores/apis/matching/count-current-company-matching.store", () => ({
  useCountCurrentCompanyMatchingStore: {
    getState: () => ({
      refreshCmpMatchingCount: companyMatchingMocks.refreshCount,
    }),
  },
}));
vi.mock("sonner", () => ({ toast: toastMocks }));
vi.mock("@/utils/functions/media", () => ({
  normalizeMediaUrl: (value: string | null | undefined) => value ?? null,
}));

import {
  markUnmatchInitiated,
  registerSocketListeners,
} from "./socket-listeners";

const preview = (id: string): IChatPreview => ({
  id,
  name: `User ${id}`,
  avatar: "/avatar.png",
  preview: "Old preview",
  time: "10:00",
  unread: 0,
  isRead: true,
  lastMessageSenderId: "user-1",
  isOnline: false,
});

const message = (id: string, overrides: Partial<IMessage> = {}): IMessage => ({
  id,
  senderId: "user-2",
  senderName: "Sophea",
  content: "Hello",
  timestamp: new Date("2026-07-23T10:00:00.000Z"),
  isMe: false,
  isRead: false,
  messageType: "text",
  reactions: {},
  ...overrides,
});

function createStateHarness(overrides: Partial<TChatState> = {}) {
  let state: TChatState = {
    socket: null,
    isConnected: true,
    isChatsLoaded: true,
    isHistoryLoading: false,
    me: { id: "user-1", name: "Sokha" },
    activeChat: null,
    activeChats: [],
    currentMessages: [],
    unreadCount: 0,
    isTyping: {},
    onlineUsers: {},
    connect: vi.fn(),
    disconnect: vi.fn(),
    setMe: vi.fn(),
    sendMessage: vi.fn(() => true),
    getRecentChats: vi.fn(),
    getChatHistory: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    reactToMessage: vi.fn(),
    setTyping: vi.fn(),
    setActiveChat: vi.fn(),
    deleteMessage: vi.fn(),
    editMessage: vi.fn(),
    removeChatByPartnerId: vi.fn(),
    ...overrides,
  };

  const set = (
    update:
      Partial<TChatState> | ((current: TChatState) => Partial<TChatState>),
  ) => {
    const next = typeof update === "function" ? update(state) : update;
    state = { ...state, ...next };
  };

  return { get: () => state, set };
}

describe("chat socket listeners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentUserMocks.getState.mockReturnValue({
      user: { role: "employee", employee: { id: "employee-1" }, company: null },
    });
  });

  it("registers every supported server event", () => {
    const socket = createMockSocket();
    const harness = createStateHarness();

    registerSocketListeners(socket as never, harness.set as never, harness.get);

    expect(Array.from(socket.listeners.keys())).toEqual([
      "newMessage",
      "userTyping",
      "messageReaction",
      "messageRead",
      "userStatus",
      "messageDeleted",
      "messageEdited",
      "newNotification",
      "badgeIncrement",
      "interviewUpdate",
      "unmatchUpdate",
      "error",
    ]);
  });

  it("updates a sidebar preview and unread total for an inactive incoming message", () => {
    const socket = createMockSocket();
    const harness = createStateHarness({ activeChats: [preview("user-2")] });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("newMessage")?.({
      id: "message-1",
      senderId: "user-2",
      receiverId: "user-1",
      content: "New message",
      sentAt: "2026-07-23T10:00:00.000Z",
      isRead: false,
    });

    expect(harness.get()).toMatchObject({
      unreadCount: 1,
      activeChats: [
        expect.objectContaining({
          id: "user-2",
          preview: "New message",
          unread: 1,
          isRead: false,
          lastMessageSenderId: "user-2",
        }),
      ],
    });
  });

  it("raises the badge for a first message from a partner with no sidebar row", () => {
    const socket = createMockSocket();
    const getRecentChats = vi.fn();
    // No activeChats: nobody has messaged this user before.
    const harness = createStateHarness({ activeChats: [], getRecentChats });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("newMessage")?.({
      id: "message-1",
      senderId: "user-9",
      receiverId: "user-1",
      content: "First contact",
      sentAt: "2026-07-23T10:00:00.000Z",
      isRead: false,
    });

    /*
      This branch used to return {} and leave the count untouched, so an
      opening message from a new contact never reached the navbar badge.
    */
    expect(harness.get().unreadCount).toBe(1);
    // The sidebar row itself is rebuilt from the server, exactly once.
    expect(getRecentChats).toHaveBeenCalledOnce();
  });

  it("counts an incoming message whose IDs differ only in casing", () => {
    const socket = createMockSocket();
    const harness = createStateHarness({ activeChats: [preview("user-2")] });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("newMessage")?.({
      id: "message-1",
      senderId: "USER-2",
      receiverId: "USER-1",
      content: "Shouty identifiers",
      sentAt: "2026-07-23T10:00:00.000Z",
      isRead: false,
    });

    /*
      Raw === comparisons made this message look neither from nor for the
      current user, so it silently skipped the unread accounting entirely.
    */
    expect(harness.get()).toMatchObject({
      unreadCount: 1,
      activeChats: [expect.objectContaining({ id: "user-2", unread: 1 })],
    });
  });

  it("keeps my unread count when the partner reads a message I sent", () => {
    const socket = createMockSocket();
    // They read something of mine, but have since sent me three messages.
    const chat = {
      ...preview("user-2"),
      unread: 3,
      isRead: false,
      lastMessageSenderId: "user-2",
    };
    const harness = createStateHarness({
      activeChats: [chat],
      currentMessages: [message("message-1")],
    });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("messageRead")?.({
      messageId: "message-1",
      readerId: "user-2",
    });

    /*
      A read receipt is about MY outgoing message. It previously set
      `unread: 0` on the row, wiping unread messages they had sent me.
    */
    expect(harness.get().activeChats[0]).toMatchObject({
      unread: 3,
      isRead: false,
    });
    // The message's own delivery state still advances to "seen".
    expect(harness.get().currentMessages[0]).toMatchObject({
      deliveryStatus: "seen",
    });
  });

  it("adds active-chat messages, resolves replies, and replaces optimistic messages", () => {
    const socket = createMockSocket();
    const parent = message("parent", {
      content: "Original",
      isMe: true,
      senderId: "user-1",
    });
    const harness = createStateHarness({
      activeChat: preview("user-2"),
      activeChats: [preview("user-2")],
      currentMessages: [parent],
    });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("newMessage")?.({
      id: "reply",
      senderId: "user-2",
      senderName: "Sophea",
      receiverId: "user-1",
      content: "A reply",
      replyToId: "parent",
      isRead: false,
    });
    expect(harness.get().currentMessages[1]).toMatchObject({
      id: "reply",
      replyTo: { id: "parent", content: "Original" },
      isMe: false,
    });

    harness.set({
      currentMessages: [
        message("temp", { senderId: "user-1", isMe: true, content: "Mine" }),
      ],
    });
    socket.listeners.get("newMessage")?.({
      id: "message-real",
      senderId: "user-1",
      receiverId: "user-2",
      content: "Mine",
      isRead: false,
    });
    expect(harness.get().currentMessages).toEqual([
      expect.objectContaining({
        id: "message-real",
        deliveryStatus: "sent",
        isMe: true,
      }),
    ]);
  });

  it("applies typing, reaction, read, presence, delete, and edit events", () => {
    const socket = createMockSocket();
    const chat = preview("user-2");
    const harness = createStateHarness({
      activeChat: chat,
      activeChats: [chat],
      currentMessages: [message("message-1")],
    });
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("userTyping")?.({ userId: "user-2", isTyping: true });
    socket.listeners.get("messageReaction")?.({
      messageId: "message-1",
      reactions: { "user-1": "👍" },
    });
    socket.listeners.get("messageRead")?.({
      messageId: "message-1",
      readerId: "user-2",
    });
    socket.listeners.get("userStatus")?.({
      userId: "user-2",
      status: "online",
    });
    socket.listeners.get("messageDeleted")?.({ messageId: "message-1" });
    socket.listeners.get("messageEdited")?.({
      messageId: "message-1",
      newContent: "Updated",
      isEdited: true,
    });

    expect(harness.get()).toMatchObject({
      isTyping: { "user-2": true },
      onlineUsers: { "user-2": true },
      activeChat: expect.objectContaining({ isOnline: true }),
      activeChats: [
        expect.objectContaining({ isOnline: true, isRead: true, unread: 0 }),
      ],
      currentMessages: [
        expect.objectContaining({
          content: "Updated",
          reactions: { "user-1": "👍" },
          isRead: true,
          deliveryStatus: "seen",
          isDeleted: true,
          isEdited: true,
        }),
      ],
    });
  });

  it("validates notifications and refreshes role-specific match and interview state", () => {
    const socket = createMockSocket();
    const harness = createStateHarness();
    registerSocketListeners(socket as never, harness.set as never, harness.get);
    const baseNotification = {
      id: "notification-1",
      title: "Update",
      message: "You have an update",
      data: null,
      isRead: false,
      createdAt: "2026-07-23T10:00:00.000Z",
      updatedAt: "2026-07-23T10:00:00.000Z",
    };

    socket.listeners.get("newNotification")?.({
      ...baseNotification,
      type: "match",
    });
    expect(notificationMocks.add).toHaveBeenCalledOnce();
    // Re-read rather than +1: a replayed event must not move the number.
    expect(employeeMatchingMocks.refreshCount).toHaveBeenCalledWith(
      "employee-1",
    );
    expect(employeeMatchingMocks.refetch).toHaveBeenCalledWith("employee-1");

    socket.listeners.get("newNotification")?.({
      ...baseNotification,
      id: "notification-2",
      type: "interview",
    });
    expect(interviewMocks.refetch).toHaveBeenCalledWith(
      "employee-1",
      "employee",
    );

    socket.listeners.get("newNotification")?.({ id: 123, type: "match" });
    expect(notificationMocks.add).toHaveBeenCalledTimes(2);
    /*
      'badgeIncrement' re-fetches instead of incrementing locally — the same
      event also arrives as a Firebase push, and two local +1s drifted the
      badge upward with no way back down.
    */
    socket.listeners.get("badgeIncrement")?.();
    expect(notificationMocks.query).toHaveBeenCalledOnce();
    /*
      'badgeIncrement' is the only event the server actually sends for a new
      match, so it has to drive the matching badge too — the 'newNotification'
      match branch never fires, because that event is emitted for chat only.
    */
    expect(employeeMatchingMocks.refreshCount).toHaveBeenCalledWith(
      "employee-1",
    );
  });

  it("refreshes after unmatch and suppresses the initiator-only toast", () => {
    const socket = createMockSocket();
    const harness = createStateHarness();
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("unmatchUpdate")?.();
    expect(toastMocks.info).toHaveBeenCalledOnce();
    /*
      Re-read instead of -1. The old decrement also walked the localStorage
      "seen" mark down alongside the total, which is what let the two drift
      apart and silently zero the badge.
    */
    expect(employeeMatchingMocks.refreshCount).toHaveBeenCalledWith(
      "employee-1",
    );

    markUnmatchInitiated();
    socket.listeners.get("unmatchUpdate")?.();
    expect(toastMocks.info).toHaveBeenCalledTimes(1);
    expect(employeeMatchingMocks.refreshCount).toHaveBeenCalledTimes(2);
    expect(interviewMocks.refetch).toHaveBeenCalledTimes(2);
  });

  it("logs safe socket error messages", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const socket = createMockSocket();
    const harness = createStateHarness();
    registerSocketListeners(socket as never, harness.set as never, harness.get);

    socket.listeners.get("error")?.(new Error("socket failed"));

    expect(errorSpy).toHaveBeenCalledWith("Socket error:", "socket failed");
  });
});
