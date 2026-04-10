"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { landingStepKeys } from "@/utils/constants/landing.constant";
import { useTranslations } from "next-intl";

export function LandingHowItWorks() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Dotted Background Section */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Background Accent Section */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/8 blur-[180px] dark:bg-amber-400/5" />
        <div className="absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/6 blur-[140px] dark:bg-indigo-400/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <span
            data-gsap="fade-up"
            className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3"
          >
            How It Works
          </span>
          <TypographyH2
            data-gsap="split-words"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            {t("howItWorksHeading")}{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              {t("howItWorksHeadingHighlight")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-base sm:text-lg max-w-lg mx-auto"
          >
            {t("howItWorksDescription")}
          </TypographyMuted>
        </div>

        {/* Steps Section */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
        >
          {landingStepKeys.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center md:text-left"
            >
              {/* Connector Line Section: (Desktop Only) */}
              {index < landingStepKeys.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-amber-400/40 to-amber-400/10 dark:from-amber-500/30 dark:to-amber-500/5" />
              )}

              {/* Step Number Section */}
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 dark:from-amber-400/10 dark:to-amber-500/5 dark:border-amber-400/15 mb-5">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
                  {step.number}
                </span>
              </div>

              <TypographyH3 className="text-xl font-semibold mb-2">
                {t(step.titleKey)}
              </TypographyH3>
              <TypographyMuted className="!text-sm !leading-relaxed max-w-xs mx-auto md:mx-0">
                {t(step.descKey)}
              </TypographyMuted>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
