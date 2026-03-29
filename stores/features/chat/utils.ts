import { normalizeMediaUrl } from "@/utils/functions/media";

// Helper to resolve display name and avatar from user object
export const resolveProfile = (user: any) => {
  if (!user) return { name: "Unknown", avatar: "/avatars/default.png" };
  const emp = user.employee;
  const co = user.company;

  const name = emp
    ? [emp.firstname, emp.lastname].filter(Boolean).join(" ") ||
      emp.username ||
      user.email
    : co?.name || user.email;

  const avatar =
    normalizeMediaUrl(emp?.avatar || co?.avatar) || "/avatars/default.png";
  return { name, avatar };
};

// Build a short message snippet for previews (text or attachment labels).
export const resolveMessageSnippet = (message: {
  content?: string | null;
  attachmentType?: string | null;
  messageType?: string | null;
  attachment?: string | null;
}) => {
  const content =
    typeof message?.content === "string" ? message.content.trim() : "";
  if (content) return content;

  const type = String(
    message?.attachmentType || message?.messageType || "",
  ).toLowerCase();
  if (type === "audio") return "Audio message";
  if (type === "image") return "Photo";
  if (type === "document") return "Attachment";
  if (type === "call") return "Call";
  if (message?.attachment) return "Attachment";
  return "";
};

// Build sidebar preview text for last message, including attachment-only messages.
export const resolvePreview = (chat: any, currentUserId: string) => {
  const senderId =
    typeof chat?.sender === "string"
      ? chat.sender
      : chat.sender?.id || chat.senderId;
  const isSenderMe =
    senderId && senderId.toLowerCase() === currentUserId.toLowerCase();
  const senderProfile = typeof chat?.sender === "string" ? null : chat?.sender;
  const senderName = isSenderMe ? "You" : resolveProfile(senderProfile).name;

  const base = resolveMessageSnippet(chat) || "No messages yet";

  if (base === "No messages yet") return base;
  const prefix = senderName ? `${senderName}: ` : "";
  return `${prefix}${base}`;
};
