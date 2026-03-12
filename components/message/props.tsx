export interface IMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date | string; // NestJS sends ISO strings or Date objects
  isMe?: boolean; // frontend only
  isRead?: boolean;
}
export interface IChatPreview {
  id: string; // chatId
  name: string; // Chat display name (user or group)
  avatar: string;
  preview: string; // Last message
  time: string; // Last message time
  unread?: number;
  isGroup?: boolean;
  tag?: string; // "Applicant" or any custom label
  isRead?: boolean;
}
