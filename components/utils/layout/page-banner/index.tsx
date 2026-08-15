import { cn } from "@/lib/utils";
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
 * `.pixel-graph-paper` — a ruled texture drawn from --foreground at 4.5%,
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

  return (
    <section className={cn("pixel-band", className)}>
      {/* Masthead Section — copy on the left, stats as their own ruled cells on
          the right, sharing one vertical rule rather than sitting in a
          gapped two-column grid. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="pixel-graph-paper pixel-pad min-w-0">
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
        {hasStats ? (
          <dl className="grid grid-cols-3 border-t border-border lg:auto-cols-[minmax(8.5rem,auto)] lg:grid-flow-col lg:grid-cols-none lg:border-l lg:border-t-0">
            {stats?.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex min-w-0 flex-col justify-end border-border p-4 sm:p-5 [&+&]:border-l"
              >
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon aria-hidden className="size-3.5 shrink-0" />
                  <span className="pixel-label truncate text-[10px]">
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
