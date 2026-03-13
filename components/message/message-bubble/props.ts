import { IMessage } from "../props";
import { IChatPreview } from "../props";

export interface IMessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
  isLastSeen?: boolean;
}
