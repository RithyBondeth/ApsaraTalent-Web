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
   * Edit flag (synced from backend isEdited column).
   * When true the bubble shows a small "(edited)" label so both parties know
   * the original wording may have changed.
   */
  isEdited?: boolean;

  /**
   * Delivery state (frontend-only, not persisted).
   *
   * State machine:
   *  'sending' → optimistic message; not yet ack'd by server  (clock icon ⏳)
   *  'sent'    → server saved the message                      (single ✓)
   *  'seen'    → recipient opened the chat                     (double ✓✓ blue)
   */
  deliveryStatus?: "sending" | "sent" | "seen";

  /**
   * Reply/quote reference.
   * When set, the bubble renders an inline quote block above the message text.
   */
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
    isDeleted?: boolean;
  };

  /**
   * Attachment URL (image or document), stored in the DB and served statically.
   * When set, the bubble renders it below the text content.
   */
  attachment?: string | null;

  /**
   * Attachment media type — derived from the MIME type at upload time.
   * 'image'    → renders as an inline <img> preview.
   * 'document' → renders as a download link with a file icon.
   * 'audio'    → renders as a waveform audio player.
   */
  attachmentType?: "image" | "document" | "audio";

  /**
   * Original filename of the attachment (shown as the download link label).
   */
  attachmentFilename?: string;

  /**
   * Duration of an audio attachment in seconds.
   * Set client-side at recording time; echoed back by the server.
   */
  attachmentDuration?: number;

  /**
   * 30-point normalized waveform amplitude array (values 0–1) for audio attachments.
   * Sampled via Web Audio API AnalyserNode during recording; stored as JSON in DB.
   * Used to render the animated waveform bars in the audio player bubble.
   * Falls back to a flat default if absent (e.g. old messages pre-feature).
   */
  attachmentAmplitude?: number[];

  /**
   * Message type from backend (text/image/document/audio/call).
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
  /**
   * Live online status, updated via 'userStatus' socket event.
   */
  isOnline?: boolean;
}

export interface IChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
  onReply?: (message: IMessage) => void;
}
