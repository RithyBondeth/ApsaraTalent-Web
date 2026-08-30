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
        "w-full border border-l-[5px] border-border border-l-primary bg-card px-6 py-6 sm:px-8",
        hasStats &&
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-5 tablet-md:grid-cols-1",
        className,
      )}
    >
      <div className="min-w-0">
        {/* Eyebrow Section */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
          {eyebrow}
        </div>

        {/* Title Section */}
        <h1 className="mt-3 max-w-[26ch] text-balance text-2xl font-black leading-[1.08] tracking-[-0.04em] text-foreground sm:text-3xl">
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
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  {label}
                </span>
              </dt>
              <dd className="mt-1 text-2xl font-black tabular-nums tracking-[-0.04em] text-foreground">
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
