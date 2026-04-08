"use client";

import Header from "@/components/header";
import LandingLiveStats from "@/components/landing/landing-live-stats";
import LandingFeatures from "@/components/landing/landing-features";
import LandingFooter from "@/components/landing/landing-footer";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AngkorWatWrapper } from "@/components/utils/animations/angkor-wat-wrapper";
import { Button } from "@/components/ui/button";
import {
  LucideArrowRight,
  LucideChevronDown,
  LucideSparkles,
} from "lucide-react";
import Link from "next/link";
import {
  useGsapHeroAnimation,
  useGsapScrollAnimation,
} from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";

export default function IndexPage() {
  /* ---------------------------------- Utils ---------------------------------- */
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const ctaRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <div className="relative bg-background">
      {/* Header Section */}
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40" />

      {/* Section 1: Hero */}
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

        {/* Hero Content Section */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Badge Section */}
            <div
              data-hero="badge"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm opacity-0 dark:border-amber-400/20 dark:bg-amber-400/5"
            >
              <LucideSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {t("badge")}
              </span>
            </div>

            {/* Heading Section */}
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

            {/* Description Section */}
            <TypographyMuted
              data-hero="description"
              className="!leading-relaxed text-base sm:text-lg md:text-xl max-w-[640px] opacity-0"
            >
              {t("heroDescription")}
            </TypographyMuted>

            {/* CTA Buttons Section */}
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

            {/* Live Statistic Section */}
            <div data-hero="stats" className="flex justify-center opacity-0">
              <LandingLiveStats />
            </div>
          </div>

          {/* Scroll Indicator Section */}
          <div
            data-hero="scroll"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-0"
          >
            <LucideChevronDown className="size-6 text-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Section 2: 3D Angkor Wat Render */}
      <section className="relative h-[50dvh] sm:h-[70dvh] md:h-[80dvh] lg:h-[85dvh] overflow-hidden">
        {/* Dotted Background Pattern Section */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] dark:opacity-[0.12] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Soft Top Blend Section */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />

        {/* 3D Scene Section */}
        <div className="absolute inset-0 z-[1]">
          <AngkorWatWrapper />
        </div>

        {/* Caption Overlay at Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pt-20 pb-10">
          <div className="mx-auto max-w-2xl text-center px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              {t("inspiredBy")}{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
                {t("angkorWat")}
              </span>
            </h2>
            <TypographyMuted className="text-sm sm:text-base max-w-lg mx-auto">
              {t("angkorWatDescription")}
            </TypographyMuted>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <LandingFeatures />

      {/* Section 4: How It Works */}
      <LandingHowItWorks />

      {/* Section 5: Final CTA */}
      <section
        ref={ctaRef}
        className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      >
        {/* Dotted Background Section  */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[160px] dark:bg-amber-400/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center px-4 sm:px-6">
          <h2
            data-gsap="split-words"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 !leading-[1.15] [perspective:800px]"
          >
            {t("ctaHeading")}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
              {t("ctaHeadingHighlight")}
            </span>
            ?
          </h2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-base sm:text-lg max-w-xl mx-auto mb-8"
          >
            {t("ctaDescription")}
          </TypographyMuted>
          <div
            data-gsap="fade-up"
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link href="/signup/option" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-10 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
              >
                {t("getStartedFree")}
                <LucideArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-10 border-amber-300/50 hover:bg-amber-50 hover:border-amber-400/50 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/40 transition-all"
              >
                {t("signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <LandingFooter />
    </div>
  );
}
