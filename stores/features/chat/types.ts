import { IChatPreview } from "@/utils/interfaces/chat.interface";
import { IMessage } from "@/utils/interfaces/chat.interface";
import io from "socket.io-client";

export type SocketInstance = ReturnType<typeof io>;

/* ---------------------------------- States ────────────────────────────────- */
// ── Chat State ────────────────────────────────────────────────────────
export type TChatState = {
  // ── Socket ────
  socket: SocketInstance | null;
  isConnected: boolean;

  // ── Chats ────
  isChatsLoaded: boolean;
  isHistoryLoading: boolean;
  me: any | null;
  activeChat: IChatPreview | null;
  activeChats: IChatPreview[];
  currentMessages: IMessage[];
  unreadCount: number;

  // ── UI ────
  isTyping: Record<string, boolean>;
  onlineUsers: Record<string, boolean>;

  // ── Actions ───
  connect: (user?: any) => void;
  disconnect: () => void;
  setMe: (user: any) => void;
  sendMessage: (
    receiverId: string,
    content: string,
    type?: string,
    replyTo?: IMessage["replyTo"] | null,
    attachment?: {
      url: string;
      type: "image" | "document" | "audio";
      filename: string;
      duration?: number;
      amplitude?: number[];
    } | null,
  ) => boolean;
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
  deleteMessage: (messageId: string, receiverId: string) => void;
  editMessage: (
    messageId: string,
    receiverId: string,
    newContent: string,
  ) => void;
};
