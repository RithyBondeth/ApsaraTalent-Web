"use client";

import LandingLiveStats from "@/components/landing/landing-live-stats";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { LucideArrowRight, LucideSparkles } from "lucide-react";
import Link from "next/link";
import { useGsapHeroAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";

/* --------------------------------- Constants -------------------------------- */
// Deterministic particle positions (no Math.random — keeps SSR hydration stable)
const HERO_PARTICLES = [
  { left: "8%", top: "24%", size: 5 },
  { left: "15%", top: "62%", size: 4 },
  { left: "22%", top: "38%", size: 3 },
  { left: "31%", top: "76%", size: 5 },
  { left: "38%", top: "18%", size: 4 },
  { left: "47%", top: "84%", size: 3 },
  { left: "55%", top: "18%", size: 4 },
  { left: "63%", top: "70%", size: 5 },
  { left: "71%", top: "30%", size: 3 },
  { left: "78%", top: "58%", size: 4 },
  { left: "86%", top: "22%", size: 5 },
  { left: "92%", top: "66%", size: 3 },
] as const;

export default function LandingHero() {
  /* ---------------------------------- Utils --------------------------------- */
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Atmosphere Background Section: (Mouse-Parallax Layers) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          data-hero-layer="1.4"
          className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-amber-500/20 blur-[140px] dark:bg-amber-400/15"
        />
        <div
          data-hero-layer="0.9"
          className="absolute right-[-100px] top-[-60px] h-[520px] w-[520px] rounded-full bg-amber-600/10 blur-[160px] dark:bg-indigo-400/20"
        />
        <div
          data-hero-layer="1.8"
          className="absolute right-[15%] bottom-[-100px] h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[140px] dark:bg-amber-300/8"
        />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Rotating Ring Decorations Section */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div data-hero-layer="0.5">
            <div className="animate-slow-rotate size-[34rem] sm:size-[46rem] rounded-full border border-dashed border-amber-500/15 dark:border-amber-400/10" />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div data-hero-layer="1.1">
            <div className="animate-slow-rotate-reverse size-[24rem] sm:size-[34rem] rounded-full border border-amber-500/10 dark:border-amber-400/[0.07]" />
          </div>
        </div>

        {/* Floating Particles Section */}
        {HERO_PARTICLES.map((particle, index) => (
          <span
            key={index}
            data-hero-particle
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            className="absolute rounded-full bg-amber-500/70 dark:bg-amber-300/60 opacity-0"
          />
        ))}
      </div>

      {/* Hero Content Section: (Scroll-Exit Target) */}
      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 text-center"
      >
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

          {/* Heading Section: (Grapheme Cascade + Gold Shimmer) */}
          <TypographyH1
            data-hero="heading"
            className="text-3xl phone-xl:text-2xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl !leading-[1.08] opacity-0"
          >
            {t("heroHeading1")} <br className="hidden sm:block" />
            {t("heroHeading2")}{" "}
            <span className="text-gold-animated">{t("heroHeadingTalent")}</span>{" "}
            {t("heroHeadingAnd")}{" "}
            <span className="text-gold-animated">
              {t("heroHeadingOpportunity")}
            </span>
          </TypographyH1>

          {/* Description Section */}
          <TypographyMuted
            data-hero="description"
            className="!leading-relaxed text-base sm:text-lg md:text-xl max-w-[640px] opacity-0"
          >
            {t("heroDescription")}
          </TypographyMuted>

          {/* CTA Buttons Section: (Magnetic on Fine Pointers) */}
          <div
            data-hero="cta"
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto opacity-0"
          >
            <Link
              href="/signup/option"
              data-magnetic
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
              >
                {t("getStarted")}
                <LucideArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login" data-magnetic className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 border-amber-300/50 hover:bg-amber-50 hover:border-amber-400/50 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/40 transition-all"
              >
                {t("signIn")}
              </Button>
            </Link>
          </div>

          {/* Statistics Section */}
          <div data-hero="stats" className="flex justify-center opacity-0">
            <LandingLiveStats />
          </div>
        </div>

        {/* Scroll Indicator Section: (Mouse Wheel) */}
        <div
          data-hero="scroll"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        >
          <div className="relative h-9 w-6 rounded-full border-2 border-muted-foreground/30">
            <span className="animate-scroll-wheel-dot absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-amber-500/80 dark:bg-amber-400/80" />
          </div>
        </div>
      </div>
    </section>
  );
}
