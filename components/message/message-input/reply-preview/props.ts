import { IMessage } from "@/utils/interfaces/chat";

export interface IMessageReplyPreviewProps {
  replyTarget: IMessage;
  replyPreviewText: string;
  onCancelReply?: () => void;
}
