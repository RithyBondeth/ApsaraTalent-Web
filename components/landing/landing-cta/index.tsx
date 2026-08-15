"use client";

import { Button } from "@/components/ui/button";
import { GridRunners } from "@/components/ui/grid-runners";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { LucideArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LandingCta() {
  /* ---------------------------------- Utils --------------------------------- */
  const ctaRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section ref={ctaRef} className="bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div
        data-gsap="scale-up"
        className="landing-dark-panel relative mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      >
        {/* Grid Background Section */}
        <div className="landing-dark-grid pointer-events-none absolute inset-0" />
        <GridRunners className="landing-dark-grid-runners" density="quiet" />

        {/* CTA Heading Section */}
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="pixel-label mb-6 text-[hsl(var(--auth-ink)/0.55)]">
              {t("badge")}
            </p>
            <TypographyH2
              data-gsap="split-chars"
              className="pixel-display max-w-3xl text-3xl text-[hsl(var(--auth-ink))] [perspective:800px] sm:text-4xl lg:text-6xl"
            >
              {t("ctaHeading")} {t("ctaHeadingHighlight")}?
            </TypographyH2>
          </div>

          {/* CTA Description Section */}
          <div className="lg:justify-self-end">
            <p
              data-gsap="blur-reveal"
              className="mb-7 max-w-lg text-sm leading-relaxed text-[hsl(var(--auth-ink)/0.62)] sm:text-base"
            >
              {t("ctaDescription")}
            </p>

            {/* CTA Button Section */}
            <div
              data-gsap="fade-up"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/signup/option" data-magnetic>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-none bg-[hsl(var(--auth-ink))] px-7 text-[hsl(var(--auth-paper))] shadow-none hover:bg-[hsl(var(--auth-ink)/0.9)] sm:w-auto"
                >
                  {t("getStartedFree")}
                  <LucideArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login" data-magnetic>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-none border-[hsl(var(--auth-ink)/0.3)] bg-transparent px-7 text-[hsl(var(--auth-ink))] shadow-none hover:bg-[hsl(var(--auth-ink)/0.1)] hover:text-[hsl(var(--auth-ink))] sm:w-auto"
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
