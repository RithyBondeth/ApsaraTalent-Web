/* --------------------------------- Method ---------------------------------- */
/**
 * Formats a date string into a short textual representation (e.g., "Oct 12, 2023").
 *
 * @param dateString - The raw date string to format
 * @returns Short localized date string en-US format
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
