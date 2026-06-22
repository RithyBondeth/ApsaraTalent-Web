/* --------------------------------- Methods ---------------------------------- */
/**
 * Transforms an UPPER_CASE_SNAKE enum-like string into capitalized title-case words.
 *
 * @param value - The snake_case string (e.g. "FULL_TIME")
 * @returns Formatted textual string (e.g. "Full Time")
 */
export function formatAvailabilityWords(value: string): string {
  if (!value) return "";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

}
