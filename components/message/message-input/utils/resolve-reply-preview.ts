import { IMessage } from "../../props";

export default function resolveReplyPreview(target: IMessage) {
  if (target.isDeleted) return "This message was deleted";

  const content = target.content?.trim();
  if (content) return content;

  const type = target.attachmentType;
  if (type === "audio") return "Audio message";
  if (type === "image") return "Photo";
  if (type === "document") return "Attachment";
  if (target.attachment) return "Attachment";

  return "Message";
}
