"use client";

import LandingLiveStats from "@/components/landing/landing-live-stats";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import {
  LucideArrowRight,
  LucideChevronDown,
  LucideSparkles,
} from "lucide-react";
import Link from "next/link";
import { useGsapHeroAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";

export default function LandingHero() {
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const t = useTranslations("landing");

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-amber-500/20 blur-[140px] dark:bg-amber-400/15" />
        <div className="absolute right-[-100px] top-[-60px] h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[160px] dark:bg-indigo-400/20" />
        <div className="absolute right-[15%] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[140px] dark:bg-amber-300/8" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Badge */}
          <div
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm opacity-0 dark:border-amber-400/20 dark:bg-amber-400/5"
          >
            <LucideSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {t("badge")}
            </span>
          </div>

          {/* Heading */}
          <h1
            data-hero="heading"
            className="text-3xl phone-xl:text-2xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl !leading-[1.08] opacity-0"
          >
            {t("heroHeading1")} <br className="hidden sm:block" />
            {t("heroHeading2")}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
              {t("heroHeadingTalent")}
            </span>{" "}
            {t("heroHeadingAnd")}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
              {t("heroHeadingOpportunity")}
            </span>
          </h1>

          {/* Description */}
          <TypographyMuted
            data-hero="description"
            className="!leading-relaxed text-base sm:text-lg md:text-xl max-w-[640px] opacity-0"
          >
            {t("heroDescription")}
          </TypographyMuted>

          {/* CTA Buttons */}
          <div
            data-hero="cta"
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto opacity-0"
          >
            <Link href="/signup/option" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
              >
                {t("getStarted")}
                <LucideArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 border-amber-300/50 hover:bg-amber-50 hover:border-amber-400/50 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/40 transition-all"
              >
                {t("signIn")}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div data-hero="stats" className="flex justify-center opacity-0">
            <LandingLiveStats />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          data-hero="scroll"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-0"
        >
          <LucideChevronDown className="size-6 text-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
