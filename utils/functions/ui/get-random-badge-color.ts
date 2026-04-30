import { badgeRandomColorsClass } from "@/utils/constants/ui.constant";

/* --------------------------------- Methods ---------------------------------- */
export function getRandomBadgeColor(label: string) {
  const index =
    label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    badgeRandomColorsClass.length;

  return badgeRandomColorsClass[index];
}
