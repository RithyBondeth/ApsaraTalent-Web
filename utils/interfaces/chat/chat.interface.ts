import { TChatRecordingState } from "@/utils/types/chat/chat.type";

export interface IChatReplyTo {
  id: string;
  content: string;
  senderName: string;
  isDeleted?: boolean;
}

export interface IChatUploadedFile {
  url: string;
  type: "image" | "document" | "audio";
  filename: string;
  duration?: number;
  amplitude?: number[];
}

export interface IMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date | string;
  isMe?: boolean;
  isRead?: boolean;
  reactions?: Record<string, string>;
  isDeleted?: boolean;
  isEdited?: boolean;
  deliveryStatus?: "sending" | "sent" | "seen";
  replyTo?: IChatReplyTo;
  attachment?: string | null;
  attachmentType?: "image" | "document" | "audio";
  attachmentFilename?: string;
  attachmentDuration?: number;
  attachmentAmplitude?: number[];
  messageType?: "text" | "image" | "document" | "audio" | "call" | string;
}

export interface IChatPreview {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: number;
  isGroup?: boolean;
  tag?: string;
  isRead?: boolean;
  lastMessageSenderId?: string;
  isOnline?: boolean;
}

export interface IInitiateChatResponse {
  chatId: string;
  id: string;
  name: string;
  avatar: string;
}

export interface IPendingFile {
  id: string;
  preview: string | null;
  status: "uploading" | "ready" | "error";
  error?: string;
  uploaded?: IChatUploadedFile;
  filename: string;
}

export interface IVoiceRecorderResult {
  recordingState: TChatRecordingState;
  /** Elapsed recording time in whole seconds. */
  durationSeconds: number;
  /** Error message if getUserMedia or upload failed. */
  errorMessage: string | null;
  startRecording: () => Promise<void>;
  /**
   * Stops recording, uploads the audio blob, then calls `onSend` with the result.
   * Returns false if nothing was recorded.
   */
  stopRecording: (
    onSend: (attachment: {
      url: string;
      type: "audio";
      filename: string;
      duration: number;
      amplitude: number[];
    }) => void,
  ) => Promise<boolean>;
  /** Discards the in-progress recording without sending. */
  cancelRecording: () => void;
}
