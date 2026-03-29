import { IMessage } from "../props";

export interface IChatInputProps {
  onSendMessage: (
    content: string,
    replyTo?: IMessage["replyTo"] | null,
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
  replyTarget?: IMessage | null;
  onCancelReply?: () => void;
}
