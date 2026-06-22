import { badgeRandomColorsClass } from "@/utils/constants/ui.constant";

/* --------------------------------- Methods ---------------------------------- */
/**
 * Deterministically assigns a random-looking color class from a predefined list
 * by hashing the characters of a label. Useful for tag/badge styling where
 * the same label should always get the same color.
 *
 * @param label - The text label to hash (e.g., "React", "Frontend")
 * @returns A tailwind class string
 */
export function getRandomBadgeColor(label: string) {
  const index =
    label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    badgeRandomColorsClass.length;

  return badgeRandomColorsClass[index];
}
