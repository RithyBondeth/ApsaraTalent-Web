import { FOUNDED_YEAR_MIN } from "@/utils/constants/ui.constant";

/* --------------------------------- Method ---------------------------------- */
/**
 * Selectable founding years, newest first — the order employers scan in, since
 * far more companies on the platform were founded recently than in 1900.
 *
 * Derived at call time rather than frozen into a constant so a build that spans
 * New Year does not go a year stale. `value` is the year as a string because
 * that is what the form fields and the select primitive exchange; the payload
 * layer is what converts it to a number.
 */
export function getFoundedYearOptions(
  currentYear: number = new Date().getFullYear(),
): { id: number; label: string; value: string }[] {
  const options: { id: number; label: string; value: string }[] = [];

  for (let year = currentYear; year >= FOUNDED_YEAR_MIN; year--) {
    options.push({ id: year, label: String(year), value: String(year) });
  }

  return options;
}
