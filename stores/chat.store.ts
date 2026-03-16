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
  me: any | null; // Tracks current user profile
  activeChat: IChatPreview | null; // Tracks current conversation
  activeChats: IChatPreview[]; // List for sidebar
  currentMessages: IMessage[];
  unreadCount: number;
  isTyping: Record<string, boolean>; // ReceiverId -> isTyping

  // Actions
  connect: (user?: any) => void;
  disconnect: () => void;
  setMe: (user: any) => void;
  sendMessage: (receiverId: string, content: string, type?: string) => void;
  getRecentChats: () => void;
  getChatHistory: (userId2: string) => void;
  getUnreadCount: () => void; // Standardized unread fetch
  markAsRead: (messageId: string, senderId: string) => void;
  reactToMessage: (
    messageId: string,
    receiverId: string,
    emoji: string | null,
  ) => void;
  setTyping: (receiverId: string, isTyping: boolean) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  me: null,
  activeChat: null,
  activeChats: [],
  currentMessages: [],
  unreadCount: 0,
  isTyping: {},

  setMe: (user: any) => set({ me: user }),

  connect: (user?: any) => {
    if (user) set({ me: user });
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
      set({ isConnected: true, socket });
      // Identify this connection for rooms and fetch initial lists
      get().getRecentChats();
      get().getUnreadCount();
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    // Listeners for backend events
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

        // 2. Optimistic match (replaces temp message with real one from socket)
        // Check if there's an optimistic message (senderId is user's ID or "me") with matching content
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
            // Replace the optimistic message with the real one
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
            };
            set({ currentMessages: updatedMessages });
            return;
          }
        }

        // 3. Just add if no match found
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
        };

        set({ currentMessages: [...currentMessages, formattedMsg] });
      }
    });

    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      set((state) => ({
        isTyping: { ...state.isTyping, [data.userId]: data.isTyping },
      }));
    });

    socket.on(
      "messageReaction",
      (data: { messageId: string; reactions: Record<string, string> }) => {
        const { currentMessages } = get();
        // Only update if the message is in the CURRENTLY visible messages
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

    socket.on("messageRead", (data: { messageId: string }) => {
      const { currentMessages } = get();
      const exists = currentMessages.some((m) => m.id === data.messageId);
      if (exists) {
        set({
          currentMessages: currentMessages.map((m) =>
            m.id === data.messageId ? { ...m, isRead: true } : m,
          ),
        });
      }
    });

    socket.on("userStatus", (data: { userId: string; status: string }) => {
      // Optional: Update online status indicator in activeChats
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
        activeChats: [],
        currentMessages: [],
      });
    }
  },

  sendMessage: (receiverId: string, content: string, type = "text") => {
    const { socket, currentMessages, me } = get();
    if (!socket?.connected) return;

    // Optimistically add the message to the local state
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMsg: IMessage = {
      id: tempId,
      senderId: me?.id || "me",
      content,
      timestamp: new Date(),
      isMe: true,
      isRead: false,
    };

    set({ currentMessages: [...currentMessages, optimisticMsg] });

    // Emit to server with callback to replace temporary ID with real DB ID
    socket.emit(
      "sendMessage",
      { receiverId, content, type },
      (response: any) => {
        const realId = response?.message?.id;
        if (realId) {
          set((state) => {
            // Check if this real ID already arrived via socket (Option B race)
            const alreadyExists = state.currentMessages.some(
              (m) => m.id === realId,
            );

            if (alreadyExists) {
              // Remove the temporary message if the real one is already there
              return {
                currentMessages: state.currentMessages.filter(
                  (msg) => msg.id !== tempId,
                ),
              };
            }

            // Otherwise update tempId -> realId as usual
            return {
              currentMessages: state.currentMessages.map((msg) =>
                msg.id === tempId ? { ...msg, id: realId } : msg,
              ),
            };
          });
        }
      },
    );
  },

  getRecentChats: () => {
    const { socket, me } = get();
    if (socket?.connected && me) {
      socket.emit("getRecentChats", null, (chats: any[]) => {
        if (!Array.isArray(chats)) return;

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

          // Fallback to raw ID strings if relations failed to load
          const partnerId = isSenderMe ? receiverId : senderId;

          if (partnerId && !seenPartners.has(partnerId)) {
            const { name, avatar } = resolveProfile(otherUser);
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
            });
          }
        });

        set({ activeChats: Array.from(seenPartners.values()) });
      });
    }
  },

  getChatHistory: (userId2: string) => {
    const { socket, me, activeChat } = get();
    if (!socket?.connected || !me) return;
    socket.emit(
      "getChatHistory",
      { userId2, limit: 100 },
      (
        res:
          | { messages: any[]; partnerId: string; partnerProfile: any }
          | any[],
      ) => {
        // Handle both new {messages, partnerId, partnerProfile} and old [...] formats
        const history = Array.isArray(res) ? res : res?.messages || [];
        const resolvedPartnerId = Array.isArray(res) ? null : res?.partnerId;
        const partnerProfile = Array.isArray(res) ? null : res?.partnerProfile;

        if (Array.isArray(history)) {
          const formatted = history.map((msg) => {
            const senderId =
              typeof msg.sender === "string"
                ? msg.sender
                : msg.sender?.id || msg.senderId;

            return {
              id: msg.id,
              senderId,
              content: msg.content,
              timestamp: parseMessageDate(msg.sentAt || msg.createdAt),
              isMe: senderId?.toLowerCase() === me.id.toLowerCase(),
              isRead: msg.isRead,
              reactions: msg.reactions || {},
            };
          });

          // Normalization & Profile Resolution
          if (activeChat) {
            const isDifferentId =
              resolvedPartnerId && activeChat.id !== resolvedPartnerId;
            const isLoading = activeChat.name === "Loading...";

            if (isDifferentId || isLoading) {
              const { name, avatar } = resolveProfile(partnerProfile);
              set({
                activeChat: {
                  ...activeChat,
                  id: resolvedPartnerId || activeChat.id,
                  name: isLoading ? name : activeChat.name,
                  avatar: isLoading ? avatar : activeChat.avatar,
                },
                currentMessages: formatted,
              });
            } else {
              set({ currentMessages: formatted });
            }
          } else {
            set({ currentMessages: formatted });
          }
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
    set({ activeChat: chat });
    if (chat) get().getChatHistory(chat.id);
    else set({ currentMessages: [] });
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
}));
