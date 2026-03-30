import { IMessage } from "@/utils/interfaces/chat.interface";

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
