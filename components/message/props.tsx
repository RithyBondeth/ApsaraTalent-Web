import { IChatPreview, IMessage } from "@/utils/interfaces/chat";

export interface IChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
  onReply?: (message: IMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}
