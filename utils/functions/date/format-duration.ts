/* ----------------------------------- Types ---------------------------------- */
type TFormatDurationClockOptions = {
  padMinutes?: boolean;
};

/* --------------------------------- Methods ---------------------------------- */
/**
 * Converts a duration in seconds into a standard clock format (e.g. "2:05" or "02:05").
 *
 * @param seconds - Total duration in seconds
 * @param options - Configuration options (e.g., padMinutes for "02:05" vs "2:05")
 * @returns Formatted time string like "M:SS" or "MM:SS"
 */
export function formatDurationClock(
  seconds: number,
  options: TFormatDurationClockOptions = {},
): string {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(options.padMinutes ? 2 : 1, "0");
  const remainingSeconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}
