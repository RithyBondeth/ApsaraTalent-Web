"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { LucideArrowRight, LucideSparkles } from "lucide-react";
import Link from "next/link";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";

export default function LandingCta() {
  /* ---------------------------------- Utils --------------------------------- */
  const ctaRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section
      ref={ctaRef}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Dotted Background Section */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[160px] dark:bg-amber-400/10" />
      </div>

      {/* CTA Card Section: (Rotating Conic Border) */}
      <div
        data-gsap="scale-up"
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6"
      >
        <div className="cta-border-glow rounded-[2.5rem] p-px shadow-2xl shadow-amber-500/10">
          <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-background/95 backdrop-blur-xl px-6 py-14 sm:px-12 sm:py-20 text-center">
            {/* Inner Glow Section */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-500/15 blur-[90px] dark:bg-amber-400/10" />

            {/* Floating Sparkles Section */}
            <LucideSparkles
              aria-hidden
              className="pointer-events-none absolute left-[9%] top-[18%] size-5 text-amber-500/40 dark:text-amber-400/30 [animation:float_5s_ease-in-out_infinite]"
            />
            <LucideSparkles
              aria-hidden
              className="pointer-events-none absolute right-[11%] bottom-[20%] size-4 text-amber-500/30 dark:text-amber-400/25 [animation:float_6s_ease-in-out_1.2s_infinite]"
            />

            {/* CTA Heading Section */}
            <TypographyH2
              data-gsap="split-chars"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 !leading-[1.15] [perspective:800px]"
            >
              {t("ctaHeading")}{" "}
              <span className="text-gold-animated">
                {t("ctaHeadingHighlight")}
              </span>
              ?
            </TypographyH2>

            {/* CTA Description Section */}
            <TypographyMuted
              data-gsap="blur-reveal"
              className="text-base sm:text-lg max-w-xl mx-auto mb-8"
            >
              {t("ctaDescription")}
            </TypographyMuted>

            {/* CTA Button Section: (Magnetic on Fine Pointers) */}
            <div
              data-gsap="fade-up"
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Link
                href="/signup/option"
                data-magnetic
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-10 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all dark:from-amber-500 dark:to-amber-400 dark:hover:from-amber-600 dark:hover:to-amber-500 dark:text-black"
                >
                  {t("getStartedFree")}
                  <LucideArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login" data-magnetic className="w-full sm:w-auto">
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
        </div>
      </div>
    </section>
  );
}
