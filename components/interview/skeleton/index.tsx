import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Interview Schedule Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-5 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-none" />
              <Skeleton className="h-3 w-24 rounded-none" />
            </div>
          </div>
          <Skeleton
            className={
              isCompany
                ? "h-9 w-44 rounded-none"
                : "size-9 rounded-none"
            }
          />
        </div>

        {/* Interview Cards Section */}
        <div className="flex w-full flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full overflow-hidden rounded-none border border-border border-l-[5px] border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)]"
            >
              {/* Card Body Section */}
              <div className="flex flex-col gap-4 p-4 sm:p-5">
                {/* Header Row Section: Title + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-5 w-48 rounded-none sm:h-6" />
                    <Skeleton className="h-5 w-36 rounded-none" />
                  </div>
                  <Skeleton className="h-6 w-20 flex-shrink-0 rounded-none" />
                </div>

                {/* Description Section */}
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-full rounded-none" />
                  <Skeleton className="h-5 w-4/5 rounded-none" />
                </div>

                {/* Schedule Metadata Section */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-32 rounded-none" />
                  <Skeleton className="h-7 w-20 rounded-none" />
                  <Skeleton className="h-7 w-28 rounded-none" />
                </div>
              </div>

              {/* Employee Action Bar Section */}
              {!isCompany && (
                <div className="flex items-center gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
                  <Skeleton className="h-9 w-36 rounded-none" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
