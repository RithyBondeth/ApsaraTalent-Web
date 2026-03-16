/**
 * Safely parses any date input (string, Date, or number) into a valid JS Date object.
 * Returns current Date if parsing fails.
 */
export const parseMessageDate = (
  timestamp: Date | string | number | undefined,
): Date => {
  if (!timestamp) return new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return isNaN(date.getTime()) ? new Date() : date;
};

/**
 * Formats a date specifically for message bubbles (e.g., "12:35 PM").
 * No seconds, following standard system clock styles.
 */
export const formatMessageTime = (date: Date | string): string => {
  const d = parseMessageDate(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a date for the sidebar last message (e.g., "12:35 PM", "Yesterday", or "Oct 12").
 */
export const formatSidebarTime = (date: Date | string): string => {
  const d = parseMessageDate(date);
  const now = new Date();

  // Same day
  if (d.toDateString() === now.toDateString()) {
    return formatMessageTime(d);
  }

  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // This year
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  // Older
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

/**
 * Gets a clean label for date dividers (Today, Yesterday, Oct 12).
 */
export const getDateDividerLabel = (date: Date | string): string => {
  const d = parseMessageDate(date);
  const now = new Date();

  if (d.toDateString() === now.toDateString()) return "Today";

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};
