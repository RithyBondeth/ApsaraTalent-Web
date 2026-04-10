"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { landingFeatureKeys } from "@/utils/constants/landing.constant";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";

export default function LandingFeatures() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
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
            data-gsap="split-words"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            {t("featuresHeading")}{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              {t("featuresHeadingHighlight")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-base sm:text-lg max-w-xl mx-auto"
          >
            {t("featuresDescription")}
          </TypographyMuted>
        </div>

        {/* Features Grid Section */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {landingFeatureKeys.map((feature) => (
            <div
              key={feature.titleKey}
              className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 sm:p-7 transition-all duration-300 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:border-amber-500/30"
            >
              <div className="mb-4 inline-flex items-center justify-center size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 transition-colors group-hover:bg-amber-500/15">
                <feature.icon className="size-5" strokeWidth={1.8} />
              </div>
              <TypographyH3 className="text-lg font-semibold mb-2">
                {t(feature.titleKey)}
              </TypographyH3>
              <TypographyMuted className="!text-sm !leading-relaxed">
                {t(feature.descKey)}
              </TypographyMuted>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
