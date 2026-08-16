import { PixelGridDecor } from "@/components/utils/brand/pixel-grid-decor";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { IPageBannerProps } from "./props";

/* ---------------------------------------------------------------------------
 * The page banner shared by feed, dashboard, matching, favourite, interview,
 * notification, search and resume-builder.
 *
 * This replaced a two-column hero whose right half was a decorative panel
 * holding an illustration. That artwork was `alt=""` with every sibling
 * aria-hidden — carrying no information — while costing 146–320 KB per page,
 * preloading with `priority`, and taking 68% of the fold on a 375px phone.
 * None of the SVGs used currentColor, so they could not follow the theme,
 * which is why the panel had to invert against the page to look deliberate.
 *
 * The space now goes to `stats`: counts the page has already loaded. A banner
 * that reports the state of someone's pipeline earns its height in a way a
 * stock drawing does not.
 *
 * The pixel redesign kept that decision. The only thing added back is
 * `.` — a ruled texture drawn from --foreground at 4.5%,
 * costing no bytes and following the theme, which is exactly what the deleted
 * SVGs could not do. Stats now set in the mono tier so the numbers read as
 * instrument output rather than as more prose.
 * ------------------------------------------------------------------------- */

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  stats,
  children,
  className,
}: IPageBannerProps) {
  const hasStats = Boolean(stats?.length);
  // The banner and its decoration share one 12-column grid. Each stat claims
  // two columns; the copy takes the rest, so every divider lands on a grid
  // line instead of wherever the content happened to end.
  const statCols = hasStats ? Math.min(6, (stats?.length ?? 0) * 2) : 0;
  const copyCols = 12 - statCols;

  return (
    <section
      className={cn("pixel-band pixel-module-grid overflow-hidden", className)}
    >
      {/* A quiet version of the landing lattice. Colour stays behind the
          content rail, while the real 12-column cells keep every rule exact. */}
      <PixelGridDecor seed={eyebrow} columns={12} className="-z-10" />
      {/* Masthead Section — copy on the left, stats as their own ruled cells on
          the right, sharing one vertical rule rather than sitting in a
          gapped two-column grid. */}
      <div
        className="page-banner-grid grid grid-cols-1 lg:grid-cols-12"
        style={
          {
            "--page-banner-copy-cols": copyCols,
            "--page-banner-stat-cols": statCols,
          } as CSSProperties
        }
      >
        <div className="page-banner-copy pixel-pad min-w-0">
          {/* Eyebrow Section */}
          <div className="pixel-label flex items-center gap-2 text-muted-foreground">
            {/* Three tiles of the ramp — the same mark the sheet uses
                throughout, so every header is recognisably one stationery. */}
            <span aria-hidden className="flex shrink-0">
              <span className="size-1 bg-pixel-2" />
              <span className="size-1 bg-pixel-3" />
              <span className="size-1 bg-pixel-5" />
            </span>
            {eyebrow}
          </div>

          {/* Title Section */}
          <h1 className="pixel-display mt-4 max-w-[24ch] text-3xl text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* Subtitle Section */}
          {subtitle ? (
            <p className="mt-4 max-w-[58ch] text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Stats Section — one cell per figure, divided by rules. Each cell
            fills the masthead's full height so the numbers form a column of
            readings against the headline rather than a footnote under it. */}
        {/* `auto-cols-[minmax(8.5rem,auto)]` sized these to their content,
            which is why the dividers landed at fractional columns (6.01, 7.14,
            8.28 measured) while the decoration ruled at whole ones. Equal
            fractions of a whole-column span put every divider on a grid line
            by construction. */}
        {hasStats ? (
          <dl
            className="page-banner-stats grid border-t border-border lg:border-l lg:border-t-0"
            style={{
              gridTemplateColumns: `repeat(${stats?.length ?? 1}, minmax(0, 1fr))`,
            }}
          >
            {stats?.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex min-w-0 flex-col justify-end border-border p-4 sm:p-5 [&+&]:border-l"
              >
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon aria-hidden className="size-3.5 shrink-0" />
                  <span className="pixel-label break-words text-[9px] leading-3 sm:text-[10px]">
                    {label}
                  </span>
                </dt>
                <dd className="pixel-numeral mt-2 text-2xl text-foreground sm:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* Controls Section — its own band under the masthead, so filters read as
          a toolbar attached to the page rather than as more banner content. */}
      {children ? (
        <div className="border-t border-border px-6 py-4 sm:px-8">
          {children}
        </div>
      ) : null}
    </section>
  );
}

/**
 * Loading counterpart to PageBanner. It deliberately shares the production
 * component's grid classes instead of approximating the banner with a second
 * hero layout, so route transitions cannot shift between two geometries.
 */
export function PageBannerSkeleton({
  statCount = 0,
  controls,
  className,
}: {
  statCount?: number;
  controls?: React.ReactNode;
  className?: string;
}) {
  const safeStatCount = Math.min(3, Math.max(0, statCount));
  const statCols = safeStatCount * 2;
  const copyCols = 12 - statCols;

  return (
    <section
      aria-label="Loading page header"
      aria-live="polite"
      className={cn("pixel-band pixel-module-grid overflow-hidden", className)}
      role="status"
    >
      <PixelGridDecor
        seed="page-banner-loading"
        columns={12}
        className="-z-10"
      />

      <div
        className="page-banner-grid grid grid-cols-1 lg:grid-cols-12"
        style={
          {
            "--page-banner-copy-cols": copyCols,
            "--page-banner-stat-cols": statCols,
          } as CSSProperties
        }
      >
        <div className="page-banner-copy pixel-pad min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-1 w-3" />
            <Skeleton className="h-2.5 w-28" />
          </div>
          <Skeleton className="mt-4 h-9 w-4/5 max-w-[620px] sm:h-11 lg:h-14" />
          <div className="mt-4 max-w-[58ch] space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>

        {safeStatCount > 0 ? (
          <div
            className="page-banner-stats grid border-t border-border lg:border-l lg:border-t-0"
            style={{
              gridTemplateColumns: `repeat(${safeStatCount}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: safeStatCount }, (_, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col justify-end border-border p-4 sm:p-5 [&+&]:border-l"
              >
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-3.5 shrink-0" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
                <Skeleton className="mt-2 h-8 w-12" />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {controls ? (
        <div className="border-t border-border px-6 py-4 sm:px-8">
          {controls}
        </div>
      ) : null}
    </section>
  );
}
