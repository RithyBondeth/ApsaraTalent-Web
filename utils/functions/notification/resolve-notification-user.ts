import { USER_ROLE } from "@/utils/constants/auth.constant";
import { INotification } from "@/utils/interfaces/notification/notification.interface";

/**
 * The API substitutes this path for a user with no picture. Nothing serves it —
 * `public/avatars/` does not exist — so every card it reached rendered a broken
 * image instead of falling back to initials.
 */
const PLACEHOLDER_AVATAR_PATH = "/avatars/default.png";

/** The API's own placeholder title when it cannot resolve a chat sender. */
const UNRESOLVED_CHAT_TITLE = "New message";

export interface INotificationUser {
  id: string;
  name: string;
  position: string | null;
  industry: string | null;
  /** Undefined when the sender has no usable picture, so initials show. */
  avatar?: string;
}

/* --------------------------------- Methods --------------------------------- */
/**
 * Fallback name parser for notifications written before `data.senderName`
 * existed. There is deliberately no `chat` branch: a chat notification's
 * message is the message preview, so it contains no sender to recover.
 *
 * @param type - The notification type
 * @param message - The notification's message body
 * @returns The sender's name, or an empty string when none can be recovered
 */
export function parseSenderNameFromMessage(
  type: string | null,
  message: string,
): string {
  if (type === "like") {
    const m = message.match(/^(.+?) liked your/);
    if (m) return m[1];
  }
  if (type === "match") {
    const m1 = message.match(/^(.+?) and (?:you|your company) liked/);
    if (m1) return m1[1];
    const m2 = message.match(/^You and (.+?) liked/);
    if (m2) return m2[1];
  }
  if (type === "interview") {
    const m = message.match(/^(.+?) wants to schedule/);
    if (m) return m[1];
  }
  return "";
}

/**
 * Recovers a chat sender's name from the notification title.
 *
 * The API has always put it there, while the card renders its own translated
 * heading instead — so for rows written before `data.senderName` existed, the
 * title is the only place the name survives.
 *
 * @param title - The notification's stored title
 * @returns The sender's name, or an empty string for the API's placeholder
 */
export function parseSenderNameFromTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed === UNRESOLVED_CHAT_TITLE ? "" : trimmed;
}

/**
 * Resolves an avatar URL, treating an empty string and the placeholder path as
 * equally absent. `||` rather than `??` throughout, since an empty string has
 * to fall through as well.
 *
 * @param data - The notification's data payload
 * @returns A usable URL, or undefined so AvatarFallback shows initials
 */
export function resolveAvatarUrl(
  data: Record<string, unknown> | null,
): string | undefined {
  const candidate =
    (data?.senderAvatar as string) || (data?.avatar as string) || "";
  return candidate && candidate !== PLACEHOLDER_AVATAR_PATH
    ? candidate
    : undefined;
}

/**
 * Derives a display-friendly user from a notification.
 *
 * @param notification - The notification to read
 * @param role - The viewing user's role, which decides whose id is the counterparty
 * @returns The counterparty's display fields
 */
export function resolveNotificationUser(
  notification: INotification,
  role: string,
): INotificationUser {
  const id =
    (notification.data?.senderId as string) ??
    (role === USER_ROLE.EMPLOYEE
      ? (notification.data?.companyId as string)
      : (notification.data?.employeeId as string)) ??
    "";

  const name =
    (notification.data?.senderName as string) ||
    parseSenderNameFromMessage(notification.type, notification.message ?? "") ||
    parseSenderNameFromTitle(notification.title ?? "");

  return {
    id,
    name,
    position: (notification.data?.position as string | null) ?? null,
    industry: (notification.data?.industry as string | null) ?? null,
    avatar: resolveAvatarUrl(notification.data),
  };
}
