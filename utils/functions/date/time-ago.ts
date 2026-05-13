/* ---------------------------------- Types ---------------------------------- */
type TimeAgoTranslator = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

/* --------------------------------- Methods ---------------------------------- */
export function timeAgo(
  timestamp: string | Date | null | undefined,
  t?: TimeAgoTranslator,
): string {
  if (!timestamp) return "";
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return t ? t("timeAgoJustNow") : "just now";
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return t
      ? t("timeAgoMinutes", { count: minutesAgo })
      : `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return t
      ? t("timeAgoHours", { count: hoursAgo })
      : `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return t
      ? t("timeAgoDays", { count: daysAgo })
      : `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return t
      ? t("timeAgoWeeks", { count: weeksAgo })
      : `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return t
      ? t("timeAgoMonths", { count: monthsAgo })
      : `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }

  const yearsAgo = Math.floor(daysAgo / 365);
  return t
    ? t("timeAgoYears", { count: yearsAgo })
    : `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
}
