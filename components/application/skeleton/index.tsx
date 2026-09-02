import { PageBannerSkeleton } from "@/components/utils/layout/page-banner/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TUserRole } from "@/utils/types/auth/role.type";

/* --------------------------- Application List Skeleton -------------------------- */
/**
 * Just the rows.
 *
 * Switching jobs re-fetches only the list — the banner and the job selector
 * above it are already on screen and stay put — so the in-page loading state
 * must not redraw them. Rendering the full page skeleton there stacked a
 * second banner underneath the live one.
 */
export function ApplicationListSkeleton({
  withScore = false,
}: {
  withScore?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full overflow-hidden rounded-none border border-border bg-card shadow-hard"
        >
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            {/* Header Row Section */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {withScore && (
                  <Skeleton className="size-12 shrink-0 rounded-none" />
                )}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded-none sm:h-6" />
                  <Skeleton className="h-3.5 w-36 rounded-none" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 flex-shrink-0 rounded-none" />
            </div>

            {/* Note Section */}
            <div className="space-y-1.5 border-t border-border/60 pt-3">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-4/5 rounded-none" />
            </div>

            {/* Action Row Section */}
            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
              <Skeleton className="h-3.5 w-28 rounded-none" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-none" />
                <Skeleton className="h-8 w-28 rounded-none" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- Application Loading Skeleton ------------------------- */
export default function ApplicationLoadingSkeleton({
  role,
}: {
  role?: TUserRole;
}) {
  // The company view carries a job selector and a fit-score column that the
  // employee view does not. A skeleton that draws a shape the page will not
  // show is the reflow the placeholder exists to prevent.
  const isCompany = role === USER_ROLE.COMPANY;

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBannerSkeleton />

      <section className="flex w-full flex-col gap-5">
        {/* Job Selector Section */}
        {isCompany && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-40 rounded-none" />
            ))}
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-5 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-none" />
              <Skeleton className="h-3 w-24 rounded-none" />
            </div>
          </div>
          <Skeleton className="h-9 w-32 rounded-none" />
        </div>

        {/* Application Cards Section */}
        <ApplicationListSkeleton withScore={isCompany} />
      </section>
    </div>
  );
}
