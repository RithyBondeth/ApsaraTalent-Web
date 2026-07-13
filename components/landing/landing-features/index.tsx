"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { landingFeatureKeys } from "@/utils/constants/landing.constant";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { cn } from "@/lib/utils";

/* --------------------------------- Constants -------------------------------- */
// Bento layout: wide cards at indexes 0, 3, 5 → rows of (2+1), (1+2), (1+2)
const WIDE_CARD_INDEXES = new Set([0, 3, 5]);

export default function LandingFeatures() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-32">
      {/* Dotted Background Section */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Features Section */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <span
            data-gsap="fade-up"
            className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3"
          >
            Features
          </span>
          <TypographyH2
            data-gsap="split-chars"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            {t("featuresHeading")}{" "}
            <span className="text-gold-animated">
              {t("featuresHeadingHighlight")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="blur-reveal"
            className="text-base sm:text-lg max-w-xl mx-auto"
          >
            {t("featuresDescription")}
          </TypographyMuted>
        </div>

        {/* Features Bento Grid Section: (3D Tilt + Cursor Spotlight) */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {landingFeatureKeys.map((feature, index) => (
            <div
              key={feature.titleKey}
              data-tilt-card
              className={cn(
                "card-spotlight group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 sm:p-7 transition-colors duration-300 hover:border-amber-400/40 dark:hover:border-amber-500/30",
                WIDE_CARD_INDEXES.has(index) && "lg:col-span-2",
              )}
            >
              {/* Hover Gradient Wash Section */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content Section */}
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center size-12 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-amber-600/5 text-amber-600 shadow-[0_0_24px_-8px_rgba(245,158,11,0.4)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:border-amber-400/15 dark:from-amber-400/10 dark:to-amber-500/5 dark:text-amber-400">
                  <feature.icon className="size-5" strokeWidth={1.8} />
                </div>
                <TypographyH3 className="text-lg font-semibold mb-2">
                  {t(feature.titleKey)}
                </TypographyH3>
                <TypographyMuted className="!text-sm !leading-relaxed">
                  {t(feature.descKey)}
                </TypographyMuted>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
