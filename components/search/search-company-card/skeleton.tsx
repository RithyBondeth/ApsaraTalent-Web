import { Skeleton } from "@/components/ui/skeleton";

export default function SearchEmployeeCardSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      {/* Top section with avatar and name */}
      <div className="flex items-center gap-5 tablet-md:flex-col tablet-md:items-start">
        <Skeleton className="size-28 rounded-md phone-md:!hidden" />
        <div className="flex flex-col items-start gap-3">
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton className="h-6 w-20 rounded-full" key={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between phone-xl:!flex-col phone-xl:!gap-3 phone-xl:!items-start">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    </div>
  );
}