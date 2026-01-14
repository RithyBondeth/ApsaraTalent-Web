import { Skeleton } from "@/components/ui/skeleton";

export function CompanyProfilePageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Cover Image Section */}
      <div className="relative h-80 w-full flex items-end p-5 bg-muted">
        <div className="relative flex items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          <Skeleton className="size-32 tablet-sm:size-28 rounded-md" />
          <div className="flex flex-col items-start gap-2 tablet-sm:items-center">
            <Skeleton className="h-8 w-48 tablet-sm:w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* Left Column */}
        <div className="w-[60%] flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="flex flex-col items-start gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 p-4 border border-muted rounded-md"
              >
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-full">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Company Images */}
          <div className="w-full p-5 border-[1px] border-muted rounded-md">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="flex gap-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-[280px] rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[40%] flex flex-col gap-5 tablet-lg:w-full">
          {/* Account Settings */}
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="w-full flex flex-wrap gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="w-full flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Careers */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="w-full flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-32 rounded-3xl" />
              ))}
            </div>
          </div>

          {/* Social Information */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[1px] w-full" />
            </div>
            <div className="w-full flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
