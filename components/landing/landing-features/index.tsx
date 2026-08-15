"use client";

import { GridRunners } from "@/components/ui/grid-runners";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { cn } from "@/lib/utils";
import { landingFeatureKeys } from "@/utils/constants/landing.constant";
import { useTranslations } from "next-intl";

/* --------------------------------- Constants -------------------------------- */
const WIDE_CARD_INDEXES = new Set([0, 3, 5]);

export default function LandingFeatures() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative border-b border-border py-20 sm:py-28 lg:py-36"
    >
      {/* Grid Background Section */}
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <GridRunners className="landing-grid-runners" density="quiet" />

      {/* Features Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 border-b border-border pb-10 sm:mb-16 md:grid-cols-[1fr_0.7fr] md:items-end">
          {/* Feature Header Section */}
          <div>
            <span
              data-gsap="fade-up"
              className="pixel-label mb-4 block text-muted-foreground"
            >
              {t("featuresHeadingHighlight")} · 06
            </span>
            <TypographyH2
              data-gsap="split-chars"
              className="pixel-display max-w-2xl text-3xl [perspective:800px] sm:text-4xl lg:text-5xl"
            >
              {t("featuresHeading")}{" "}
              <span className="landing-highlight">
                {t("featuresHeadingHighlight")}
              </span>
            </TypographyH2>
          </div>

          {/* Feature Description Section */}
          <TypographyMuted
            data-gsap="blur-reveal"
            className="max-w-lg text-sm !leading-relaxed sm:text-base md:justify-self-end"
          >
            {t("featuresDescription")}
          </TypographyMuted>
        </div>

        {/* Feature Cards Section */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {landingFeatureKeys.map((feature, index) => (
            <article
              key={feature.titleKey}
              className={cn(
                "landing-feature-card group relative min-h-[250px] overflow-hidden border-b border-r border-border bg-card/35 p-6 sm:p-8",
                WIDE_CARD_INDEXES.has(index) && "lg:col-span-2",
              )}
            >
              <div className="flex items-start justify-between">
                <span className="pixel-numeral text-xs text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="grid size-11 place-items-center border border-border bg-background text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <feature.icon className="size-5" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-16 max-w-md">
                <TypographyH3 className="mb-3 text-xl font-semibold tracking-tight">
                  {t(feature.titleKey)}
                </TypographyH3>
                <TypographyMuted className="!text-sm !leading-relaxed">
                  {t(feature.descKey)}
                </TypographyMuted>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
