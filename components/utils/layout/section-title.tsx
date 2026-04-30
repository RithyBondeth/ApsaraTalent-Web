import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionTitle(props: { icon: React.ReactNode; title: string }) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      {/* Icon Section */}
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">
          {props.icon}
        </span>
      </div>
      {/* Title Section */}
      <h3 className="font-semibold text-base">{props.title}</h3>
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
