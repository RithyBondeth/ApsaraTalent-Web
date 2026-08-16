import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * The section header used across profile, feed detail and the settings panes.
 *
 * It used to be an icon in a filled box beside a 16px title, with a half-tone
 * rule under it — the old card idiom, and the reason profile still read as a
 * different product after the sheet landed everywhere else.
 *
 * It now matches the section headers on dashboard and feed: a mono eyebrow
 * over a display heading, one full-weight rule beneath, and the icon demoted
 * to a small marker on the right. Same three parts in the same order on every
 * surface, so a section on profile and a section on the dashboard are visibly
 * the same object.
 * ------------------------------------------------------------------------- */

export function SectionTitle(props: {
  icon: React.ReactNode;
  title: string;
  /** Small uppercase kicker above the heading — a category, or an index. */
  eyebrow?: string;
  action?: React.ReactNode;
  variant?: "default" | "detail";
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { icon, title, eyebrow, action, variant = "default" } = props;
  const isDetail = variant === "detail";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-6 flex w-full items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        {eyebrow ? (
          <span className="pixel-label block text-muted-foreground">
            {eyebrow}
          </span>
        ) : null}
        <h3
          className={cn(
            "pixel-display truncate text-lg sm:text-xl",
            eyebrow && "mt-2",
          )}
        >
          {title}
        </h3>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {action}
        {/* The marker. Solid brand on a normal section, a quiet outline on a
            detail pane where several sit close together and a row of filled
            squares would read as a stack of buttons. */}
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center",
            isDetail
              ? "border border-border bg-muted/60 text-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          <span className="[&>svg]:size-[15px] [&>svg]:stroke-[1.6]">
            {icon}
          </span>
        </span>
      </div>
    </div>
  );
}

export function SectionTitleSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-6 flex w-full items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-6 w-40" />
      </div>
      <Skeleton className="size-7 shrink-0" />
    </div>
  );
}
