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
            data-gsap="split-chars"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            {t("howItWorksHeading")}{" "}
            <span className="text-gold-animated">
              {t("howItWorksHeadingHighlight")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="blur-reveal"
            className="text-base sm:text-lg max-w-lg mx-auto"
          >
            {t("howItWorksDescription")}
          </TypographyMuted>
        </div>

        {/* Steps Section: (Scroll-Drawn Connector Path) */}
        <div className="relative">
          {/* Drawn Connector Path Section: (Desktop Only) */}
          <svg
            data-gsap-draw
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute -top-12 left-0 hidden md:block h-40 w-full"
          >
            <defs>
              <linearGradient
                id="hiw-line-gradient"
                x1="0"
                y1="0"
                x2="1200"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#d97706" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="1" stopColor="#eab308" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              data-draw-path
              d="M 200 84 C 330 24 470 144 600 84 C 730 24 870 144 1000 84"
              stroke="url(#hiw-line-gradient)"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
            {/* Traveling Glow Dot Section */}
            <g data-draw-traveler transform="translate(200 84)">
              <circle r="10" fill="#f59e0b" opacity="0.25" />
              <circle r="4" fill="#f59e0b" />
            </g>
          </svg>

          <div
            data-gsap="stagger-children"
            className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10"
          >
            {landingStepKeys.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Ghost Number Section */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 select-none text-[6.5rem] font-extrabold leading-none text-amber-500/[0.07] dark:text-amber-400/[0.06]"
                >
                  {step.number}
                </span>

                {/* Step Number Section */}
                <div className="relative z-10 inline-flex items-center justify-center size-16 rounded-2xl bg-background mb-5 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-amber-600/5 shadow-[0_0_28px_-8px_rgba(245,158,11,0.45)] dark:border-amber-400/15 dark:from-amber-400/10 dark:to-amber-500/5" />
                  <span className="relative text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
                    {step.number}
                  </span>
                </div>

                <TypographyH3 className="text-xl font-semibold mb-2">
                  {t(step.titleKey)}
                </TypographyH3>
                <TypographyMuted className="!text-sm !leading-relaxed max-w-xs mx-auto">
                  {t(step.descKey)}
                </TypographyMuted>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
