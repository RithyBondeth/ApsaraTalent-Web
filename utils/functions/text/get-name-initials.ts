import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";

/**
 * Extracts and capitalizes the first letters of each word in a name string,
 * suitable for rendering fallback avatar circles.
 * Length is limited by AVATAR_INITIALS_LENGTH.
 *
 * @param name - The full name string
 * @returns Uppercase initials string
 */
export function getNameInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, AVATAR_INITIALS_LENGTH)
    .toUpperCase();
}
