import { IMessage } from "@/utils/interfaces/chat/chat.interface";

export interface IMessageReplyPreviewProps {
  replyTarget: IMessage;
  replyPreviewText: string;
  onCancelReply?: () => void;
}
