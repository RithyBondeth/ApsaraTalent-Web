import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionTitle(props: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { icon, title, action } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-4 flex items-center justify-between gap-2.5 border-b border-border pb-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* Icon Section */}
        <div className="flex size-8 flex-shrink-0 items-center justify-center border border-border bg-muted/60">
          <span className="[&>svg]:size-[18px] [&>svg]:stroke-[1.5] [&>svg]:text-foreground">
            {icon}
          </span>
        </div>

        {/* Title Section */}
        <h3 className="truncate text-base font-bold tracking-tight">{title}</h3>
      </div>

      {/* Optional Action Slot Section */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function SectionTitleSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-4 flex items-center gap-2.5 border-b border-border/60 pb-3.5">
      {/* Icon Skeleton Section */}
      <Skeleton className="size-8 shrink-0 rounded-none" />

      {/* Title Skeleton Section */}
      <Skeleton className="h-5 w-32 rounded-none" />
    </div>
  );
}
