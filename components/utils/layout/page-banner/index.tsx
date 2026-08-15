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
    <section
      className={cn(
        "pixel-graph-paper w-full border border-border bg-card px-6 py-6 shadow-pixel sm:px-8",
        hasStats &&
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-5 tablet-md:grid-cols-1",
        className,
      )}
    >
      <div className="min-w-0">
        {/* Eyebrow Section */}
        <div className="pixel-label flex items-center gap-2 text-muted-foreground">
          {/* Three tiles of the ramp instead of a single primary rule — the
              same mark the Card wears, so a banner and the cards beneath it
              are recognisably the same stationery. */}
          <span aria-hidden className="flex shrink-0">
            <span className="size-1 bg-pixel-2" />
            <span className="size-1 bg-pixel-3" />
            <span className="size-1 bg-pixel-5" />
          </span>
          {eyebrow}
        </div>

        {/* Title Section */}
        <h1 className="pixel-display mt-3 max-w-[26ch] text-2xl text-foreground sm:text-3xl">
          {title}
        </h1>

        {/* Subtitle Section */}
        {subtitle ? (
          <p className="mt-2.5 max-w-[62ch] text-sm leading-6 text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Stats Section */}
      {hasStats ? (
        // items-end aligns the numbers to the copy's baseline in the desktop
        // two-column layout. On mobile the block spans full width and stacks
        // under the copy (grid-cols-1), so the row wraps — three long labels
        // like "new this week" would otherwise collide at 375px.
        <dl className="flex shrink-0 flex-wrap items-end gap-x-6 gap-y-3 tablet-md:items-start">
          {stats?.map(({ icon: Icon, value, label }) => (
            <div key={label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <Icon aria-hidden className="size-3.5 shrink-0" />
                <span className="pixel-label text-[10px]">{label}</span>
              </dt>
              <dd className="pixel-numeral mt-1 text-2xl text-foreground">
                {value}
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
