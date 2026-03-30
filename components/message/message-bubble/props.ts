import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";

export interface IMessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
  isLastSeen?: boolean;
  onReply?: (message: IMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}
