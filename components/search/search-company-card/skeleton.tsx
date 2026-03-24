import { Skeleton } from "@/components/ui/skeleton";

export default function SearchEmployeeCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Row */}
        <div className="flex gap-4">
          <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-28 mt-1.5" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>

        {/* Meta Chips */}
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
        </div>

        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}
