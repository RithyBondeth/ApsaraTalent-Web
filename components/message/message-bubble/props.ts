import { IMessage } from "../props";
import { IChatPreview } from "../props";

export interface IMessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
  isLastSeen?: boolean;
  /**
   * Called when the user clicks the Reply button on this bubble.
   * The parent (ChatMessages → MessagePage) stores the target message
   * and passes it to ChatInput so the input shows a quote preview bar.
   */
  onReply?: (message: IMessage) => void;
}
