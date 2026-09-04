/**
 * Renders an interview's scheduled time for the app UI.
 *
 * Two lines of information: the moment as the reader's browser reads it
 * (their zone, their locale), and, when the interview stored an originating
 * timezone that differs from the reader's, that origin zone spelled out. A
 * candidate in Bangkok reading a Phnom Penh company's interview page sees
 * both "6:00 PM" (their time) and "· 6:00 PM Asia/Phnom_Penh" (the
 * scheduler's time), so the day the two zones drift apart on DST never
 * turns into a wrong-day scare.
 *
 * When the origin zone matches the browser, or when it is missing entirely,
 * the origin-time trailer is suppressed — one prominent time, no clutter.
 */
export function formatInterviewTime(
  scheduledAt: string,
  timezone: string | null | undefined,
): string {
  const date = new Date(scheduledAt);
  const local = date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const zone = timezone?.trim();
  if (!zone) return local;

  // Compare by rendered result rather than by name — a browser reporting
  // "Asia/Bangkok" and a stored "Asia/Ho_Chi_Minh" are the same offset today
  // (UTC+7), and showing the origin time when it looks identical to the
  // reader's time reads as noise.
  const originLocal = safeFormat(date, zone);
  if (originLocal === null || originLocal === local) return local;

  return `${local} · ${originLocal} ${zone}`;
}

const safeFormat = (date: Date, zone: string): string | null => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: zone,
    }).format(date);
  } catch {
    return null;
  }
};
