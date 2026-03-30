import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";

export interface IChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
  onReply?: (message: IMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}
