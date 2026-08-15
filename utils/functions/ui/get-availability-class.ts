/* --------------------------------- Method ---------------------------------- */
/**
 * Maps a job availability keyword to its chip classes.
 *
 * Availability is a category, not a severity — a freelancer is not a warning —
 * so this reads from the categorical ramp. The hues match
 * `AvailabilityBadge`, which renders the same three values elsewhere; keep the
 * two in step if you add a fourth.
 */
export function getAvailabilityStyleClass(availability: string) {
  const s = availability.toLowerCase();
  if (s.includes("full"))
    return "bg-category-teal-subtle text-category-teal-accent";
  if (s.includes("part"))
    return "bg-category-indigo-subtle text-category-indigo-accent";
  if (s.includes("free"))
    return "bg-category-violet-subtle text-category-violet-accent";
  return "bg-muted text-muted-foreground";
}
