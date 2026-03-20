import { Skeleton } from "@/components/ui/skeleton";

export default function MatchingCompanyCardSkeleton() {
  return (
    <div className="w-full flex items-start gap-3 rounded-md p-3 shadow-md sm:gap-5 sm:p-5 tablet-xl:flex-col">
      <Skeleton className="size-28 rounded-md sm:size-36 lg:size-56 phone-md:!hidden" />

      <div className="w-full flex flex-col items-start gap-3">
        {/* Header */}
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
        <div className="mt-1 flex w-full items-center justify-between gap-3 tablet-md:flex-col tablet-md:items-start">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
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
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
        </div>
      </div>
    </div>
  );
}
