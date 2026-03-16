// ─── Message & Chat type definitions ───────────────────────────────────────
//
// These types are shared by all chat components (bubble, sidebar, header, input).
// Keep them in sync with the backend IChatMessage interface.

export interface IMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date | string; // NestJS sends ISO strings; parseMessageDate normalises to Date

  // ── Frontend-only flags ───────────────────────────────────────────────────
  isMe?: boolean; // true when this message was sent by the current user

  // ── Persistence flags (synced from backend) ───────────────────────────────
  isRead?: boolean; // true once the receiver has opened the message
  reactions?: Record<string, string>; // userId → emoji map

  /**
   * Soft-delete flag.
   * When true the bubble renders a tombstone ("This message was deleted") instead
   * of the original content. The row is kept in the DB for audit/reply refs.
   */
  isDeleted?: boolean;

  /**
   * Delivery state (frontend-only, not persisted).
   *
   * State machine:
   *  'sending' → optimistic message; not yet ack'd by server  (clock icon ⏳)
   *  'sent'    → server saved the message                      (single ✓)
   *  'seen'    → recipient opened the chat                     (double ✓✓ blue)
   *
   * Absence (undefined) is treated as 'sent' for history messages loaded from DB.
   */
  deliveryStatus?: "sending" | "sent" | "seen";

  /**
   * Reply/quote reference.
   * When set, the bubble renders an inline quote block above the message text.
   * We store only the minimal preview data — we do NOT refetch the original
   * message, so even deleted parents show "[Deleted message]" gracefully.
   */
  replyTo?: {
    id: string; // Original message ID (used for future scroll-to feature)
    content: string; // Truncated preview of the quoted text
    senderName: string; // Display name of the original sender
    isDeleted?: boolean; // True if the original was deleted after the reply
  };
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
  /**
   * Live online status, updated via 'userStatus' socket event.
   * Stored inside the IChatPreview so both the sidebar and the chat header
   * can read the same value without a separate subscription.
   */
  isOnline?: boolean;
}

export interface IChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
}
