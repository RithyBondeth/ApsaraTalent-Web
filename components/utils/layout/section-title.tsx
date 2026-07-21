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
    <div className="mb-4 flex items-center justify-between gap-2.5 border-b border-border/60 pb-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* Icon Section */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/15 bg-brand-soft">
          <span className="[&>svg]:size-[18px] [&>svg]:stroke-[1.5] [&>svg]:text-brand">
            {icon}
          </span>
        </div>

        {/* Title Section */}
        <h3 className="truncate text-base font-semibold tracking-[-0.01em]">
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
      <Skeleton className="size-8 rounded-lg shrink-0" />

      {/* Title Skeleton Section */}
      <Skeleton className="h-5 w-32" />
    </div>
  );
}
