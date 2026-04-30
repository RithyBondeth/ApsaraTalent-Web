/* --------------------------------- Methods ---------------------------------- */
/**
 * Safely parses any date input (string, Date, or number) into a valid JS Date object.
 * Returns current Date if parsing fails.
 *
 * Timezone handling:
 *   - ISO strings WITH a timezone suffix (e.g. "…Z" or "…+07:00") are parsed correctly
 *     by `new Date()` — the browser converts them to local time automatically.
 *   - ISO strings WITHOUT a timezone suffix (e.g. "2025-03-17T10:00:00.000") are
 *     ambiguous. The DB stores TIMESTAMP WITH TIME ZONE (UTC) and TypeORM serializes
 *     them with "Z", so this case should not occur in practice. As a safety net we
 *     append "Z" to bare ISO-like strings so they're treated as UTC rather than as
 *     local time (which would shift the displayed time by the local UTC offset).
 */
export const parseMessageDate = (
  timestamp: Date | string | number | undefined,
): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) {
    return isNaN(timestamp.getTime()) ? new Date() : timestamp;
  }
  if (typeof timestamp === "string") {
    // If the string looks like an ISO datetime but has no timezone indicator,
    // append 'Z' so the browser interprets it as UTC (not local time).
    const bare = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(
      timestamp,
    );
    const normalised = bare ? timestamp + "Z" : timestamp;
    const date = new Date(normalised);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  const date = new Date(timestamp);
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
