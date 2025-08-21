import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col items-start gap-5 p-3 rounded-lg shadow-sm border border-muted">
      {/* Profile Section */}
      <div className="w-full flex items-start justify-between tablet-lg:flex-col tablet-lg:gap-4">
        <div className="flex items-center gap-3 tablet-lg:w-full tablet-lg:justify-center">
          {/* Avatar - Match CachedAvatar size-24 */}
          <Skeleton className="size-24 rounded-md tablet-lg:size-20" />
          <div className="flex flex-col items-start gap-1 tablet-lg:items-center tablet-lg:flex-1">
            {/* Username */}
            <Skeleton className="h-5 w-28 rounded tablet-lg:w-32" />
            {/* Job */}
            <Skeleton className="h-4 w-24 rounded tablet-lg:w-28" />
            {/* Location */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-20 rounded tablet-lg:w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 tablet-xl:flex-col tablet-lg:flex-row">
          {/* Action Buttons - Match actual button styling */}
          <Skeleton className="size-12 rounded-md" />
          <Skeleton className="size-12 rounded-md" />
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full flex flex-col gap-3 tablet-lg:items-center">
        <Skeleton className="h-4 w-16 rounded" />
        <div className="w-full flex flex-wrap gap-2 tablet-lg:justify-center">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="w-full flex flex-col gap-2 tablet-lg:items-center">
        <Skeleton className="h-4 w-20 rounded" />
        <div className="space-y-2 tablet-lg:text-center tablet-lg:w-4/5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded tablet-lg:mx-auto" />
          <Skeleton className="h-3 w-3/4 rounded tablet-lg:mx-auto" />
        </div>
      </div>

      {/* Experience & Availability */}
      <div className="w-full flex flex-col gap-3 tablet-lg:items-center">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="flex flex-wrap gap-2 tablet-lg:justify-center">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex items-center justify-end gap-3 tablet-lg:justify-center tablet-md:flex-col tablet-md:gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}