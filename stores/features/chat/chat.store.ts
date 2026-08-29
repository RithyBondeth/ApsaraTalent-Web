import { create } from "zustand";
import { formatSidebarTime, parseMessageDate } from "@/utils/functions/date";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetRecentChatsStore } from "@/stores/apis/chat/get-recent-chats.store";
import { normalizeMediaUrl } from "@/utils/functions/media";
import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import {
  parseChatHistory,
  parseRawChatMessages,
  resolveProfile,
  resolveMessageSnippet,
  resolvePreview,
  sameId,
} from "./utils";
import {
  getSocket,
  setSocket,
  clearPendingDisconnect,
  scheduleDisconnect,
  createSocket,
} from "./socket-manager";
import { registerSocketListeners } from "./socket-listeners";
import type { TChatProfile, TChatState, TRawChatMessage } from "./types";
import { CHAT_MESSAGE_FETCH_LIMIT } from "@/utils/constants/chat.constant";

/* ------------------------------------------- Store ------------------------------------------- */
export const useChatStore = create<TChatState>((set, get) => ({
  // ── Socket ─────────────────────────────────────────────────────────────────────────
  socket: null,
  isConnected: false,

  // ── Chats ──────────────────────────────────────────────────────────────────────────
  isChatsLoaded: false,
  isHistoryLoading: false,
  me: null,
  activeChat: null,
  activeChats: [],
  currentMessages: [],
  unreadCount: 0,

  // ── UI ─────────────────────────────────────────────────────────────────────────────
  isTyping: {},
  onlineUsers: {},

  // ── API Integration ────────────────────────────────────────────────────────────────
  // ── Get Recent Chats ────────────────────────────────────────────────
  getRecentChats: () => {
    const { socket, me } = get();
    if (!socket?.connected || !me) {
      set({ isChatsLoaded: true });
      return;
    }

    const applyRecentChats = (chats: TRawChatMessage[]) => {
      const currentUserId = me.id;
      const seenPartners = new Map<string, IChatPreview>();
      const unreadPerPartner = new Map<string, number>();

      chats.forEach((chat) => {
        const senderId =
          typeof chat.sender === "string"
            ? chat.sender
            : chat.sender?.id || chat.senderId;
        const receiverId =
          typeof chat.receiver === "string"
            ? chat.receiver
            : chat.receiver?.id || chat.receiverId;

        const isSenderMe =
          senderId?.toLowerCase() === currentUserId.toLowerCase();
        const otherUser = isSenderMe ? chat.receiver : chat.sender;
        const partnerId = isSenderMe ? receiverId : senderId;
        if (!partnerId) return;

        if (!isSenderMe && chat.isRead === false) {
          unreadPerPartner.set(
            partnerId,
            (unreadPerPartner.get(partnerId) ?? 0) + 1,
          );
        }

        if (!seenPartners.has(partnerId)) {
          const { name, avatar } = resolveProfile(
            typeof otherUser === "string" ? null : otherUser,
          );
          const isOnline = get().onlineUsers[partnerId] ?? false;
          seenPartners.set(partnerId, {
            id: partnerId,
            name,
            avatar,
            preview: resolvePreview(chat, currentUserId),
            time: formatSidebarTime(
              chat.sentAt || chat.sendAt || chat.createdAt || new Date(),
            ),
            isRead: chat.isRead,
            lastMessageSenderId: senderId,
            isOnline,
            unread: 0,
          });
        }
      });

      for (const [partnerId, count] of unreadPerPartner) {
        const chat = seenPartners.get(partnerId);
        if (chat) seenPartners.set(partnerId, { ...chat, unread: count });
      }

      const builtChats = Array.from(seenPartners.values());
      set({ activeChats: builtChats, isChatsLoaded: true });

      const partnerIds = builtChats.map((c) => c.id);
      if (partnerIds.length > 0) {
        const currentSocket = get().socket;
        if (currentSocket?.connected) {
          currentSocket.emit(
            "getOnlineUsers",
            partnerIds,
            (onlineMap: Record<string, boolean>) => {
              if (!onlineMap || typeof onlineMap !== "object") return;
              set((state) => ({
                onlineUsers: { ...state.onlineUsers, ...onlineMap },
                activeChats: state.activeChats.map((chat) => ({
                  ...chat,
                  isOnline: onlineMap[chat.id] ?? chat.isOnline ?? false,
                })),
                activeChat:
                  state.activeChat &&
                  onlineMap[state.activeChat.id] !== undefined
                    ? {
                        ...state.activeChat,
                        isOnline: onlineMap[state.activeChat.id],
                      }
                    : state.activeChat,
              }));
            },
          );
        }
      }
    };

    const fallbackFetchRecentChats = async () => {
      try {
        const chats = await useGetRecentChatsStore
          .getState()
          .fetchRecentChats();
        if (Array.isArray(chats) && chats.length > 0) {
          applyRecentChats(parseRawChatMessages(chats));
          return;
        }
      } catch (error) {
        console.error("[Chat] REST fallback for recent chats failed:", error);
      }
      if (get().activeChats.length === 0) {
        set({ activeChats: [], isChatsLoaded: true });
      } else {
        set({ isChatsLoaded: true });
      }
    };

    socket
      .timeout(10000)
      .emit("getRecentChats", (error: Error | null, chats: unknown) => {
        const parsedChats = parseRawChatMessages(chats);
        if (error || !Array.isArray(chats)) {
          void fallbackFetchRecentChats();
          return;
        }

        if (parsedChats.length === 0 && get().activeChats.length === 0) {
          void fallbackFetchRecentChats();
          return;
        }

        applyRecentChats(parsedChats);
      });
  },

  // ── Get Chat History ──────────────────────────────────────────────────
  getChatHistory: (userId2: string) => {
    const { socket, me } = get();
    if (!socket?.connected || !me) return;

    if (!get().isHistoryLoading) {
      set({ isHistoryLoading: true, currentMessages: [] });
    }

    socket.emit(
      "getChatHistory",
      { userId2, limit: CHAT_MESSAGE_FETCH_LIMIT },
      (res: unknown) => {
        const parsedResponse = parseChatHistory(res);
        const history = Array.isArray(parsedResponse)
          ? parsedResponse
          : (parsedResponse?.messages ?? []);
        const partnerProfile = Array.isArray(parsedResponse)
          ? null
          : (parsedResponse?.partnerProfile ?? null);

        const currentActiveChat = get().activeChat;
        if (
          currentActiveChat &&
          currentActiveChat.id.toLowerCase() !== userId2.toLowerCase()
        ) {
          set({ isHistoryLoading: false });
          return;
        }

        if (Array.isArray(history)) {
          const meId = get().me?.id || me.id;
          const formatted = history.map((msg) => {
            const senderId =
              typeof msg.sender === "string"
                ? msg.sender
                : msg.sender?.id || msg.senderId;

            const isMine = senderId?.toLowerCase() === meId.toLowerCase();
            const deliveryStatus: IMessage["deliveryStatus"] = isMine
              ? msg.isRead
                ? "seen"
                : "sent"
              : undefined;

            return {
              id: msg.id,
              senderId: senderId ?? "",
              senderName: msg.senderName,
              content: msg.content ?? "",
              timestamp: parseMessageDate(
                msg.sentAt || msg.createdAt || new Date(),
              ),
              isMe: isMine,
              isRead: msg.isRead,
              messageType: msg.messageType,
              reactions: msg.reactions || {},
              isDeleted: msg.isDeleted ?? false,
              isEdited: msg.isEdited ?? false,
              deliveryStatus,
              attachment: normalizeMediaUrl(msg.attachment) ?? null,
              attachmentType: msg.attachmentType ?? undefined,
              attachmentFilename: msg.attachmentFilename ?? undefined,
              attachmentDuration: msg.attachmentDuration ?? undefined,
              attachmentAmplitude: msg.attachmentAmplitude ?? undefined,
              replyTo: undefined as IMessage["replyTo"],
            };
          });

          const messageById = new Map(formatted.map((m) => [m.id, m]));
          const withReplies: IMessage[] = formatted.map((msg, _i) => {
            const rawMsg = history[_i];
            if (!rawMsg.replyToId) return msg;

            const parent = messageById.get(rawMsg.replyToId);
            if (!parent) return msg;

            const preview = parent.isDeleted
              ? "This message was deleted"
              : resolveMessageSnippet(parent) || "Message";
            return {
              ...msg,
              replyTo: {
                id: parent.id,
                content: preview,
                senderName: parent.senderName || (parent.isMe ? "You" : ""),
                isDeleted: parent.isDeleted,
              },
            };
          });

          const latestActiveChat = get().activeChat;
          if (
            latestActiveChat &&
            latestActiveChat.name === "Loading..." &&
            partnerProfile
          ) {
            const { name, avatar } = resolveProfile(partnerProfile);
            set({
              activeChat: { ...latestActiveChat, name, avatar },
              currentMessages: withReplies,
              isHistoryLoading: false,
            });
          } else {
            set({ currentMessages: withReplies, isHistoryLoading: false });
          }
        } else {
          set({ isHistoryLoading: false });
        }
      },
    );
  },

  // ── Get Unread Count ──────────────────────────────────────────────────
  getUnreadCount: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("getUnreadCount", null, (res: unknown) => {
        if (
          typeof res === "object" &&
          res !== null &&
          "unreadCount" in res &&
          typeof res.unreadCount === "number"
        ) {
          set({ unreadCount: res.unreadCount });
        }
      });
    }
  },

  // ── Connect ──────────────────────────────────────────────────────────
  connect: (user?: TChatProfile) => {
    if (user) set({ me: user });

    clearPendingDisconnect();

    let socket = getSocket();

    if (socket?.connected) {
      set({ isConnected: true, socket });
      get().getRecentChats();
      get().getUnreadCount();
      return;
    }

    if (socket && !socket.connected && !socket.disconnected) {
      set({ socket });
      return;
    }

    if (socket) {
      socket.removeAllListeners();
      setSocket(null);
    }

    socket = createSocket();
    setSocket(socket);

    socket.on("connect", () => {
      set({ isConnected: true, socket });
      get().getRecentChats();
      get().getUnreadCount();
      import("../call/call.store")
        .then(({ useCallStore }) => {
          if (socket) useCallStore.getState().initCallSignaling(socket);
        })
        .catch((err) => {
          console.warn("[Chat] Failed to init call signaling:", err);
        });
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[Socket] Connection error:", err.message);
      set({ isConnected: false });
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("[Socket] Disconnected:", reason);
      set({ isConnected: false });
    });

    if (socket) registerSocketListeners(socket, set, get);

    set({ socket });
  },

  // ── Disconnect ──────────────────────────────────────────────────────────
  disconnect: () => {
    scheduleDisconnect(() => {
      const socketToClose = getSocket();
      setSocket(null);
      if (socketToClose) socketToClose.disconnect();
      set({
        socket: null,
        isConnected: false,
        isChatsLoaded: false,
        isHistoryLoading: false,
        activeChats: [],
        currentMessages: [],
        onlineUsers: {},
      });
    });
  },

  // ── Set Me ──────────────────────────────────────────────────────────────
  setMe: (user: TChatProfile) => set({ me: user }),

  // ── Send Message ────────────────────────────────────────────────────────
  sendMessage: (receiverId, content, type = "text", replyTo, attachment) => {
    const { socket, currentMessages, me } = get();
    if (!socket?.connected) return false;

    const resolvedType = attachment?.type ?? type;
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMsg: IMessage = {
      id: tempId,
      senderId: me?.id || "me",
      content,
      timestamp: new Date(),
      isMe: true,
      isRead: false,
      messageType: resolvedType,
      deliveryStatus: "sending",
      replyTo: replyTo ?? undefined,
      attachment: normalizeMediaUrl(attachment?.url) ?? null,
      attachmentType: attachment?.type ?? undefined,
      attachmentFilename: attachment?.filename ?? undefined,
      attachmentDuration: attachment?.duration ?? undefined,
      attachmentAmplitude: attachment?.amplitude ?? undefined,
    };

    set({ currentMessages: [...currentMessages, optimisticMsg] });

    socket.emit(
      "sendMessage",
      {
        receiverId,
        content,
        type: resolvedType,
        replyToId: replyTo?.id ?? null,
        attachment: normalizeMediaUrl(attachment?.url) ?? null,
        attachmentFilename: attachment?.filename ?? null,
        attachmentDuration: attachment?.duration ?? null,
        attachmentAmplitude: attachment?.amplitude ?? null,
      },
      (response: unknown) => {
        const realId =
          typeof response === "object" &&
          response !== null &&
          "message" in response &&
          typeof response.message === "object" &&
          response.message !== null &&
          "id" in response.message &&
          typeof response.message.id === "string"
            ? response.message.id
            : null;
        if (realId) {
          set((state) => {
            const alreadyExists = state.currentMessages.some(
              (m) => m.id === realId,
            );
            if (alreadyExists) {
              return {
                currentMessages: state.currentMessages.filter(
                  (msg) => msg.id !== tempId,
                ),
              };
            }
            return {
              currentMessages: state.currentMessages.map((msg) =>
                msg.id === tempId
                  ? { ...msg, id: realId, deliveryStatus: "sent" as const }
                  : msg,
              ),
            };
          });
        }
      },
    );

    return true;
  },

  // ── Set Active Chat ──────────────────────────────────────────────────────
  setActiveChat: (chat) => {
    const prevChat = get().activeChat;
    const isSameChat =
      chat && prevChat && prevChat.id.toLowerCase() === chat.id.toLowerCase();
    const isNewChat = chat && !isSameChat;
    const needsRefetch = isSameChat && get().currentMessages.length === 0;
    const alreadyLoadingThisChat = isSameChat && get().isHistoryLoading;

    if (!chat) {
      set({ activeChat: null, currentMessages: [], isHistoryLoading: false });
      return;
    }

    if (isNewChat || (needsRefetch && !alreadyLoadingThisChat)) {
      set({ activeChat: chat, isHistoryLoading: true, currentMessages: [] });
      get().getChatHistory(chat.id);
    } else {
      set({ activeChat: chat });
    }

    const { socket } = get();
    if (socket?.connected) {
      socket.emit(
        "getOnlineUsers",
        [chat.id],
        (onlineMap: Record<string, boolean>) => {
          if (!onlineMap || typeof onlineMap !== "object") return;
          const isOnline = onlineMap[chat.id] ?? false;
          set((state) => ({
            onlineUsers: { ...state.onlineUsers, [chat.id]: isOnline },
            activeChat:
              state.activeChat?.id === chat.id
                ? { ...state.activeChat, isOnline }
                : state.activeChat,
            activeChats: state.activeChats.map((c) =>
              c.id === chat.id ? { ...c, isOnline } : c,
            ),
          }));
        },
      );
    }
  },

  // ── Mark As Read ────────────────────────────────────────────────────────
  markAsRead: (messageId, senderId) => {
    const { socket, activeChat } = get();
    if (socket?.connected) {
      socket.emit("markAsRead", { messageId, senderId });
      if (activeChat) {
        set((state) => ({
          activeChats: state.activeChats.map((c) =>
            sameId(c.id, activeChat.id) ? { ...c, isRead: true, unread: 0 } : c,
          ),
          currentMessages: state.currentMessages.map((m) =>
            !m.isMe && !m.isRead ? { ...m, isRead: true } : m,
          ),
        }));
      }
      /*
        Sum the per-partner unread counters directly. The previous version
        gated each row on its LATEST message (`isRead === false` and not sent
        by me), which dropped a partner's unread messages the moment I replied
        from another device — the newest message was then mine, so the whole
        row stopped counting and the badge fell below the truth. `unread`
        already tracks every unread message from that partner.
      */
      const newUnread = get().activeChats.reduce(
        (sum, c) => sum + (c.unread ?? 0),
        0,
      );
      set({ unreadCount: newUnread });
      useNotificationStore.getState().markReadByChatMessageId(messageId);
    }
  },

  // ── React To Message ────────────────────────────────────────────────────
  reactToMessage: (messageId, receiverId, emoji) => {
    const { socket } = get();
    if (socket?.connected)
      socket.emit("react", { messageId, receiverId, emoji });
  },

  // ── Set Typing ──────────────────────────────────────────────────────────
  setTyping: (receiverId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) socket.emit("typing", { receiverId, isTyping });
  },

  // ── Delete Message ───────────────────────────────────────────────────────
  deleteMessage: (messageId, receiverId) => {
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;
    set({
      currentMessages: currentMessages.map((m) =>
        m.id === messageId ? { ...m, isDeleted: true } : m,
      ),
    });
    socket.emit("deleteMessage", { messageId, receiverId });
  },

  // ── Edit Message ─────────────────────────────────────────────────────────
  editMessage: (messageId, receiverId, newContent) => {
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;
    set({
      currentMessages: currentMessages.map((m) =>
        m.id === messageId ? { ...m, content: newContent, isEdited: true } : m,
      ),
    });
    socket.emit("editMessage", { messageId, receiverId, newContent });
  },

  // ── Remove Chat By Partner ID ────────────────────────────────────────────
  removeChatByPartnerId: (partnerId: string) => {
    const { activeChat, activeChats } = get();

    const filtered = activeChats.filter(
      (c) => c.id.toLowerCase() !== partnerId.toLowerCase(),
    );

    // If the currently open chat is with this partner, close it too
    const isActiveChatAffected =
      activeChat?.id.toLowerCase() === partnerId.toLowerCase();

    set({
      activeChats: filtered,
      ...(isActiveChatAffected && {
        activeChat: null,
        currentMessages: [],
        isHistoryLoading: false,
      }),
    });
  },
}));
