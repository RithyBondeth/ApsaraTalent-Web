import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import io from "socket.io-client";

export type SocketInstance = ReturnType<typeof io>;

export type TChatProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  employee?: {
    firstname?: string | null;
    lastname?: string | null;
    username?: string | null;
    avatar?: string | null;
  } | null;
  company?: {
    name?: string | null;
    avatar?: string | null;
  } | null;
};

export type TRawChatMessage = {
  id: string;
  sender?: string | TChatProfile | null;
  receiver?: string | TChatProfile | null;
  senderId?: string;
  receiverId?: string;
  senderName?: string;
  content?: string | null;
  sentAt?: string | Date;
  sendAt?: string | Date;
  createdAt?: string | Date;
  timestamp?: string | Date;
  isRead?: boolean;
  messageType?: IMessage["messageType"];
  reactions?: Record<string, string>;
  isDeleted?: boolean;
  isEdited?: boolean;
  attachment?: string | null;
  attachmentType?: IMessage["attachmentType"];
  attachmentFilename?: string;
  attachmentDuration?: number;
  attachmentAmplitude?: number[];
  replyToId?: string | null;
  isMe?: boolean;
};

export type TChatHistoryResponse = {
  messages: TRawChatMessage[];
  partnerId: string;
  partnerProfile: TChatProfile | null;
};

/* ---------------------------------- States --------------------------------- */
// ── Chat State ────────────────────────────────────────────────────────
export type TChatState = {
  // ── Socket ────
  socket: SocketInstance | null;
  isConnected: boolean;

  // ── Chats ────
  isChatsLoaded: boolean;
  isHistoryLoading: boolean;
  me: TChatProfile | null;
  activeChat: IChatPreview | null;
  activeChats: IChatPreview[];
  currentMessages: IMessage[];
  unreadCount: number;

  // ── UI ────
  isTyping: Record<string, boolean>;
  onlineUsers: Record<string, boolean>;

  // ── Actions ───
  connect: (user?: TChatProfile) => void;
  disconnect: () => void;
  setMe: (user: TChatProfile) => void;
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
  /** Remove a chat from the sidebar and clear it if currently open. Called after unmatch. */
  removeChatByPartnerId: (partnerId: string) => void;
};
