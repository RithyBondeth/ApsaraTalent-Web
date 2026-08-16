import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TUserRole } from "@/utils/types/auth";

/* -------------------------------- Interview Loading Skeleton -------------------------------- */
export default function InterviewLoadingSkeleton({
  role,
}: {
  role?: TUserRole;
}) {
  const isCompany = role === USER_ROLE.COMPANY;

  return (
    <div className="interview-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton statCount={3} />

      {/* Interview Schedule Section */}
      <section className="pixel-band w-full">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
          <div>
            <Skeleton className="h-2.5 w-32" />
            <Skeleton className="mt-3 h-8 w-48" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
          <Skeleton className={isCompany ? "h-9 w-44" : "size-8"} />
        </div>

        {/* Interview Cards Section */}
        <div className="flex w-full flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full overflow-hidden border border-border bg-card"
            >
              {/* Card Body Section */}
              <div className="flex flex-col gap-4 p-4 sm:p-5">
                {/* Header Row Section: Title + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-5 w-48 sm:h-6" />
                    <Skeleton className="h-3.5 w-36" />
                  </div>
                  <Skeleton className="h-6 w-20 flex-shrink-0" />
                </div>

                {/* Description Section */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Schedule Metadata Section */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </div>

              {/* Employee Action Bar Section */}
              {!isCompany && (
                <div className="flex items-center gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
                  <Skeleton className="h-9 w-36" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
