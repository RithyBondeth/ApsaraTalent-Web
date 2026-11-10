import { TApplicationStatus } from "@/utils/types/application/application-status.type";

/* --------------------------------- Method ---------------------------------- */
/**
 * Token classes for an application stage, in the shape
 * `getStatusBadgeStyleClass` uses for interviews.
 *
 * Only four stages spend a status colour, because only four of them are a
 * state a reader has to act on. `pending` and `reviewed` are neutral: an
 * application nobody has moved yet is the resting condition, not a warning, and
 * painting the whole inbox amber is what stops a real warning being seen.
 * `withdrawn` is muted for the same reason — the candidate left, which is
 * information but not a problem.
 *
 * `offered` and `interviewing` share the info family rather than borrowing
 * `warning`: they are progress, and a category must never be mistakable for a
 * state. They are told apart by their label and by the stage rail, not by hue.
 */
export function getApplicationStatusClass(status: TApplicationStatus) {
  switch (status) {
    case "hired":
      return "bg-success-subtle text-success-accent border-success-border";
    case "rejected":
      return "bg-destructive-subtle text-destructive-accent border-destructive-border";
    case "shortlisted":
    case "interviewing":
    case "offered":
      return "bg-info-subtle text-info-accent border-info-border";
    case "withdrawn":
      return "bg-muted text-muted-foreground border-border";
    default: // pending, reviewed
      return "bg-muted text-muted-foreground border-border";
  }
}
