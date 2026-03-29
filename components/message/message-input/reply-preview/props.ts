import { IMessage } from "../../props";

export interface IMessageReplyPreviewProps {
  replyTarget: IMessage;
  replyPreviewText: string;
  onCancelReply?: () => void;
}
