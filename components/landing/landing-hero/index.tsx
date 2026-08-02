"use client";

import LandingLiveStats from "@/components/landing/landing-live-stats";
import { Button } from "@/components/ui/button";
import { GridRunners } from "@/components/ui/grid-runners";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapHeroAnimation } from "@/hooks/utils/use-gsap-animation";
import {
  LucideArrowRight,
  LucideFileText,
  LucideMessageCircle,
  LucideSearch,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

/* --------------------------------- Constants -------------------------------- */
const HERO_FEATURES = [
  { key: "featureSmartMatching", icon: LucideSearch, number: "01" },
  { key: "featureResumeBuilder", icon: LucideFileText, number: "02" },
  { key: "featureRealTimeChat", icon: LucideMessageCircle, number: "03" },
] as const;

export default function LandingHero() {
  /* ---------------------------------- Utils --------------------------------- */
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] overflow-hidden border-b border-border pt-[72px]"
    >
      {/* Grid Background Section */}
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <GridRunners className="landing-grid-runners" density="quiet" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl border-x border-border lg:grid-cols-[1.08fr_0.92fr]"> 
        {/* Hero Content Section */}
        <div
          data-hero-content
          className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-14 lg:py-24"
        >
          {/* Badge Section */}
          <div
            data-hero="badge"
            className="mb-7 flex items-center gap-3 opacity-0"
          >
            <span className="h-px w-8 bg-foreground" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {t("badge")}
            </span>
          </div>

          {/* Heading Section */}
          <TypographyH1
            data-hero="heading"
            className="max-w-3xl text-4xl font-bold tracking-[-0.04em] opacity-0 sm:text-5xl md:text-6xl lg:text-[4.25rem] !leading-[1.02]"
          >
            {t("heroHeading1")} <br />
            {t("heroHeading2")} {t("heroHeadingTalent")} {t("heroHeadingAnd")}{" "}
            <span className="landing-highlight">
              {t("heroHeadingOpportunity")}
            </span>
          </TypographyH1>

          {/* Description Section */} 
          <TypographyMuted
            data-hero="description"
            className="mt-7 max-w-xl text-base !leading-relaxed opacity-0 sm:text-lg"
          >
            {t("heroDescription")}
          </TypographyMuted>

          
          {/* CTA Buttons Section */}
          <div
            data-hero="cta"
            className="mt-9 flex w-full flex-col gap-3 opacity-0 sm:w-auto sm:flex-row"
          >
            <Link href="/signup/option" data-magnetic>
              <Button
                size="lg"
                className="h-12 w-full rounded-none px-7 shadow-none sm:w-auto"
              >
                {t("getStarted")}
                <LucideArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login" data-magnetic>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-none border-foreground/25 bg-transparent px-7 shadow-none sm:w-auto"
              >
                {t("signIn")}
              </Button>
            </Link>
          </div>

          {/* Statistics Section */}
          <div data-hero="stats" className="mt-10 opacity-0">
            <LandingLiveStats />
          </div>
        </div>

        {/* Feature Card Section */}
        <div className="landing-dark-panel landing-swap-panel relative flex min-h-[560px] flex-col overflow-hidden border-t border-border p-6 sm:p-10 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-12">
          <div className="landing-dark-grid pointer-events-none absolute inset-0" />
          <GridRunners className="landing-swap-grid-runners" density="quiet" />
          <div className="relative z-10 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--landing-panel-ink)/0.55)]">
            <span>Apsara Talent</span>
            <span>Phnom Penh · KH</span>
          </div>

          <div className="relative z-10 my-auto py-14">
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[hsl(var(--landing-panel-ink)/0.55)]">
              {t("featuresDescription")}
            </p>
            <div className="border-t border-[hsl(var(--landing-panel-ink)/0.15)]">
              {HERO_FEATURES.map((feature) => (
                <div
                  key={feature.key}
                  className="group grid grid-cols-[40px_1fr_auto] items-center gap-4 border-b border-[hsl(var(--landing-panel-ink)/0.15)] py-5 transition-colors hover:bg-[hsl(var(--landing-panel-ink)/0.04)]"
                >
                  <span className="text-xs tabular-nums text-[hsl(var(--landing-panel-ink)/0.35)]">
                    {feature.number}
                  </span>
                  <span className="text-base font-medium text-[hsl(var(--landing-panel-ink))] sm:text-lg">
                    {t(feature.key)}
                  </span>
                  <feature.icon
                    className="size-5 text-[hsl(var(--landing-panel-ink)/0.45)] transition-colors group-hover:text-[hsl(var(--landing-panel-ink))]"
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-end border-t border-[hsl(var(--landing-panel-ink)/0.15)] pt-6">
            <span className="text-xs text-[hsl(var(--landing-panel-ink)/0.45)]">
              {t("heroHeadingTalent")} ↔ {t("heroHeadingOpportunity")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
