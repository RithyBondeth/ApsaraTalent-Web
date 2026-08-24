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

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-14 max-w-3xl sm:mb-20">
          <span
            data-gsap="fade-up"
            className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
          >
            {t("howItWorksHeading")} {t("howItWorksHeadingHighlight")} · 03
          </span>
          <TypographyH2
            data-gsap="split-chars"
            className="text-3xl font-semibold tracking-[-0.035em] [perspective:800px] sm:text-4xl lg:text-5xl"
          >
            {t("howItWorksHeading")}{" "}
            <span className="landing-highlight">
              {t("howItWorksHeadingHighlight")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="blur-reveal"
            className="mt-5 max-w-xl text-sm !leading-relaxed sm:text-base"
          >
            {t("howItWorksDescription")}
          </TypographyMuted>
        </div>

        {/* Step Key Section */}
        <div
          data-gsap="stagger-children"
          className="grid border-l border-t border-border md:grid-cols-3"
        >
          {landingStepKeys.map((step, index) => (
            <article
              key={step.number}
              className="group relative min-h-[300px] border-b border-r border-border p-7 sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  data-decorative="true"
                  className="landing-step-watermark text-6xl font-semibold tracking-[-0.06em] text-foreground/10 transition-colors group-hover:text-foreground/20 sm:text-7xl"
                >
                  {step.number}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  0{index + 1} / 03
                </span>
              </div>
              <div className="mt-16">
                <TypographyH3 className="mb-3 text-xl font-semibold">
                  {t(step.titleKey)}
                </TypographyH3>
                <TypographyMuted className="!text-sm !leading-relaxed">
                  {t(step.descKey)}
                </TypographyMuted>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
