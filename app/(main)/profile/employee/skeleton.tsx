import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeProfilePageSkeleton() {
  return (
    <div className="!min-w-full flex flex-col gap-5">
      {/* Header Section with Avatar and Edit Button */}
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <div className="relative">
            <Skeleton className="size-36 rounded-md" />
          </div>
          <div className="flex flex-col items-start gap-1 tablet-sm:items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* Left Column - 60% */}
        <div className="w-[60%] flex flex-col gap-5">
          {/* Personal Information Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-40" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-col items-start gap-5">
              <div className="w-full flex items-center justify-between gap-5 [&>div]:!w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-48" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-col items-start gap-5">
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-md:flex-col tablet-md:[&>div]:w-full">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>

          {/* Education Information Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-col items-start gap-5">
              {[1, 2].map((index) => (
                <div className="w-full flex flex-col items-start gap-3" key={index}>
                  <div className="w-full flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Information Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-col items-start gap-5">
              {[1, 2].map((index) => (
                <div className="w-full flex flex-col items-start gap-3" key={index}>
                  <div className="w-full flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                      <div className="w-1/2 flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                      <div className="w-1/2 flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 40% */}
        <div className="w-[40%] flex flex-col gap-5">
          {/* Account Settings Section */}
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-32" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-col items-start gap-5">
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-full flex flex-col gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="h-6 w-16" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Career Scopes Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="h-6 w-28" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-8 w-24 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* References Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <Skeleton className="h-6 w-44" />
            <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
              {[1, 2].map((index) => (
                <div key={index} className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Information Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-36" />
              <div className="border-t border-muted mt-2" />
            </div>
            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-stretch gap-3">
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3].map((index) => (
                    <Skeleton key={index} className="h-8 w-20 rounded-2xl" />
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col items-start gap-5 p-5 mt-3 border-[1px] border-muted rounded-md">
                <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                  <div className="w-full flex flex-col gap-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}