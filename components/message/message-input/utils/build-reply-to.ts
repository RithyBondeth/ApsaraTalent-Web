import { IMessage } from "../../props";
import resolveReplyPreview from "./resolve-reply-preview";

export default function buildReplyTo(
  target?: IMessage | null,
): IMessage["replyTo"] | null {
  if (!target) return null;

  return {
    id: target.id,
    content: resolveReplyPreview(target),
    senderName: target.senderName || (target.isMe ? "You" : ""),
    isDeleted: target.isDeleted,
  };
}
