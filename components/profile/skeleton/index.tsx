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
    <div className={`border border-border bg-card ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* ---------------------------- Profile Completion Loading Skeleton ---------------------------- */
function ProfileCompletionSkeleton() {
  return (
    <div className="flex items-center gap-4 border border-border bg-card p-4 sm:gap-5 sm:p-5">
      {/* Avatar Section */}
      <Skeleton className="size-16 shrink-0 sm:size-[72px]" />

      {/* Progression Bar Section */}
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-1.5 w-full" />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Company Profile Page Loading Skeleton --------------------------- */
export function CompanyProfilePageLoadingSkeleton() {
  return (
    <div className="profile-editorial-skeleton flex flex-col gap-6 sm:gap-7">
      <ProfileCompletionSkeleton />

      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Cover image Section */}
        <Skeleton className="h-48 w-full sm:h-64" />

        {/* Identity Section */}
        <div className="px-4 pb-5 sm:px-6">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Cover Section */}
            <Skeleton className="-mt-10 size-24 flex-shrink-0 sm:-mt-12 sm:size-28" />

            {/* Name and Industry Section */}
            <div className="min-w-0 flex-1 space-y-1.5 pt-2 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Edit Button Section */}
            <div className="flex flex-shrink-0 gap-2 pt-2">
              <Skeleton className="h-8 w-24 rounded-none" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] items-start gap-5 tablet-lg:grid-cols-1">
        {/* Left: 60% Section */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Company Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="grid grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              {/* Company Name Section */}
              <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Industry Section */}
              <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Description Section */}
              <div className="col-span-12 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-none" />
              </div>
              {/* Location Section */}
              <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Website URL Section */}
              <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Company Type Section */}
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Company Size Section */}
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Founded Year Section */}
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Email Section */}
              <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Phone Section */}
              <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
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
                  className="space-y-3 rounded-none border border-border/60 p-4"
                >
                  {/* Role Details Section */}
                  <div className="grid grid-cols-12 gap-3 tablet-md:grid-cols-1">
                    <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                    <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                    <div className="col-span-12 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-20 w-full rounded-none" />
                    </div>
                    <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                    <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                  </div>

                  {/* Experience and Education Requirements Section */}
                  <div className="space-y-4 border-t border-border/70 pt-4">
                    <div className="grid grid-cols-2 gap-3 tablet-md:grid-cols-1">
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <div className="flex flex-wrap gap-2">
                        {[...Array(4)].map((_, k) => (
                          <Skeleton key={k} className="h-7 w-16 rounded-none" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compensation and Timing Section */}
                  <div className="space-y-4 border-t border-border/70 pt-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <div className="grid grid-cols-[minmax(140px,0.45fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 tablet-md:grid-cols-1">
                        <Skeleton className="h-10 w-full rounded-none" />
                        <Skeleton className="h-10 w-full rounded-none" />
                        <Skeleton className="h-px w-3 tablet-md:hidden" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[minmax(180px,0.4fr)_minmax(0,1fr)] gap-3 tablet-md:grid-cols-1">
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                    </div>
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
                  className="h-44 w-60 flex-shrink-0 rounded-none"
                />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: 40% Section */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Benefits Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Values Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Career Scopes Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Social Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Authentication Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {/* Socials Section */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-none bg-muted/30 px-3 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="profile-social-icon-skeleton size-[30px] rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-none" />
                </div>
              ))}
              {/* Email and Password Section */}
              <div className="mt-2 space-y-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-10 w-full rounded-none" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-none" />
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
    <div className="profile-editorial-skeleton flex flex-col gap-6 sm:gap-7">
      <ProfileCompletionSkeleton />

      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Gradient banner */}
        <Skeleton className="h-40 w-full sm:h-52" />

        {/* Identity Section */}
        <div className="px-4 pb-5 sm:px-6">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Banner Section */}
            <Skeleton className="-mt-10 size-24 flex-shrink-0 sm:-mt-12 sm:size-28" />

            {/* Name and JobTitle Section */}
            <div className="min-w-0 flex-1 space-y-1.5 pt-2 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Edit Button Section */}
            <div className="flex flex-shrink-0 gap-2 pt-2">
              <Skeleton className="h-8 w-24 rounded-none" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] items-start gap-5 tablet-lg:grid-cols-1">
        {/* Left: 60% Section */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Personal Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="grid grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              {/* Firstname and Lastname Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Username Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Date of Birth Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Gender Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Location Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Email Section */}
              <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Phone Section */}
              <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Profile Visibility Section */}
              <div className="col-span-12 flex items-center justify-between border border-border p-3 tablet-md:col-span-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-none" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </div>
          </SkeletonCard>

          {/* Professional Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="grid grid-cols-12 gap-x-4 gap-y-5 tablet-md:grid-cols-1">
              {/* JobTitle Section */}
              <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              {/* Experience Section */}
              <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              {/* Availability, Work Mode and Notice Period Section */}
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              <div className="col-span-4 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              {/* Portfolio URL and LinkedIn URL Section */}
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              <div className="col-span-6 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>
              {/* Languages Section */}
              <div className="col-span-12 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-24" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-none" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
              {/* Expected Salary Section */}
              <div className="col-span-12 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-32" />
                <div className="grid grid-cols-[160px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 tablet-sm:grid-cols-1">
                  <Skeleton className="h-12 w-full rounded-none" />
                  <Skeleton className="h-12 w-full rounded-none" />
                  <Skeleton className="h-px w-3 tablet-sm:hidden" />
                  <Skeleton className="h-12 w-full rounded-none" />
                </div>
              </div>
              {/* Description Section */}
              <div className="col-span-12 space-y-1.5 tablet-md:col-span-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-none" />
              </div>
            </div>
          </SkeletonCard>

          {/* Experience Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-none border border-border/60 p-4"
                >
                  <div className="grid grid-cols-12 gap-3 tablet-md:grid-cols-1">
                    <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                    <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-20 w-full rounded-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 tablet-md:grid-cols-1">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Education Information Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-none border border-border/60 p-4"
                >
                  <div className="grid grid-cols-12 items-end gap-3 tablet-md:grid-cols-1">
                    <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-12 w-full rounded-none" />
                    </div>
                    <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-12 w-full rounded-none" />
                    </div>
                    <div className="col-span-7 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-12 w-full rounded-none" />
                    </div>
                    <div className="col-span-5 space-y-1.5 tablet-md:col-span-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-12 w-full rounded-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: 40% Section */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Skills Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 rounded-none"
                  style={{ width: `${60 + (i % 3) * 20}px` }}
                />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Career Scopes Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* References Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-2.5">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-none border border-border/40 bg-muted/50 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Skeleton className="size-4 flex-shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-0.5">
                    <Skeleton className="size-8 rounded-none" />
                    <Skeleton className="size-8 rounded-none" />
                    <Skeleton className="size-8 rounded-none" />
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
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </SkeletonCard>

          {/* Authentication Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {/* Socials Section */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-none bg-muted/30 px-3 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="profile-social-icon-skeleton size-[30px] rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-none" />
                </div>
              ))}
              {/* Email and Password Section */}
              <div className="mt-2 space-y-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-10 w-full rounded-none" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-none" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
