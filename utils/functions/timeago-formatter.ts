/**
 * Converts a timestamp string to a human-readable "time ago" format
 * @param timestamp - Date string in format "YYYY-MM-DD HH:mm:ss.SSSSSS"
 * @returns A string like "2 minutes ago", "3 hours ago", etc.
 */
export function timeAgo(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates
  if (secondsAgo < 0) {
    return "just now";
  }

  // Less than a minute
  if (secondsAgo < 60) {
    return "just now";
  }

  // Minutes
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  }

  // Hours
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  }

  // Days
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }

  // Weeks
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  }

  // Months
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }

  // Years
  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
}
