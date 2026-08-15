import { cn } from "@/lib/utils";
import type { IStatusPillProps, TStatus, TStatusPillVariant } from "./props";

/* ---------------------------------------------------------------------------
 * One pill for every "this thing has a state" badge in the app.
 *
 * Before this existed, each caller hand-rolled its own four-class combination
 * (a raw green-800 on green-100, with a hand-written dark twin),
 * which is how the same "success" ended up as green in one file and emerald in
 * the next. The classes here are written out in full rather than assembled from
 * the status name — Tailwind only sees class names it can find as literal
 * strings, so `bg-${status}-subtle` would compile to nothing.
 * ------------------------------------------------------------------------- */

const SUBTLE: Record<TStatus, string> = {
  success: "bg-success-subtle text-success-accent border-success-border",
  warning: "bg-warning-subtle text-warning-accent border-warning-border",
  info: "bg-info-subtle text-info-accent border-info-border",
  destructive:
    "bg-destructive-subtle text-destructive-accent border-destructive-border",
};

const SOLID: Record<TStatus, string> = {
  success: "bg-success text-success-foreground border-success",
  warning: "bg-warning text-warning-foreground border-warning",
  info: "bg-info text-info-foreground border-info",
  destructive: "bg-destructive text-destructive-foreground border-destructive",
};

const DOT: Record<TStatus, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

const DOT_ON_SOLID: Record<TStatus, string> = {
  success: "bg-success-foreground",
  warning: "bg-warning-foreground",
  info: "bg-info-foreground",
  destructive: "bg-destructive-foreground",
};

const VARIANTS: Record<TStatusPillVariant, Record<TStatus, string>> = {
  subtle: SUBTLE,
  solid: SOLID,
};

export function StatusPill({
  status,
  variant = "subtle",
  dot = false,
  children,
  className,
}: IStatusPillProps) {
  return (
    <span
      className={cn(
        "pixel-label inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs",
        VARIANTS[variant][status],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            variant === "solid" ? DOT_ON_SOLID[status] : DOT[status],
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
