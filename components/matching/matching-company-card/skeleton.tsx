import { Skeleton } from "@/components/ui/skeleton";

export default function MatchingCompanyCardSkeleton() {
  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-md">
      <Skeleton className="size-56 rounded-md phone-md:!hidden" />

      <div className="w-full flex flex-col items-start gap-3">
        {/* Header */}
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-4 w-full max-w-lg" />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>

        {/* Stats + Button */}
        <div className="w-full flex items-center justify-between mt-1">
          <div className="flex items-center gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
