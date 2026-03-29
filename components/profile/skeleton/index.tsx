import { Skeleton } from "@/components/ui/skeleton";
import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";

/* --------------------------------------- Skeleton Card --------------------------------------- */
function SkeletonCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ---------------------------- Company Profile Page Loading Skeleton ---------------------------- */
export function CompanyProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Cover image Section */}
        <Skeleton className="h-44 sm:h-56 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Cover Section */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name and Industry Section */}
            <div className="flex-1 min-w-0 pt-2 space-y-1.5 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Edit Button Section */}
            <div className="flex gap-2 flex-shrink-0 pt-2">
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* Left: 60% Section */}
        <div className="w-[60%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-5">
              {/* Company Name Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Description Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              {/* Industry and Size Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Website Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Phone Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Location Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Open Positions Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Company Images Section Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-44 w-60 rounded-xl flex-shrink-0"
                />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: 40% Section */}
        <div className="w-[40%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Benefits Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Values Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Career Scopes Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Social Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Authentication Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {/* Socials Section */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-muted/30 rounded-xl py-3 px-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-[30px] rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
              {/* Email and Password Section */}
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Employee Profile Page Loading Skeleton ---------------------------- */
export function EmployeeProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Gradient banner */}
        <Skeleton className="h-28 sm:h-36 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Banner Section */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name and JobTitle Section */}
            <div className="flex-1 min-w-0 pt-2 space-y-1.5 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Edit Button Section */}
            <div className="flex gap-2 flex-shrink-0 pt-2">
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* Left: 60% Section */}
        <div className="w-[60%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Personal Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-5">
              {/* Firstname and Lastname Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Username Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Gender and DOB Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Phone Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Address Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Professional Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-5">
              {/* JobTitle Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Experience and Availability Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Description Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Education Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Experience Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-20 w-full rounded-md" />
                  </div>
                  <div className="flex gap-5 tablet-sm:flex-col">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: 40% Section */}
        <div className="w-[40%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Skills Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 rounded-full"
                  style={{ width: `${60 + (i % 3) * 20}px` }}
                />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Career Scopes Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* References Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-2.5">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="size-4 flex-shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-0.5">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Social Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Authentication Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {/* Socials Section */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-muted/30 rounded-xl py-3 px-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-[30px] rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
              {/* Email and Password Section */}
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
