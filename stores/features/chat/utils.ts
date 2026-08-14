import { normalizeMediaUrl } from "@/utils/functions/media";
import { z } from "zod";
import type {
  TChatHistoryResponse,
  TChatProfile,
  TRawChatMessage,
} from "./types";

const chatProfileSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    employee: z
      .object({
        firstname: z.string().nullable().optional(),
        lastname: z.string().nullable().optional(),
        username: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    company: z
      .object({
        name: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  })
  .passthrough();

const dateValueSchema = z.union([z.string(), z.date()]);
const rawChatMessageSchema = z
  .object({
    id: z.string(),
    sender: z.union([z.string(), chatProfileSchema]).nullable().optional(),
    receiver: z.union([z.string(), chatProfileSchema]).nullable().optional(),
    senderId: z.string().optional(),
    receiverId: z.string().optional(),
    senderName: z.string().optional(),
    content: z.string().nullable().optional(),
    sentAt: dateValueSchema.optional(),
    sendAt: dateValueSchema.optional(),
    createdAt: dateValueSchema.optional(),
    timestamp: dateValueSchema.optional(),
    isRead: z.boolean().optional(),
    messageType: z.string().optional(),
    reactions: z.record(z.string()).optional(),
    isDeleted: z.boolean().optional(),
    isEdited: z.boolean().optional(),
    attachment: z.string().nullable().optional(),
    // These map to nullable columns, so the API sends `null` — not an absent
    // key — for every text message. `.optional()` alone rejects null, and the
    // array parse below is all-or-nothing, so a single text message was enough
    // to blank the entire conversation list.
    attachmentType: z
      .enum(["image", "document", "audio"])
      .nullable()
      .optional(),
    attachmentFilename: z.string().nullable().optional(),
    attachmentDuration: z.number().nullable().optional(),
    attachmentAmplitude: z.array(z.number()).nullable().optional(),
    replyToId: z.string().nullable().optional(),
    isMe: z.boolean().nullable().optional(),
  })
  .passthrough();

const chatHistoryResponseSchema = z.object({
  messages: z.array(rawChatMessageSchema),
  partnerId: z.string(),
  partnerProfile: chatProfileSchema.nullable(),
});

/**
 * Parse per row rather than as one array.
 *
 * `z.array(...)` is all-or-nothing: one unexpected field anywhere discarded the
 * whole conversation list, silently, and the caller then fell through to an
 * empty "No conversations yet". A single unforeseen null on one old message
 * should cost that message, not every conversation the user has.
 */
export const parseRawChatMessages = (value: unknown): TRawChatMessage[] => {
  if (!Array.isArray(value)) return [];

  const parsed: TRawChatMessage[] = [];
  let dropped = 0;

  for (const entry of value) {
    const result = rawChatMessageSchema.safeParse(entry);
    if (result.success) parsed.push(result.data);
    else dropped += 1;
  }

  if (dropped > 0) {
    // Loud, because the previous silence is what made this hard to find.
    console.warn(
      `[Chat] dropped ${dropped} of ${value.length} messages that did not match the expected shape`,
    );
  }

  return parsed;
};

export const parseRawChatMessage = (value: unknown): TRawChatMessage | null => {
  const result = rawChatMessageSchema.safeParse(value);
  return result.success ? result.data : null;
};

export const parseChatHistory = (
  value: unknown,
): TChatHistoryResponse | TRawChatMessage[] | null => {
  // Per-row for the same reason as parseRawChatMessages: one odd message in a
  // long history should not blank the whole thread.
  if (Array.isArray(value)) return parseRawChatMessages(value);

  const response = chatHistoryResponseSchema
    .omit({ messages: true })
    .safeParse(value);
  if (!response.success) return null;

  return {
    ...response.data,
    messages: parseRawChatMessages(
      (value as { messages?: unknown } | null)?.messages,
    ),
  };
};

// ── Resolve Profile ──────────────────────────────────────────────────────────
// Helper to resolve display name and avatar from user object
export const resolveProfile = (user?: TChatProfile | null) => {
  if (!user) return { name: "Unknown", avatar: "/avatars/default.png" };
  const emp = user.employee;
  const co = user.company;

  const name =
    (emp
      ? [emp.firstname, emp.lastname].filter(Boolean).join(" ") ||
        emp.username ||
        user.email
      : co?.name || user.name || user.email) ?? "Unknown";

  const avatar =
    normalizeMediaUrl(emp?.avatar || co?.avatar) || "/avatars/default.png";
  return { name, avatar };
};

// ── Resolve Message Snippet ──────────────────────────────────────────────────
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

// ── Resolve Preview ────────────────────────────────────────────────────────────
// Build sidebar preview text for last message, including attachment-only messages.
export const resolvePreview = (
  chat: TRawChatMessage,
  currentUserId: string,
) => {
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
