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
      className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* --------------------------- Company Profile Page Loading Skeleton --------------------------- */
export function CompanyProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Cover image Section */}
        <Skeleton className="h-28 w-full rounded-none sm:h-32" />

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Cover Section */}
            <Skeleton className="-mt-9 size-20 flex-shrink-0 rounded-xl sm:-mt-10 sm:size-24" />

            {/* Name and Industry Section */}
            <div className="min-w-0 flex-1 space-y-1.5 pt-3 tablet-md:flex tablet-md:flex-col tablet-md:items-center tablet-md:pt-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Edit Button Section */}
            <div className="flex flex-shrink-0 gap-2 pt-3 tablet-md:w-full">
              <Skeleton className="h-10 w-28 rounded-xl tablet-md:w-full" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Completion Section */}
      <SkeletonCard className="p-4 sm:p-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <Skeleton className="size-14 shrink-0 rounded-2xl sm:size-16" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] items-start gap-5 tablet-lg:grid-cols-1">
        {/* Left: 60% Section */}
        <div className="min-w-0 flex flex-col gap-5">
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
              {/* Industry and Location Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Company Size and Founded Year Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Website URL and Company Type Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Email Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Phone Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
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
                  {/* Title Section */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  {/* Description Section */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-20 w-full rounded-md" />
                  </div>
                  {/* Position Type | Work Mode Section */}
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                  {/* Experience | Education Section */}
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                  {/* Skills Section */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, k) => (
                        <Skeleton key={k} className="h-7 w-16 rounded-full" />
                      ))}
                    </div>
                  </div>
                  {/* Salary Range Section */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-36 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1 rounded-md" />
                      <Skeleton className="h-10 flex-1 rounded-md" />
                    </div>
                  </div>
                  {/* Job Location | Number of Openings Section */}
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                  {/* Deadline Date Section */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
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
        <div className="min-w-0 flex flex-col gap-5">
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

/* -------------------------- Employee Profile Page Loading Skeleton --------------------------- */
export function EmployeeProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Gradient banner */}
        <div className="relative h-28 overflow-hidden bg-[hsl(var(--illustration-surface))] sm:h-32">
          <Skeleton className="absolute -right-8 -top-12 size-36 rounded-full opacity-50" />
          <Skeleton className="absolute right-20 top-7 size-3 rounded-full" />
        </div>

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Banner Section */}
            <Skeleton className="-mt-9 size-20 flex-shrink-0 rounded-xl sm:-mt-10 sm:size-24" />

            {/* Name and JobTitle Section */}
            <div className="min-w-0 flex-1 space-y-1.5 pt-3 tablet-md:flex tablet-md:flex-col tablet-md:items-center tablet-md:pt-0">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Edit Button Section */}
            <div className="flex flex-shrink-0 gap-2 pt-3 tablet-md:w-full">
              <Skeleton className="h-10 w-28 rounded-xl tablet-md:w-full" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Completion Section */}
      <SkeletonCard className="p-4 sm:p-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <Skeleton className="size-14 shrink-0 rounded-2xl sm:size-16" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] items-start gap-5 tablet-lg:grid-cols-1">
        {/* Left: 60% Section */}
        <div className="min-w-0 flex flex-col gap-5">
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
              {/* Work Mode and Notice Period Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Portfolio URL and LinkedIn URL Section */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Languages Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Expected Salary Section */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-28 rounded-md shrink-0" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                </div>
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
        <div className="min-w-0 flex flex-col gap-5">
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
