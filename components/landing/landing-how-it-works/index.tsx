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
      className="relative overflow-hidden border-b border-border"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] border-x border-border">
        {/* Header Section */}
        <div className="max-w-4xl px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <span
            data-gsap="fade-up"
            className="pixel-label mb-4 block text-muted-foreground"
          >
            {t("howItWorksHeading")} {t("howItWorksHeadingHighlight")} · 03
          </span>
          <TypographyH2
            data-gsap="split-words"
            className="pixel-display text-3xl [perspective:800px] sm:text-4xl lg:text-5xl"
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
          className="grid border-t border-border md:grid-cols-3"
        >
          {landingStepKeys.map((step, index) => (
            <article
              key={step.number}
              className="group relative min-h-[300px] border-b border-r border-border p-7 sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="pixel-display text-6xl text-foreground/10 transition-colors group-hover:text-foreground/20 sm:text-7xl">
                  {step.number}
                </span>
                <span className="pixel-label text-[10px] text-muted-foreground">
                  0{index + 1} / 03
                </span>
              </div>
              <div className="mt-16">
                <TypographyH3 className="mb-3 text-xl font-medium">
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
