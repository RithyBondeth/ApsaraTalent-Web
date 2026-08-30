import { TLanguage } from "@/utils/types/app/language.type";

const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

/* --------------------------------- Method ---------------------------------- */
/**
 * Renders a count in the digits the active language actually uses.
 *
 * The legal pages write their dates as Khmer numerals ("២៤ មីនា ២០២៦"), so a
 * Latin "16" sitting next to one in the same banner reads as a bug. Counts
 * derived from data — a section total, for instance — can't be hand-written in
 * the content object without drifting from the thing they count, so they come
 * through here instead.
 *
 * @param value - The number to render
 * @param language - Active UI language
 * @returns The number as a string, in Khmer numerals for `km`
 */
export function formatCount(value: number, language: TLanguage): string {
  const digits = String(value);
  if (language !== "km") return digits;
  return digits.replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);
}
