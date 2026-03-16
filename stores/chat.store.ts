/* eslint-disable @typescript-eslint/no-explicit-any */
import io from "socket.io-client";
import { create } from "zustand";
import { IChatPreview, IMessage } from "@/components/message/props";
import { formatSidebarTime, parseMessageDate } from "@/utils/date";

type SocketInstance = ReturnType<typeof io>;

// Helper to resolve display name and avatar from user object
const resolveProfile = (user: any) => {
  if (!user) return { name: "Unknown", avatar: "/avatars/default.png" };
  const emp = user.employee;
  const co = user.company;

  const name = emp
    ? [emp.firstname, emp.lastname].filter(Boolean).join(" ") ||
      emp.username ||
      user.email
    : co?.name || user.email;

  const avatar = emp?.avatar || co?.avatar || "/avatars/default.png";
  return { name, avatar };
};

interface ChatState {
  socket: SocketInstance | null;
  isConnected: boolean;
  isChatsLoaded: boolean; // true once getRecentChats has returned (even if empty list)
  isHistoryLoading: boolean; // true while getChatHistory is in-flight
  me: any | null; // Tracks current user profile
  activeChat: IChatPreview | null; // Tracks current conversation
  activeChats: IChatPreview[]; // List for sidebar
  currentMessages: IMessage[];
  unreadCount: number;
  isTyping: Record<string, boolean>; // ReceiverId -> isTyping

  /**
   * Live online-status map: userId → true/false.
   * Populated by 'userStatus' socket events from the server.
   * Components read this to show green / grey dots without individual subscriptions.
   */
  onlineUsers: Record<string, boolean>;

  // Actions
  connect: (user?: any) => void;
  disconnect: () => void;
  setMe: (user: any) => void;
  sendMessage: (
    receiverId: string,
    content: string,
    type?: string,
    replyTo?: IMessage["replyTo"] | null,
  ) => void;
  getRecentChats: () => void;
  getChatHistory: (userId2: string) => void;
  getUnreadCount: () => void;
  markAsRead: (messageId: string, senderId: string) => void;
  reactToMessage: (
    messageId: string,
    receiverId: string,
    emoji: string | null,
  ) => void;
  setTyping: (receiverId: string, isTyping: boolean) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  /**
   * Soft-delete a message the current user sent.
   * Emits 'deleteMessage' to the socket; the server broadcasts 'messageDeleted'
   * back to both participants and the store listener updates the local list.
   */
  deleteMessage: (messageId: string, receiverId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
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
  onlineUsers: {}, // Starts empty; filled as users connect/disconnect

  setMe: (user: any) => set({ me: user }),

  connect: (user?: any) => {
    // Update `me` before anything else so callbacks have user context
    if (user) set({ me: user });

    // Don't create a duplicate socket
    if (get().socket?.connected || get().isConnected) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:3000";

    // auth-token is httpOnly — JS cannot read it via document.cookie.
    // withCredentials: true sends ALL cookies (including httpOnly) in the
    // WebSocket upgrade request, and the gateway reads it from the Cookie header.
    const socket: SocketInstance = io(`${socketUrl}/chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    } as any);

    socket.on("connect", () => {
      // Set socket AND connected in one atomic update so getRecentChats
      // doesn't run while socket is still null in state
      set({ isConnected: true, socket });
      // Fetch sidebar + unread right after connection is stable
      get().getRecentChats();
      get().getUnreadCount();
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[Socket] Connection error:", err.message);
      set({ isConnected: false });
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("[Socket] Disconnected:", reason);
      set({ isConnected: false });
    });

    // ── Incoming new message ────────────────────────────────────────────────
    socket.on("newMessage", (message: any) => {
      const {
        activeChat,
        currentMessages,
        getRecentChats,
        getUnreadCount,
        me,
      } = get();

      // Always update sidebar/unread regardless of active chat
      getRecentChats();
      getUnreadCount();

      // Only add to current message list if it belongs to the ACTIVE chat
      const isForActiveChat =
        activeChat &&
        (message.senderId === activeChat.id ||
          message.receiverId === activeChat.id);

      if (isForActiveChat) {
        // 1. Exact ID check (prevents duplicates from synced tabs or resolved callbacks)
        const existsById = currentMessages.some((m) => m.id === message.id);
        if (existsById) return;

        // 2. Optimistic match — replace the temp message with the real one from server.
        // Optimistic IDs are short random strings (< 10 chars); real IDs are UUIDs.
        const isFromMe =
          message.senderId === me?.id || message.senderId === "me";

        if (isFromMe) {
          const optimisticIndex = currentMessages.findIndex(
            (m) =>
              (m.senderId === me?.id || m.senderId === "me") &&
              m.content === message.content &&
              m.id.length < 10, // Optimistic IDs are short (random36/7)
          );

          if (optimisticIndex !== -1) {
            // Swap optimistic → real message.
            // deliveryStatus upgrades: 'sending' → 'sent' once the server echoes back
            const updatedMessages = [...currentMessages];
            updatedMessages[optimisticIndex] = {
              id: message.id,
              senderId: message.senderId,
              senderName: message.sender?.name || message.senderId,
              content: message.content,
              timestamp: parseMessageDate(message.timestamp || message.sentAt),
              isRead: message.isRead,
              isMe: true,
              reactions: message.reactions || {},
              isDeleted: message.isDeleted ?? false,
              replyToId: message.replyToId ?? null,
              deliveryStatus: "sent", // Server confirmed → upgrade from 'sending'
            };
            set({ currentMessages: updatedMessages });
            return;
          }
        }

        // 3. Add fresh incoming message
        const formattedMsg: IMessage = {
          id: message.id || Math.random().toString(36).substring(7),
          senderId: message.senderId,
          senderName: message.sender?.name || message.senderId,
          content: message.content,
          timestamp: parseMessageDate(message.timestamp || message.sentAt),
          isRead: message.isRead,
          isMe:
            message.isMe ||
            message.senderId === me?.id ||
            message.senderId === "me",
          reactions: message.reactions || {},
          isDeleted: message.isDeleted ?? false,
          replyToId: message.replyToId ?? null,
          // New incoming message from the partner has no delivery state
          // (delivery state is only relevant for outgoing messages)
          deliveryStatus: undefined,
        };

        set({ currentMessages: [...currentMessages, formattedMsg] });
      }
    });

    // ── Typing indicator ────────────────────────────────────────────────────
    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      set((state) => ({
        isTyping: { ...state.isTyping, [data.userId]: data.isTyping },
      }));
    });

    // ── Reaction update ─────────────────────────────────────────────────────
    socket.on(
      "messageReaction",
      (data: { messageId: string; reactions: Record<string, string> }) => {
        const { currentMessages } = get();
        const exists = currentMessages.some((m) => m.id === data.messageId);
        if (exists) {
          set({
            currentMessages: currentMessages.map((m) =>
              m.id === data.messageId ? { ...m, reactions: data.reactions } : m,
            ),
          });
        }
      },
    );

    // ── Message read receipt ────────────────────────────────────────────────
    // When the recipient opens a chat and reads the last message, the server
    // fires 'messageRead' back to the sender. We upgrade deliveryStatus → 'seen'
    // and set isRead=true on the local message so the ✓✓ turns blue.
    socket.on("messageRead", (data: { messageId: string }) => {
      const { currentMessages } = get();
      const exists = currentMessages.some((m) => m.id === data.messageId);
      if (exists) {
        set({
          currentMessages: currentMessages.map((m) =>
            m.id === data.messageId
              ? { ...m, isRead: true, deliveryStatus: "seen" }
              : m,
          ),
        });
      }
    });

    // ── Online / offline status ─────────────────────────────────────────────
    // Server emits 'userStatus' on every connect and disconnect.
    // We maintain a simple userId → boolean map (onlineUsers).
    // Both the sidebar and the chat header read this map to show the green dot.
    socket.on("userStatus", (data: { userId: string; status: string }) => {
      const isOnline = data.status === "online";

      // Update the onlineUsers map so any component can reactively show the dot
      set((state) => ({
        onlineUsers: { ...state.onlineUsers, [data.userId]: isOnline },
        // Also update isOnline on the matching IChatPreview so the sidebar dot
        // reflects the correct state without a separate selector
        activeChats: state.activeChats.map((chat) =>
          chat.id === data.userId ? { ...chat, isOnline } : chat,
        ),
        // Update activeChat header too if we're currently in that conversation
        activeChat:
          state.activeChat?.id === data.userId
            ? { ...state.activeChat, isOnline }
            : state.activeChat,
      }));
    });

    // ── Soft-delete broadcast ───────────────────────────────────────────────
    // Server broadcasts 'messageDeleted' to both sender and receiver.
    // We mark the local message as isDeleted=true so the tombstone renders
    // without needing to re-fetch the entire history.
    socket.on("messageDeleted", (data: { messageId: string }) => {
      const { currentMessages } = get();
      const exists = currentMessages.some((m) => m.id === data.messageId);
      if (exists) {
        set({
          currentMessages: currentMessages.map((m) =>
            m.id === data.messageId ? { ...m, isDeleted: true } : m,
          ),
        });
      }
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error?.message || error || "Unknown");
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        isChatsLoaded: false,
        isHistoryLoading: false,
        activeChats: [],
        currentMessages: [],
        onlineUsers: {}, // Reset online map on disconnect
      });
    }
  },

  /**
   * Send a message with optional reply-to context.
   *
   * Flow:
   *  1. An optimistic message is inserted immediately into currentMessages
   *     with deliveryStatus='sending' so the user sees instant feedback.
   *  2. The socket emits 'sendMessage'. The server callback returns the real DB ID.
   *  3. We swap the temp ID for the real ID and upgrade deliveryStatus → 'sent'.
   *     (If the server already broadcast 'newMessage' first, the optimistic
   *      entry is removed to avoid a duplicate.)
   */
  sendMessage: (
    receiverId: string,
    content: string,
    type = "text",
    replyTo?: IMessage["replyTo"] | null,
  ) => {
    const { socket, currentMessages, me } = get();
    if (!socket?.connected) return;

    // Build optimistic message — shown instantly before the server responds
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMsg: IMessage = {
      id: tempId,
      senderId: me?.id || "me",
      content,
      timestamp: new Date(),
      isMe: true,
      isRead: false,
      deliveryStatus: "sending", // Clock icon — waiting for server ack
      replyTo: replyTo ?? undefined, // Inline quote block (if replying)
    };

    set({ currentMessages: [...currentMessages, optimisticMsg] });

    // Emit to server; replyToId carries the parent UUID so the DB stores the link
    socket.emit(
      "sendMessage",
      {
        receiverId,
        content,
        type,
        replyToId: replyTo?.id ?? null,
      },
      (response: any) => {
        const realId = response?.message?.id;
        if (realId) {
          set((state) => {
            // If the socket broadcast arrived before this ack (race condition),
            // the real message is already in the list → just remove the temp entry
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

            // Normal path: swap tempId → realId and upgrade delivery status
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
  },

  getRecentChats: () => {
    const { socket, me } = get();
    if (!socket?.connected || !me) {
      // Mark chats as loaded even if we can't fetch so the UI doesn't block
      set({ isChatsLoaded: true });
      return;
    }

    socket.emit("getRecentChats", null, (chats: any[]) => {
      if (!Array.isArray(chats)) {
        set({ isChatsLoaded: true });
        return;
      }

      const currentUserId = me.id;
      const seenPartners = new Map<string, IChatPreview>();

      chats.forEach((chat: any) => {
        // Robust ID resolution: handle both nested objects and scalar IDs
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

        if (partnerId && !seenPartners.has(partnerId)) {
          const { name, avatar } = resolveProfile(otherUser);
          // Carry over existing isOnline state from the onlineUsers map
          const isOnline = get().onlineUsers[partnerId] ?? false;
          seenPartners.set(partnerId, {
            id: partnerId,
            name,
            avatar,
            preview: chat.content,
            time: formatSidebarTime(
              chat.sentAt || chat.sendAt || chat.createdAt || Date.now(),
            ),
            isRead: chat.isRead,
            lastMessageSenderId: senderId,
            isOnline, // Preserve live dot from onlineUsers map
          });
        }
      });

      set({
        activeChats: Array.from(seenPartners.values()),
        isChatsLoaded: true,
      });
    });
  },

  getChatHistory: (userId2: string) => {
    const { socket, me } = get();
    if (!socket?.connected || !me) return;

    // Signal loading so the message area shows a spinner instead of blank
    set({ isHistoryLoading: true, currentMessages: [] });

    socket.emit(
      "getChatHistory",
      { userId2, limit: 50 },
      (
        res:
          | { messages: any[]; partnerId: string; partnerProfile: any }
          | any[],
      ) => {
        const history = Array.isArray(res) ? res : res?.messages || [];
        const resolvedPartnerId = Array.isArray(res) ? null : res?.partnerId;
        const partnerProfile = Array.isArray(res) ? null : res?.partnerProfile;

        // Race condition guard: if user switched chats while request was in-flight, discard
        const currentActiveChat = get().activeChat;
        if (
          currentActiveChat &&
          currentActiveChat.id.toLowerCase() !== userId2.toLowerCase() &&
          resolvedPartnerId &&
          currentActiveChat.id.toLowerCase() !== resolvedPartnerId.toLowerCase()
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

            // For history messages: derive deliveryStatus from isRead
            // We don't have 'sending' state in history — all stored messages are 'sent'.
            // If the message is mine and was read, show 'seen'; otherwise 'sent'.
            const isMine = senderId?.toLowerCase() === meId.toLowerCase();
            const deliveryStatus: IMessage["deliveryStatus"] = isMine
              ? msg.isRead
                ? "seen"
                : "sent"
              : undefined; // Partner's messages don't show delivery state on our side

            return {
              id: msg.id,
              senderId,
              senderName: msg.senderName,
              content: msg.content,
              timestamp: parseMessageDate(msg.sentAt || msg.createdAt),
              isMe: isMine,
              isRead: msg.isRead,
              reactions: msg.reactions || {},
              isDeleted: msg.isDeleted ?? false,
              deliveryStatus,
              // replyTo is built below if replyToId is present and resolvable from history
              // For now we attach a minimal placeholder; a future enhancement could
              // resolve the full preview by looking up msg.replyToId in the history array.
              replyTo: undefined as IMessage["replyTo"],
            };
          });

          // Second pass: resolve replyTo previews from within the loaded history batch.
          // If the parent message is not in this page of history, replyTo stays undefined.
          const messageById = new Map(formatted.map((m) => [m.id, m]));
          const withReplies: IMessage[] = formatted.map((msg, _i) => {
            const rawMsg = history[_i]; // raw from server
            if (!rawMsg.replyToId) return msg;

            const parent = messageById.get(rawMsg.replyToId);
            if (!parent) return msg; // Parent not in this page — skip

            return {
              ...msg,
              replyTo: {
                id: parent.id,
                content: parent.isDeleted
                  ? "This message was deleted"
                  : parent.content,
                senderName: parent.senderName || (parent.isMe ? "You" : ""),
                isDeleted: parent.isDeleted,
              },
            };
          });

          // Update chat header profile if it was in skeleton "Loading..." state
          const latestActiveChat = get().activeChat;
          const isLoadingName = latestActiveChat?.name === "Loading...";

          if (latestActiveChat && isLoadingName && partnerProfile) {
            const { name, avatar } = resolveProfile(partnerProfile);
            set({
              activeChat: {
                ...latestActiveChat,
                name,
                avatar,
              },
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

  getUnreadCount: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("getUnreadCount", null, (res: any) => {
        if (typeof res?.unreadCount === "number") {
          set({ unreadCount: res.unreadCount });
        }
      });
    }
  },

  setActiveChat: (chat: IChatPreview | null) => {
    const prevChat = get().activeChat;
    // Only fetch history when the chat actually changes to a different partner
    const isNewChat =
      chat &&
      (!prevChat || prevChat.id.toLowerCase() !== chat.id.toLowerCase());

    set({ activeChat: chat });

    if (isNewChat) {
      get().getChatHistory(chat!.id);
    } else if (!chat) {
      set({ currentMessages: [], isHistoryLoading: false });
    }
  },

  markAsRead: (messageId: string, senderId: string) => {
    const { socket } = get();
    if (socket?.connected) socket.emit("markAsRead", { messageId, senderId });
  },

  reactToMessage: (
    messageId: string,
    receiverId: string,
    emoji: string | null,
  ) => {
    const { socket } = get();
    if (socket?.connected)
      socket.emit("react", { messageId, receiverId, emoji });
  },

  setTyping: (receiverId: string, isTyping: boolean) => {
    const { socket } = get();
    if (socket?.connected) socket.emit("typing", { receiverId, isTyping });
  },

  /**
   * Soft-delete a message.
   *
   * The store does an optimistic update immediately:
   *  1. The local message is marked isDeleted=true so the tombstone appears instantly.
   *  2. The socket emits 'deleteMessage' to the server.
   *  3. The server broadcasts 'messageDeleted' back to both participants.
   *     The socket listener in connect() handles the broadcast (idempotent update).
   *
   * If the server rejects the delete (e.g. not the sender), the socket will emit
   * an 'error' event and the optimistic update stays visible — in a future iteration
   * we could rollback by re-fetching history on error.
   */
  deleteMessage: (messageId: string, receiverId: string) => {
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;

    // Optimistic update: show tombstone immediately
    set({
      currentMessages: currentMessages.map((m) =>
        m.id === messageId ? { ...m, isDeleted: true } : m,
      ),
    });

    // Tell the server to soft-delete and broadcast to both participants
    socket.emit("deleteMessage", { messageId, receiverId });
  },
}));
