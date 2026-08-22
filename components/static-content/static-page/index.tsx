import Header from "@/components/landing/landing-header";
import LandingFooter from "@/components/landing/landing-footer";
import { GridRunners } from "@/components/ui/grid-runners";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import {
  IStaticBulletProps,
  IStaticCardProps,
  IStaticNoteProps,
  IStaticPageShellProps,
  IStaticSectionProps,
  IStaticStepProps,
} from "./props";

export function StaticPageShell(props: IStaticPageShellProps) {
  /* ------------------------------- Props ------------------------------- */
  const { pageNumber, title, subtitle, tocHeading, toc, stats, children } =
    props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="landing-scope static-page-scope relative min-h-screen bg-background text-foreground">
      {/* Page Progress Section */}
      <ScrollProgressBar />

      {/* Page Header Section */}
      <Header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl" />

      {/* Page Hero Section */}
      {/* The hero used to be a two-column split whose right half was a dark
          panel holding a decorative artwork box, the page number as "06 / 06",
          a repeat of the title (twice), and four of the sixteen contents links
          already listed in the sidebar below — no information that was not
          elsewhere on screen, for 45% of the banner. It is now the same
          PageBanner every signed-in page uses, and the space goes to metadata a
          reader of a policy actually wants. Same reasoning, and the same
          component, as the hero illustrations that were removed app-wide. */}
      <section className="relative overflow-hidden border-b border-border pt-[72px]">
        {/* Hero Background Animation Section */}
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <GridRunners className="landing-grid-runners" density="quiet" />

        {/* Hero Banner Section */}
        <div className="relative mx-auto max-w-7xl border-x border-border px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <PageBanner
            eyebrow={`Apsara Talent · ${pageNumber}`}
            title={title}
            subtitle={subtitle}
            stats={stats}
          />
        </div>
      </section>

      {/* Page Content Section */}
      <div className="mx-auto max-w-7xl border-x border-border">
        {/* Mobile Table of Contents Section */}
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
              <span className="mr-2 text-[10px] tabular-nums text-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Content Grid Section */}
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Desktop Table of Contents Section */}
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
                    <span className="text-[10px] tabular-nums text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Article Content Section */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      {/* Page Footer Section */}
      <LandingFooter />
    </div>
  );
}

export function StaticSection(props: IStaticSectionProps) {
  /* ------------------------------- Props ------------------------------- */
  const { id, number, icon, title, children } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <section
      id={id}
      className="static-page-section scroll-mt-24 border-b border-border px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      {/* Static Content Section */}
      <div className="grid gap-6 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-8">
        {/* Section Icon Section */}
        <div className="flex size-12 items-center justify-center border border-border bg-muted/45 text-foreground sm:size-14">
          <span className="[&>svg]:size-5 [&>svg]:stroke-[1.5]">{icon}</span>
        </div>
        {/* Section Copy Section */}
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

export function StaticBullet(props: IStaticBulletProps) {
  /* ------------------------------- Props ------------------------------- */
  const { children } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <li className="grid grid-cols-[22px_1fr] items-start gap-3 border-b border-border/65 py-3 first:border-t">
      {/* Static Bullet Item Section */}
      {/* Bullet Marker Section */}
      <span className="mt-[0.45rem] flex size-3 items-center justify-center border border-foreground/30">
        <span className="size-1 bg-foreground/65" />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function StaticCard(props: IStaticCardProps) {
  /* ------------------------------- Props ------------------------------- */
  const { icon, title, description, footer } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <article className="static-page-card group flex min-h-full flex-col border border-border bg-card/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:bg-card sm:p-6">
      {/* Static Information Card Section */}
      {/* Card Icon Section */}
      <div className="flex size-10 items-center justify-center border border-border bg-muted/60 text-foreground transition-colors group-hover:border-foreground/25 group-hover:bg-foreground group-hover:text-background">
        <span className="[&>svg]:size-4 [&>svg]:stroke-[1.6]">{icon}</span>
      </div>
      {/* Card Content Section */}
      <h3 className="mt-5 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {footer ? <div className="mt-auto pt-5">{footer}</div> : null}
    </article>
  );
}

export function StaticStep(props: IStaticStepProps) {
  /* ------------------------------- Props ------------------------------- */
  const { step, title, description } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="static-page-step relative grid grid-cols-[48px_1fr] gap-4 pb-6 last:pb-0">
      {/* Static Step Section */}
      {/* Step Number Section */}
      <div className="relative z-10 flex size-10 items-center justify-center border border-foreground/25 bg-background text-xs font-semibold tabular-nums text-foreground">
        {String(step).padStart(2, "0")}
      </div>
      {/* Step Content Section */}
      <div className="pt-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export function StaticNote(props: IStaticNoteProps) {
  /* ------------------------------- Props ------------------------------- */
  const { icon, children } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="static-page-note mt-2 flex items-start gap-3 border border-foreground/15 bg-foreground/[0.035] px-4 py-4 text-foreground">
      {/* Static Note Section */}
      {/* Note Icon Section */}
      <span className="mt-0.5 shrink-0 [&>svg]:size-4 [&>svg]:stroke-[1.6]">
        {icon}
      </span>
      <div className="text-xs font-medium leading-relaxed">{children}</div>
    </div>
  );
}
