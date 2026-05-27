import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";

export function getNameInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, AVATAR_INITIALS_LENGTH)
    .toUpperCase();
}
