import { IChatPreview, IMessage } from "../props";

export interface IMessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
  isLastSeen?: boolean;
  onReply?: (message: IMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}
