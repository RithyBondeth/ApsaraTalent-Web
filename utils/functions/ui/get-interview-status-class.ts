import { TInterviewStatus } from "@/utils/types/interview";

/* --------------------------------- Method ---------------------------------- */
/**
 * Returns the token classes (surface, text, border) for an interview status.
 *
 * These are status tokens rather than raw palette shades, so each one already
 * resolves in both themes — the `dark:` half of every pair here is gone. The
 * mapping is deliberate: "completed" is informational rather than a second
 * success, and "cancelled" is a neutral outcome rather than a failure, so
 * neither competes with the green of "accepted" or the red of "declined".
 *
 * @param status - An interview's state (e.g. "accepted", "declined", "pending")
 * @returns A string of tailwind utility classes
 */
export function getStatusBadgeStyleClass(status: TInterviewStatus) {
  switch (status) {
    case "accepted":
      return "bg-success-subtle text-success-accent border-success-border";
    case "declined":
      return "bg-destructive-subtle text-destructive-accent border-destructive-border";
    case "cancelled":
      return "bg-muted text-muted-foreground border-border";
    case "completed":
      return "bg-info-subtle text-info-accent border-info-border";
    default: // pending
      return "bg-warning-subtle text-warning-accent border-warning-border";
  }
}
