/* --------------------------------- Methods ---------------------------------- */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const dateFormatter = formatShortDate;
