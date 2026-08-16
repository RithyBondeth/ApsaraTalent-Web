"use client";

import { Button } from "@/components/ui/button";
import { PixelGridField } from "@/components/utils/brand/pixel-grid-field";
import { PixelPet } from "@/components/utils/brand/pixel-pet";
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
    <section ref={ctaRef} className="border-b border-border">
      <div
        data-gsap="scale-up"
        className="relative mx-auto grid max-w-[1600px] overflow-hidden border-x border-border lg:grid-cols-[7fr_3fr]"
      >
        <PixelGridField
          tone="paper"
          animated
          className="min-h-[360px]"
          contentClassName="min-h-[360px] overflow-hidden px-6 py-16 text-pixel-ink sm:px-10 sm:py-20 lg:px-14 lg:py-24"
        >
          <div className="relative z-10 max-w-4xl">
            <p className="pixel-label mb-6 text-pixel-ink/50">{t("badge")}</p>
            <TypographyH2
              data-gsap="split-words"
              className="max-w-4xl text-4xl font-normal !leading-[1.02] tracking-[-0.045em] text-pixel-ink [perspective:800px] sm:text-5xl lg:text-7xl"
            >
              {t("ctaHeading")} {t("ctaHeadingHighlight")}?
            </TypographyH2>
          </div>
          <PixelPet
            expression="smiling"
            height={136}
            className="absolute -bottom-1 right-12 z-10 h-28 w-auto sm:right-20 sm:h-36"
          />
        </PixelGridField>

        <div className="landing-hero-shell relative z-10 flex flex-col justify-end border-t border-[hsl(var(--landing-hero-ink)/0.14)] px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:p-10">
          <div>
            <p
              data-gsap="blur-reveal"
              className="mb-8 max-w-lg text-base leading-relaxed text-[hsl(var(--landing-hero-ink)/0.66)]"
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
                  className="h-12 w-full rounded-none bg-[hsl(var(--landing-hero-ink))] px-7 text-[hsl(var(--landing-hero-bg))] shadow-none hover:bg-[hsl(var(--landing-hero-ink)/0.88)] sm:w-auto"
                >
                  {t("getStartedFree")}
                  <LucideArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login" data-magnetic>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-none border-[hsl(var(--landing-hero-ink)/0.28)] bg-transparent px-7 text-[hsl(var(--landing-hero-ink))] shadow-none hover:bg-[hsl(var(--landing-hero-ink)/0.08)] hover:text-[hsl(var(--landing-hero-ink))] sm:w-auto"
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
