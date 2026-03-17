import { IMessage } from "../props";

export interface IChatInputProps {
  /**
   * Called when the user sends a message.
   * content     — the text (may be empty if attachment-only send is used).
   * replyTo     — the quote context if replying.
   * attachment  — the upload result { url, type, filename } if a file was attached.
   */
  onSendMessage: (
    content: string,
    replyTo?: IMessage["replyTo"] | null,
    /**
     * All ready-to-send attachments.
     * Each entry was pre-uploaded via POST /chat/upload and carries a server URL.
     * The parent (page.tsx) dispatches each as its own socket message so that
     * every file shows up as a separate bubble (text goes with the first file).
     */
    attachments?: Array<{
      url: string;
      type: "image" | "document" | "audio";
      filename: string;
      duration?: number;
      amplitude?: number[];
    }>,
  ) => boolean;
  onTyping?: (isTyping: boolean) => void;
  isDisabled?: boolean;
  /**
   * When set, the input shows a quote bar above the textarea previewing
   * the message being replied to. The user can dismiss it with ✕.
   */
  replyTarget?: IMessage | null;
  /**
   * Called when the user clicks ✕ on the reply preview bar.
   * The parent (MessagePage) should clear its replyTarget state.
   */
  onCancelReply?: () => void;
}
