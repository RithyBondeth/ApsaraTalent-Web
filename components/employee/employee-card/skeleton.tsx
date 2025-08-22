import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeCardSkeleton() {
  return (
    <div className="h-fit w-full min-w-0 flex flex-col items-start gap-5 p-3 rounded-lg shadow-sm border border-muted cursor-pointer">
      {/* Profile Section - Match exact structure */}
      <div className="w-full flex items-start justify-between phone-xl:flex-col phone-xl:gap-5">
        <div className="flex items-center gap-3">
          {/* Avatar - Match exact size and styling */}
          <Skeleton className="size-24 rounded-md" />
          <div className="flex flex-col items-start gap-1">
            {/* Username */}
            <Skeleton className="h-5 w-24 rounded-md" />
            {/* Job */}
            <Skeleton className="h-4 w-20 rounded-md" />
            {/* Location */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-3 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 tablet-xl:flex-col tablet-lg:!flex-row">
          {/* Action Buttons - Match actual rounded-full buttons */}
          <Skeleton className="size-12 rounded-md" />
          <Skeleton className="size-12 rounded-md" />
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full flex flex-col gap-3">
        <Skeleton className="h-4 w-12 rounded-md" />
        <div className="w-full flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-22 rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-4 w-20 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
      </div>

      {/* Experience & Availability */}
      <div className="w-full flex flex-col gap-3">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-4 w-28 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex items-center justify-end gap-3">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-md" />
      </div>
    </div>
  );
}