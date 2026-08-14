import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  IChatPreview,
  IMessage,
} from "@/utils/interfaces/chat/chat.interface";
import { createMockSocket } from "@/tests/helpers/mock-socket";

const socketManagerMocks = vi.hoisted(() => ({
  getSocket: vi.fn(),
  setSocket: vi.fn(),
  clearPendingDisconnect: vi.fn(),
  scheduleDisconnect: vi.fn(),
  createSocket: vi.fn(),
}));
const listenerMocks = vi.hoisted(() => ({ registerSocketListeners: vi.fn() }));
const recentChatMocks = vi.hoisted(() => ({ fetchRecentChats: vi.fn() }));
const notificationMocks = vi.hoisted(() => ({
  markReadByChatMessageId: vi.fn(),
}));
const callMocks = vi.hoisted(() => ({ initCallSignaling: vi.fn() }));

vi.mock("./socket-manager", () => socketManagerMocks);
vi.mock("./socket-listeners", () => listenerMocks);
vi.mock("@/stores/apis/chat/get-recent-chats.store", () => ({
  useGetRecentChatsStore: {
    getState: () => ({ fetchRecentChats: recentChatMocks.fetchRecentChats }),
  },
}));
vi.mock("@/stores/apis/notification/notification.store", () => ({
  useNotificationStore: {
    getState: () => ({
      markReadByChatMessageId: notificationMocks.markReadByChatMessageId,
    }),
  },
}));
vi.mock("../call/call.store", () => ({
  useCallStore: {
    getState: () => ({ initCallSignaling: callMocks.initCallSignaling }),
  },
}));
vi.mock("@/utils/functions/media", () => ({
  normalizeMediaUrl: (value: string | null | undefined) => value ?? null,
}));

import { useChatStore } from "./chat.store";

const preview = (id: string): IChatPreview => ({
  id,
  name: `User ${id}`,
  avatar: "/avatar.png",
  preview: "Hello",
  time: "10:00",
  unread: 1,
  isRead: false,
  lastMessageSenderId: id,
  isOnline: false,
});

const message = (id: string, overrides: Partial<IMessage> = {}): IMessage => ({
  id,
  senderId: "user-2",
  content: "Hello",
  timestamp: new Date("2026-07-23T10:00:00.000Z"),
  isMe: false,
  isRead: false,
  messageType: "text",
  ...overrides,
});

describe("chat store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketManagerMocks.getSocket.mockReturnValue(null);
    socketManagerMocks.scheduleDisconnect.mockImplementation(
      (callback: () => void) => callback(),
    );
    recentChatMocks.fetchRecentChats.mockResolvedValue([]);
    useChatStore.setState({
      socket: null,
      isConnected: false,
      isChatsLoaded: false,
      isHistoryLoading: false,
      me: null,
      activeChat: null,
      activeChats: [],
      currentMessages: [],
      unreadCount: 0,
      isTyping: {},
      onlineUsers: {},
    });
  });

  it("builds recent chat previews, unread totals, and online state", () => {
    const rawChats = [
      {
        id: "message-1",
        sender: { id: "user-2", name: "Sophea", avatar: "/sophea.png" },
        receiver: { id: "user-1", name: "Sokha" },
        content: "Newest message",
        sentAt: "2026-07-23T10:00:00.000Z",
        isRead: false,
      },
      {
        id: "message-2",
        sender: { id: "user-2", name: "Sophea", avatar: "/sophea.png" },
        receiver: { id: "user-1", name: "Sokha" },
        content: "Older message",
        sentAt: "2026-07-23T09:00:00.000Z",
        isRead: false,
      },
    ];
    const socket = createMockSocket({
      getRecentChats: (callback) =>
        (callback as (error: null, value: unknown) => void)(null, rawChats),
      getOnlineUsers: (_ids, callback) =>
        (callback as (value: Record<string, boolean>) => void)({
          "user-2": true,
        }),
    });
    useChatStore.setState({
      socket: socket as never,
      me: { id: "user-1", name: "Sokha" },
    });

    useChatStore.getState().getRecentChats();

    expect(socket.timeout).toHaveBeenCalledWith(10_000);
    expect(useChatStore.getState()).toMatchObject({
      isChatsLoaded: true,
      activeChats: [
        expect.objectContaining({
          id: "user-2",
          name: "Sophea",
          preview: expect.stringContaining("Newest message"),
          unread: 2,
          isOnline: true,
        }),
      ],
      onlineUsers: { "user-2": true },
    });
  });

  it("loads chat history, resolves replies, and loads the unread count", () => {
    const history = [
      {
        id: "message-parent",
        senderId: "user-1",
        receiverId: "user-2",
        content: "Parent",
        isRead: true,
        sentAt: "2026-07-23T10:00:00.000Z",
      },
      {
        id: "message-reply",
        senderId: "user-2",
        receiverId: "user-1",
        content: "Reply",
        replyToId: "message-parent",
        isRead: false,
        sentAt: "2026-07-23T10:01:00.000Z",
      },
    ];
    const socket = createMockSocket({
      getChatHistory: (_payload, callback) =>
        (callback as (value: unknown) => void)(history),
      getUnreadCount: (_empty, callback) =>
        (callback as (value: unknown) => void)({ unreadCount: 5 }),
    });
    useChatStore.setState({
      socket: socket as never,
      me: { id: "user-1", name: "Sokha" },
      activeChat: preview("user-2"),
    });

    useChatStore.getState().getChatHistory("user-2");
    useChatStore.getState().getUnreadCount();

    expect(socket.emit).toHaveBeenCalledWith(
      "getChatHistory",
      expect.objectContaining({ userId2: "user-2", limit: expect.any(Number) }),
      expect.any(Function),
    );
    expect(useChatStore.getState()).toMatchObject({
      isHistoryLoading: false,
      unreadCount: 5,
      currentMessages: [
        expect.objectContaining({
          id: "message-parent",
          isMe: true,
          deliveryStatus: "seen",
        }),
        expect.objectContaining({
          id: "message-reply",
          isMe: false,
          replyTo: expect.objectContaining({
            id: "message-parent",
            content: "Parent",
          }),
        }),
      ],
    });
  });

  it("connects a new socket, registers listeners, and disconnects cleanly", async () => {
    const socket = createMockSocket({
      getRecentChats: (callback) =>
        (callback as (error: null, value: unknown) => void)(null, [
          {
            id: "message-1",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Hello",
          },
        ]),
      getUnreadCount: (_empty, callback) =>
        (callback as (value: unknown) => void)({ unreadCount: 1 }),
      getOnlineUsers: (_ids, callback) =>
        (callback as (value: Record<string, boolean>) => void)({
          "user-2": false,
        }),
    });
    socket.connected = false;
    socket.disconnected = true;
    socketManagerMocks.createSocket.mockReturnValue(socket);

    useChatStore.getState().connect({ id: "user-1", name: "Sokha" });

    expect(socketManagerMocks.setSocket).toHaveBeenCalledWith(socket);
    expect(listenerMocks.registerSocketListeners).toHaveBeenCalledWith(
      socket,
      expect.any(Function),
      expect.any(Function),
    );
    socket.connected = true;
    socket.disconnected = false;
    socket.listeners.get("connect")?.();
    await Promise.resolve();
    expect(useChatStore.getState()).toMatchObject({
      socket,
      isConnected: true,
      me: { id: "user-1", name: "Sokha" },
      unreadCount: 1,
    });

    socketManagerMocks.getSocket.mockReturnValue(socket);
    useChatStore.getState().disconnect();
    expect(socket.disconnect).toHaveBeenCalled();
    expect(useChatStore.getState()).toMatchObject({
      socket: null,
      isConnected: false,
      isChatsLoaded: false,
      activeChats: [],
      currentMessages: [],
      onlineUsers: {},
    });
  });

  it("marks the connection offline after socket errors and disconnects", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    const socket = createMockSocket({}, false);
    socketManagerMocks.createSocket.mockReturnValue(socket);

    useChatStore.getState().connect({ id: "user-1", name: "Sokha" });
    useChatStore.setState({ isConnected: true });
    socket.listeners.get("connect_error")?.(new Error("network unavailable"));

    expect(useChatStore.getState().isConnected).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      "[Socket] Connection error:",
      "network unavailable",
    );

    useChatStore.setState({ isConnected: true });
    socket.listeners.get("disconnect")?.("transport close");

    expect(useChatStore.getState().isConnected).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      "[Socket] Disconnected:",
      "transport close",
    );

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("sends an optimistic message and replaces its temporary id after acknowledgement", () => {
    const socket = createMockSocket({
      sendMessage: (_payload, callback) =>
        (callback as (value: unknown) => void)({
          message: { id: "message-real" },
        }),
    });
    useChatStore.setState({
      socket: socket as never,
      me: { id: "user-1", name: "Sokha" },
    });

    expect(
      useChatStore.getState().sendMessage("user-2", "Hello", "text", null, {
        url: "/voice.webm",
        type: "audio",
        filename: "voice.webm",
        duration: 12,
        amplitude: [0.2, 0.8],
      }),
    ).toBe(true);

    expect(socket.emit).toHaveBeenCalledWith(
      "sendMessage",
      expect.objectContaining({
        receiverId: "user-2",
        content: "Hello",
        type: "audio",
        attachment: "/voice.webm",
        attachmentDuration: 12,
      }),
      expect.any(Function),
    );
    expect(useChatStore.getState().currentMessages).toEqual([
      expect.objectContaining({
        id: "message-real",
        senderId: "user-1",
        attachmentType: "audio",
        deliveryStatus: "sent",
      }),
    ]);
  });

  it("selects and clears active chats while refreshing online and history state", () => {
    const chat = preview("user-2");
    const socket = createMockSocket({
      getChatHistory: (_payload, callback) =>
        (callback as (value: unknown) => void)([]),
      getOnlineUsers: (_ids, callback) =>
        (callback as (value: Record<string, boolean>) => void)({
          "user-2": true,
        }),
    });
    useChatStore.setState({
      socket: socket as never,
      me: { id: "user-1" },
      activeChats: [chat],
    });

    useChatStore.getState().setActiveChat(chat);

    expect(useChatStore.getState().activeChat).toMatchObject({
      id: "user-2",
      isOnline: true,
    });
    expect(useChatStore.getState().isHistoryLoading).toBe(false);
    useChatStore.getState().setActiveChat(null);
    expect(useChatStore.getState()).toMatchObject({
      activeChat: null,
      currentMessages: [],
      isHistoryLoading: false,
    });
  });

  it("marks, reacts, types, deletes, edits, and removes a partner chat", () => {
    const socket = createMockSocket();
    const chat = preview("user-2");
    useChatStore.setState({
      socket: socket as never,
      me: { id: "user-1" },
      activeChat: chat,
      activeChats: [chat, preview("user-3")],
      currentMessages: [message("message-1")],
      unreadCount: 2,
    });

    useChatStore.getState().markAsRead("message-1", "user-2");
    expect(useChatStore.getState().currentMessages[0]).toMatchObject({
      isRead: true,
    });
    expect(useChatStore.getState().unreadCount).toBe(1);
    expect(notificationMocks.markReadByChatMessageId).toHaveBeenCalledWith(
      "message-1",
    );

    useChatStore.getState().reactToMessage("message-1", "user-2", "👍");
    useChatStore.getState().setTyping("user-2", true);
    useChatStore.getState().deleteMessage("message-1", "user-2");
    useChatStore.getState().editMessage("message-1", "user-2", "Updated");
    expect(useChatStore.getState().currentMessages[0]).toMatchObject({
      content: "Updated",
      isDeleted: true,
      isEdited: true,
    });
    expect(socket.emit).toHaveBeenCalledWith("react", {
      messageId: "message-1",
      receiverId: "user-2",
      emoji: "👍",
    });
    expect(socket.emit).toHaveBeenCalledWith("typing", {
      receiverId: "user-2",
      isTyping: true,
    });

    useChatStore.getState().removeChatByPartnerId("USER-2");
    expect(useChatStore.getState()).toMatchObject({
      activeChat: null,
      activeChats: [expect.objectContaining({ id: "user-3" })],
      currentMessages: [],
      isHistoryLoading: false,
    });
  });

  it("does not send messages while disconnected", () => {
    useChatStore.getState().setMe({ id: "user-1", name: "Sokha" });
    expect(useChatStore.getState().sendMessage("user-2", "Hello")).toBe(false);
    expect(useChatStore.getState().me).toEqual({ id: "user-1", name: "Sokha" });
  });
});
