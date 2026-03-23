import { IChatPreview, IMessage } from "../props";

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
  /**
   * Called when the user confirms an inline edit of their own message.
   * Receives the message ID and the new text content.
   * The parent (MessagePage) calls store.editMessage() with these values.
   */
  onEdit?: (messageId: string, newContent: string) => void;
}
