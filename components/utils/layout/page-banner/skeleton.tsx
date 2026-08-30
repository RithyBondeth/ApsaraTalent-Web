import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IPageBannerSkeletonProps } from "./props";

/* ---------------------------------------------------------------------------
 * The loading shape of `PageBanner`.
 *
 * This replaced `FeedBannerSkeleton`, which had been left behind when the
 * two-column hero was retired: it still drew a 280px grid with a dark
 * `bg-foreground` panel and a framed artwork placeholder on the right. Six
 * pages loaded with that ghost and then snapped to a shorter, single-column,
 * left-accented banner.
 *
 * Every wrapper below carries the *same* classes as the real banner, so the
 * padding, the accent edge and the grid all match — `page-banner-parity.test`
 * compares the two roots class by class and fails if they drift apart again.
 * Each placeholder sits inside a row whose height is the line box it stands
 * in: 24px for `text-sm leading-6`, 26/32px for the responsive title.
 *
 * The two-title-line, two-subtitle-line shape is a median, not a promise. How
 * many lines the real copy wraps to depends on the string and the viewport,
 * which a placeholder cannot know; across the eight banners this lands within
 * about 30px either way. That is deliberately not exposed as a prop — a
 * per-page line count is a knob that goes stale the next time someone edits a
 * translation, and stale skeletons are the whole reason this file exists.
 * `stats` *is* a prop, because a stats column is structural: it is either
 * there or it isn't, and the difference is a whole column.
 * ------------------------------------------------------------------------- */

export function PageBannerSkeleton({
  stats = 0,
  children,
  className,
}: IPageBannerSkeletonProps) {
  const hasStats = stats > 0;

  return (
    <section
      className={cn(
        "w-full border border-l-[5px] border-border border-l-primary bg-card px-6 py-6 sm:px-8",
        hasStats &&
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-5 tablet-md:grid-cols-1",
        className,
      )}
    >
      <div className="min-w-0">
        {/* Eyebrow Section: the rule is real — it is one pixel of primary and
            costs nothing, and drawing it as a placeholder would make the
            banner's most stable element flicker. */}
        <div className="flex h-4 items-center gap-2">
          <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
          <Skeleton className="h-2.5 w-28 rounded-none" />
        </div>

        {/* Title Section: two lines against the banner's 26ch measure. */}
        <div className="mt-3">
          <div className="flex h-[26px] items-center sm:h-8">
            <Skeleton className="h-[18px] w-[min(100%,21ch)] rounded-none sm:h-[22px]" />
          </div>
          <div className="flex h-[26px] items-center sm:h-8">
            <Skeleton className="h-[18px] w-[min(62%,12ch)] rounded-none sm:h-[22px]" />
          </div>
        </div>

        {/* Subtitle Section: two 24px rows, matching `text-sm leading-6`. */}
        <div className="mt-2.5">
          <div className="flex h-6 items-center">
            <Skeleton className="h-3 w-[min(100%,56ch)] rounded-none" />
          </div>
          <div className="flex h-6 items-center">
            <Skeleton className="h-3 w-[min(72%,38ch)] rounded-none" />
          </div>
        </div>
      </div>

      {/* Stats Section: pass a count only for pages that hand the banner its
          stats on first paint. Pages that withhold them while loading
          (interview, notification, search) leave this at zero, so the
          skeleton shows what the banner will actually show. */}
      {hasStats ? (
        <dl className="flex shrink-0 flex-wrap items-end gap-x-6 gap-y-3 tablet-md:items-start">
          {Array.from({ length: stats }).map((_, index) => (
            <div key={index} className="min-w-0">
              <dt className="flex items-center gap-1.5">
                <Skeleton className="size-3.5 shrink-0 rounded-none" />
                <Skeleton className="h-2.5 w-20 rounded-none" />
              </dt>
              <dd className="mt-1 flex h-8 items-center">
                <Skeleton className="h-[22px] w-10 rounded-none" />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* Controls Section */}
      {children ? (
        <div className={cn("w-full", hasStats && "col-span-full")}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
