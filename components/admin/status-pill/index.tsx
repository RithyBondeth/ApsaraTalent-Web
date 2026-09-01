import { cn } from "@/lib/utils";
import type { IStatusPillProps } from "./props";

/* ---------------------------------------------------------------------------
 * The colour map for every status shown in the admin panel.
 *
 * Kept in one place so "suspended" is the same amber wherever it appears —
 * user list, account detail, audit log. Only design tokens: the status ramps
 * are contrast-solved in both themes, and `npm run check:tokens` fails on a
 * raw palette class.
 * ------------------------------------------------------------------------- */
const STATUS_STYLES: Record<string, string> = {
  // Users
  active: "bg-success-subtle text-success-accent border-success-border",
  suspended: "bg-warning-subtle text-warning-accent border-warning-border",
  banned:
    "bg-destructive-subtle text-destructive-accent border-destructive-border",
  // Reports
  pending: "bg-warning-subtle text-warning-accent border-warning-border",
  reviewed: "bg-info-subtle text-info-accent border-info-border",
  resolved: "bg-success-subtle text-success-accent border-success-border",
  dismissed: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({ status, label, className }: IStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]",
        STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
