import { IMessage } from "../props";

export interface IChatInputProps {
  onSendMessage: (content: string, replyTo?: IMessage["replyTo"] | null) => void;
  onTyping?: (isTyping: boolean) => void;
  isDisabled?: boolean;
  /**
   * When set, the input shows a quote bar above the textarea previewing
   * the message being replied to.  The user can dismiss it with ✕.
   */
  replyTarget?: IMessage | null;
  /**
   * Called when the user clicks ✕ on the reply preview bar.
   * The parent (MessagePage) should clear its replyTarget state.
   */
  onCancelReply?: () => void;
}
