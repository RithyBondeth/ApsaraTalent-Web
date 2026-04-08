"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { LucideArrowRight } from "lucide-react";
import Link from "next/link";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";

export default function LandingCta() {
  const ctaRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  return (
    <section
      ref={ctaRef}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Dotted Background */}
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
  );
}
