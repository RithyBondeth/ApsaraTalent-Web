/* ----------------------------------- Types ---------------------------------- */
type TFormatDurationClockOptions = {
  padMinutes?: boolean;
};

/* --------------------------------- Methods ---------------------------------- */
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
