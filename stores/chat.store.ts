/* eslint-disable @typescript-eslint/no-explicit-any */
import io from "socket.io-client";
import { create } from "zustand";
import { IChatPreview, IMessage } from "@/components/message/props";

type SocketInstance = ReturnType<typeof io>;

interface ChatState {
  socket: SocketInstance | null;
  isConnected: boolean;
  activeChats: IChatPreview[];
  currentMessages: IMessage[];
  unreadCount: number;
  isTyping: Record<string, boolean>; // ReceiverId -> isTyping

  // Actions
  connect: () => void;
  disconnect: () => void;
  sendMessage: (receiverId: string, content: string, type?: string) => void;
  getRecentChats: () => void;
  getChatHistory: (userId2: string) => void;
  markAsRead: (messageId: string) => void;
  setTyping: (receiverId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  activeChats: [],
  currentMessages: [],
  unreadCount: 0,
  isTyping: {},

  connect: () => {
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
      // Fetch initial data upon connection
      get().getRecentChats();
      socket.emit("getUnreadCount");
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    // Listeners for backend events
    socket.on("newMessage", (message: any) => {
      // Convert backend ISODate strings to JS Date objects
      const formattedMsg: IMessage = {
        id: message.id || Math.random().toString(36).substring(7),
        senderId: message.senderId,
        senderName: message.sender?.name || message.senderId,
        content: message.content,
        timestamp: new Date(message.timestamp),
        isRead: message.isRead,
        isMe: false, // Inbound message
      };

      set((state) => ({
        currentMessages: [...state.currentMessages, formattedMsg],
      }));
      get().getRecentChats(); // Refresh sidebar order
    });

    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      set((state) => ({
        isTyping: { ...state.isTyping, [data.userId]: data.isTyping },
      }));
    });

    socket.on("userStatus", (data: { userId: string; status: string }) => {
      // Optional: Update online status indicator in activeChats
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
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
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;

    // Optimistically add the message to the local state
    const optimisticMsg: IMessage = {
      id: Math.random().toString(36).substring(7),
      senderId: "me", // Handled by backend, but we know it's us
      content,
      timestamp: new Date(),
      isMe: true,
      isRead: false,
    };

    set({ currentMessages: [...currentMessages, optimisticMsg] });

    // Emit to server
    socket.emit("sendMessage", { receiverId, content, type });
  },

  getRecentChats: () => {
    const { socket } = get();
    if (!socket?.connected) return;

    socket.emit("getRecentChats", null, (response: unknown) => {
      if (response && Array.isArray(response)) {
        // Handled in page
      }
    });
  },

  getChatHistory: (userId2: string) => {
    const { socket } = get();
    if (!socket?.connected) return;

    socket.emit(
      "getChatHistory",
      { userId2, limit: 100, offset: 0 },
      (response: unknown) => {
        if (Array.isArray(response)) {
          // Handled in page
        }
      },
    );
  },

  markAsRead: (messageId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("markAsRead", messageId);
    }
  },

  setTyping: (receiverId: string, isTyping: boolean) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("typing", { receiverId, isTyping });
    }
  },
}));
