export interface IMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date | string; // NestJS sends ISO strings; parseMessageDate normalises to Date

  // Frontend-only flags
  isMe?: boolean;

  // Persistence flags (synced from backend)
  isRead?: boolean;
  reactions?: Record<string, string>; // userId → emoji map
  isDeleted?: boolean;
  isEdited?: boolean;

  /**
   * Delivery state (frontend-only, not persisted):
   * 'sending' -> optimistic message not acknowledged by server,
   * 'sent' -> server accepted the message,
   * 'seen' -> recipient read the message.
   */
  deliveryStatus?: "sending" | "sent" | "seen";

  /**
   * Reply/quote reference.
   */
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
    isDeleted?: boolean;
  };

  /**
   * Attachment metadata.
   */
  attachment?: string | null;
  attachmentType?: "image" | "document" | "audio";
  attachmentFilename?: string;
  attachmentDuration?: number;
  attachmentAmplitude?: number[];

  /**
   * Message type from backend.
   */
  messageType?: "text" | "image" | "document" | "audio" | "call" | string;
}

export interface IChatPreview {
  id: string; // Partner's User PK (used as the chatId / room name)
  name: string; // Chat display name (partner or group)
  avatar: string;
  preview: string; // Last message text
  time: string; // Last message time (formatted, e.g. "2 min ago")
  unread?: number;
  isGroup?: boolean;
  tag?: string; // e.g. "Applicant" label badge
  isRead?: boolean;
  lastMessageSenderId?: string;
  isOnline?: boolean; // Live online status from socket events
}

export interface IChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
  onReply?: (message: IMessage) => void;
}
