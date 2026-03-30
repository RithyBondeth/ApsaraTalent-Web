import { IMessage } from "@/utils/interfaces/chat.interface";

export interface IMessageReplyPreviewProps {
  replyTarget: IMessage;
  replyPreviewText: string;
  onCancelReply?: () => void;
}
