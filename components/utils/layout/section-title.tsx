import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SectionTitle(props: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  variant?: "default" | "detail";
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { icon, title, action, variant = "default" } = props;
  const isDetail = variant === "detail";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={cn(
        "mb-4 flex items-center justify-between gap-2.5 border-b border-border/60 pb-3.5",
        isDetail && "border-border",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Icon Section */}
        <div
          className={cn(
            "flex size-8 flex-shrink-0 items-center justify-center bg-primary/10",
            isDetail ? "border border-border bg-muted/60" : "rounded-none bg-foreground text-background",
          )}
        >
          <span
            className={cn(
              "[&>svg]:size-[18px] [&>svg]:stroke-[1.5]",
              isDetail ? "[&>svg]:text-foreground" : "[&>svg]:text-background",
            )}
          >
            {icon}
          </span>
        </div>

        {/* Title Section */}
        <h3
          className={cn(
            "truncate text-base font-semibold",
            isDetail && "font-bold tracking-tight",
          )}
        >
          {title}
        </h3>
      </div>

      {/* Optional Action Slot Section */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function SectionTitleSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      {/* Icon Skeleton Section */}
      <Skeleton className="size-8 shrink-0 rounded-none" />

      {/* Title Skeleton Section */}
      <Skeleton className="h-5 w-32 rounded-none" />
    </div>
  );
}
