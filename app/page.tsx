"use client";

import Header from "@/components/header";
import { LandingLiveStats } from "@/components/landing/landing-live-stats";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
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

export default function IndexPage() {
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const ctaRef = useGsapScrollAnimation<HTMLElement>();

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <div className="relative bg-background">
      {/* Header Section */}
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40" />

      {/* ═══════════════ Section 1: Hero ═══════════════ */}
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
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 pt-28 pb-20 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Badge */}
            <div
              data-hero="badge"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm opacity-0 dark:border-amber-400/20 dark:bg-amber-400/5"
            >
              <LucideSparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Cambodia&apos;s Premier Talent Platform
              </span>
            </div>

            {/* Heading */}
            <h1
              data-hero="heading"
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl !leading-[1.08] opacity-0"
            >
              Empowering Connections{" "}
              <br className="hidden sm:block" />
              Between{" "}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
                Talent
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
                Opportunity
              </span>
            </h1>

            {/* Description */}
            <TypographyMuted
              data-hero="description"
              className="!leading-relaxed text-base sm:text-lg md:text-xl max-w-[640px] opacity-0"
            >
              Whether you&apos;re a freelancer seeking new opportunities or a
              professional advancing your career, our platform connects you with
              the right opportunities.
            </TypographyMuted>

            {/* CTA Buttons */}
            <div
              data-hero="cta"
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 opacity-0"
            >
              <Link href="/signup/option">
                <Button
                  size="lg"
                  className="rounded-full px-8 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
                >
                  Get Started
                  <LucideArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-amber-300/50 hover:bg-amber-50 hover:border-amber-400/50 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/40 transition-all"
                >
                  Sign In
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

      {/* ═══════════════ Section 2: 3D Angkor Wat ═══════════════ */}
      <section className="relative h-[80dvh] sm:h-[85dvh] overflow-hidden">
        {/* Dotted background pattern */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] dark:opacity-[0.12] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Soft top blend */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />

        {/* 3D Scene */}
        <div className="absolute inset-0 z-[1]">
          <AngkorWatWrapper />
        </div>

        {/* Caption overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pt-20 pb-10">
          <div className="mx-auto max-w-2xl text-center px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Inspired by{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
                Angkor Wat
              </span>
            </h2>
            <TypographyMuted className="text-sm sm:text-base max-w-lg mx-auto">
              Like the timeless wonder of Angkor Wat, we build lasting
              connections between exceptional talent and great companies across
              Cambodia.
            </TypographyMuted>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 3: Features ═══════════════ */}
      <LandingFeatures />

      {/* ═══════════════ Section 4: How It Works ═══════════════ */}
      <LandingHowItWorks />

      {/* ═══════════════ Section 5: Final CTA ═══════════════ */}
      <section ref={ctaRef} className="relative py-24 sm:py-32 overflow-hidden">
        {/* Dotted background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[160px] dark:bg-amber-400/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center px-6">
          <h2
            data-gsap="split-words"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 !leading-[1.15] [perspective:800px]"
          >
            Ready to Find Your{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300">
              Perfect Match
            </span>
            ?
          </h2>
          <TypographyMuted data-gsap="fade-up" className="text-base sm:text-lg max-w-xl mx-auto mb-8">
            Join thousands of professionals and companies already using Apsara
            Talent to build their future.
          </TypographyMuted>
          <div data-gsap="fade-up" className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup/option">
              <Button
                size="lg"
                className="rounded-full px-10 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
              >
                Get Started for Free
                <LucideArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 border-amber-300/50 hover:bg-amber-50 hover:border-amber-400/50 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/40 transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ Footer ═══════════════ */}
      <LandingFooter />
    </div>
  );
}
