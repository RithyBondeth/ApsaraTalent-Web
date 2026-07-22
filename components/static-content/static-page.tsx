import type { ReactNode } from "react";
import Header from "@/components/header";
import LandingFooter from "@/components/landing/landing-footer";
import { GridRunners } from "@/components/ui/grid-runners";
import { ScrollProgress } from "@/components/utils/animations/scroll-progress";

export type StaticPageTocItem = {
  id: string;
  label: string;
};

type StaticPageShellProps = {
  pageNumber: string;
  pageTotal?: string;
  title: string;
  subtitle: ReactNode;
  tocHeading: string;
  toc: StaticPageTocItem[];
  icon: ReactNode;
  meta?: ReactNode;
  heroVisual?: ReactNode;
  children: ReactNode;
};

export function StaticPageShell({
  pageNumber,
  pageTotal = "04",
  title,
  subtitle,
  tocHeading,
  toc,
  icon,
  meta,
  heroVisual,
  children,
}: StaticPageShellProps) {
  return (
    <div className="landing-scope static-page-scope relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl" />

      <section className="relative overflow-hidden border-b border-border pt-[72px]">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <GridRunners className="landing-grid-runners" density="quiet" />

        <div className="relative mx-auto grid min-h-[420px] max-w-7xl border-x border-border lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="static-page-reveal flex items-center gap-3">
              <span className="h-px w-8 bg-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Apsara Talent · {pageNumber}
              </span>
            </div>

            <h1 className="static-page-reveal static-page-reveal-delay mt-6 max-w-3xl text-3xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-[3.75rem]">
              {title}
            </h1>
            <p className="static-page-reveal static-page-reveal-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
            {meta ? (
              <div className="static-page-reveal static-page-reveal-delay-2 mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                {meta}
              </div>
            ) : null}
          </div>

          <div className="landing-swap-panel relative flex min-h-[350px] flex-col overflow-hidden border-t border-border p-6 sm:p-8 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-9">
            <div className="landing-dark-grid pointer-events-none absolute inset-0" />
            <GridRunners
              className="landing-swap-grid-runners"
              density="quiet"
            />

            <div className="relative z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--landing-panel-ink)/0.52)]">
              <span>{title}</span>
              <span>{pageNumber} / {pageTotal}</span>
            </div>

            <div className="relative z-10 my-auto flex items-center justify-center py-6">
              {heroVisual ? (
                <div className="static-page-legal-visual">{heroVisual}</div>
              ) : (
                <div className="static-page-orbit">
                  <div className="static-page-orbit-ring static-page-orbit-ring-one" />
                  <div className="static-page-orbit-ring static-page-orbit-ring-two" />
                  <div className="static-page-hero-icon">{icon}</div>
                </div>
              )}
            </div>

            <div className="relative z-10 border-t border-[hsl(var(--landing-panel-ink)/0.16)]">
              <div className="py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--landing-panel-ink)/0.45)]">
                {tocHeading}
              </div>
              <div className="grid grid-cols-2 border-t border-[hsl(var(--landing-panel-ink)/0.16)]">
                {toc.slice(0, 4).map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="group flex min-h-14 items-center gap-3 border-b border-[hsl(var(--landing-panel-ink)/0.16)] px-3 text-xs transition-colors odd:border-r hover:bg-[hsl(var(--landing-panel-ink)/0.06)]"
                  >
                    <span className="text-[10px] tabular-nums text-[hsl(var(--landing-panel-ink)/0.35)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="line-clamp-1 text-[hsl(var(--landing-panel-ink)/0.75)] transition-colors group-hover:text-[hsl(var(--landing-panel-ink))]">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl border-x border-border">
        <nav
          aria-label={tocHeading}
          className="static-page-mobile-toc flex gap-1 overflow-x-auto border-b border-border p-3 lg:hidden"
        >
          {toc.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
            >
              <span className="mr-2 text-[10px] tabular-nums opacity-50">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-border lg:block">
            <nav aria-label={tocHeading} className="sticky top-[104px] p-8">
              <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tocHeading}
              </span>
              <div className="border-t border-border">
                {toc.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="group grid grid-cols-[28px_1fr] gap-2 border-b border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="text-[10px] tabular-nums opacity-45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}

type StaticSectionProps = {
  id: string;
  number: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export function StaticSection({
  id,
  number,
  icon,
  title,
  children,
}: StaticSectionProps) {
  return (
    <section
      id={id}
      className="static-page-section scroll-mt-24 border-b border-border px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      <div className="grid gap-6 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-8">
        <div className="flex size-12 items-center justify-center border border-border bg-muted/45 text-foreground sm:size-14">
          <span className="[&>svg]:size-5 [&>svg]:stroke-[1.5]">{icon}</span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Section {number}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            {title}
          </h2>
          <div className="static-page-copy mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StaticBullet({ children }: { children: ReactNode }) {
  return (
    <li className="grid grid-cols-[22px_1fr] items-start gap-3 border-b border-border/65 py-3 first:border-t">
      <span className="mt-[0.45rem] flex size-3 items-center justify-center border border-foreground/30">
        <span className="size-1 bg-foreground/65" />
      </span>
      <span>{children}</span>
    </li>
  );
}

type StaticCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
};

export function StaticCard({
  icon,
  title,
  description,
  footer,
}: StaticCardProps) {
  return (
    <article className="static-page-card group flex min-h-full flex-col border border-border bg-card/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:bg-card sm:p-6">
      <div className="flex size-10 items-center justify-center border border-border bg-muted/60 text-foreground transition-colors group-hover:border-foreground/25 group-hover:bg-foreground group-hover:text-background">
        <span className="[&>svg]:size-4 [&>svg]:stroke-[1.6]">{icon}</span>
      </div>
      <h3 className="mt-5 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {footer ? <div className="mt-auto pt-5">{footer}</div> : null}
    </article>
  );
}

type StaticStepProps = {
  step: number;
  title: string;
  description: string;
};

export function StaticStep({ step, title, description }: StaticStepProps) {
  return (
    <div className="static-page-step relative grid grid-cols-[48px_1fr] gap-4 pb-6 last:pb-0">
      <div className="relative z-10 flex size-10 items-center justify-center border border-foreground/25 bg-background text-xs font-semibold tabular-nums text-foreground">
        {String(step).padStart(2, "0")}
      </div>
      <div className="pt-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export function StaticNote({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="static-page-note mt-2 flex items-start gap-3 border border-foreground/15 bg-foreground/[0.035] px-4 py-4 text-foreground">
      <span className="mt-0.5 shrink-0 [&>svg]:size-4 [&>svg]:stroke-[1.6]">
        {icon}
      </span>
      <div className="text-xs font-medium leading-relaxed">{children}</div>
    </div>
  );
}

export function StaticPageArtworkSlot({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div
      className="static-page-artwork-slot"
      role="img"
      aria-label={`${label} artwork`}
    >
      <div className="static-page-artwork-slot-grid" />
      <div className="static-page-artwork-slot-mark">
        <span className="[&>svg]:size-8 [&>svg]:stroke-[1.25]">{icon}</span>
      </div>
      <div className="relative z-10 mt-auto flex w-full items-end justify-between border-t border-[hsl(var(--landing-panel-ink)/0.16)] pt-4">
        <span className="text-xs font-medium text-[hsl(var(--landing-panel-ink)/0.8)]">
          {label}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--landing-panel-ink)/0.38)]">
          Apsara Talent
        </span>
      </div>
    </div>
  );
}
