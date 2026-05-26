import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionTitle(props: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center justify-between gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Icon Section */}
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">
            {props.icon}
          </span>
        </div>
        {/* Title Section */}
        <h3 className="font-semibold text-base truncate">{props.title}</h3>
      </div>
      {/* Optional Action Slot */}
      {props.action && <div className="flex-shrink-0">{props.action}</div>}
    </div>
  );
}

export function SectionTitleSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <Skeleton className="size-8 rounded-lg shrink-0" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}
