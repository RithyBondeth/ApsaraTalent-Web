/* --------------------------------- Methods ---------------------------------- */
export function formatAvailabilityWords(value: string): string {
  if (!value) return "";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const availabilityWordsFormat = formatAvailabilityWords;
