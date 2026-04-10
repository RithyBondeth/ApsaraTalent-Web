/* --------------------------------- Methods ---------------------------------- */
export function getAvailabilityStyleClass(availability: string) {
  const s = availability.toLowerCase();
  if (s.includes("full"))
    return "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300";
  if (s.includes("part"))
    return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300";
  if (s.includes("free"))
    return "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300";
  return "bg-muted text-muted-foreground";
}
