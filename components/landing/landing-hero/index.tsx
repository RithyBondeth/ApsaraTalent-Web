"use client";

import LandingLiveStats from "@/components/landing/landing-live-stats";
import { Button } from "@/components/ui/button";
import { PixelGridField } from "@/components/utils/brand/pixel-grid-field";
import { PixelPet } from "@/components/utils/brand/pixel-pet";
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

const HERO_FEATURES = [
  { key: "featureSmartMatching", icon: LucideSearch, number: "01" },
  { key: "featureResumeBuilder", icon: LucideFileText, number: "02" },
  { key: "featureRealTimeChat", icon: LucideMessageCircle, number: "03" },
] as const;

export default function LandingHero() {
  const heroRef = useGsapHeroAnimation<HTMLElement>();
  const t = useTranslations("landing");

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-border pt-16"
    >
      <div className="landing-hero-shell relative mx-auto max-w-[1600px] border-x border-[hsl(var(--landing-hero-ink)/0.14)]">
        <div className="grid border-b border-[hsl(var(--landing-hero-ink)/0.14)] lg:grid-cols-[7fr_3fr]">
          <div
            data-hero-content
            className="flex min-h-[430px] flex-col justify-between px-6 py-10 sm:px-10 sm:py-14 lg:min-h-[500px] lg:px-14 lg:py-12 xl:px-16"
          >
            <div
              data-hero="badge"
              className="flex items-center gap-3 opacity-0"
            >
              <span aria-hidden className="flex shrink-0">
                <span className="size-2 bg-pixel-2" />
                <span className="size-2 bg-pixel-4" />
                <span className="size-2 bg-pixel-6" />
              </span>
              <span className="pixel-label text-[hsl(var(--landing-hero-ink)/0.5)]">
                {t("badge")}
              </span>
            </div>

            <TypographyH1
              data-hero="heading"
              className="max-w-5xl text-5xl font-normal !leading-[0.95] tracking-[-0.055em] text-[hsl(var(--landing-hero-ink))] opacity-0 sm:text-6xl md:text-7xl lg:text-[5.75rem] xl:text-[6.6rem]"
            >
              {t("heroHeadingTalent")}.<br />
              {t("heroHeadingOpportunity")}.<br />
              <span className="text-[hsl(var(--landing-hero-ink)/0.42)]">
                Connected.
              </span>
            </TypographyH1>
          </div>

          <div className="flex min-h-[310px] flex-col justify-end border-t border-[hsl(var(--landing-hero-ink)/0.14)] bg-[hsl(var(--landing-hero-ink)/0.035)] px-6 py-10 sm:px-10 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-9 xl:p-11">
            <TypographyMuted
              data-hero="description"
              className="max-w-md text-lg !leading-[1.35] text-[hsl(var(--landing-hero-ink)/0.82)] opacity-0 sm:text-xl lg:text-[1.35rem]"
            >
              {t("heroDescription")}
            </TypographyMuted>

            <div
              data-hero="cta"
              className="mt-8 flex flex-col gap-2 opacity-0 sm:flex-row"
            >
              <Link href="/signup/option" className="flex-1" data-magnetic>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-none bg-[hsl(var(--landing-hero-ink))] px-6 text-[hsl(var(--landing-hero-bg))] shadow-none hover:bg-[hsl(var(--landing-hero-ink)/0.88)]"
                >
                  {t("getStarted")}
                  <LucideArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login" data-magnetic>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-none border-[hsl(var(--landing-hero-ink)/0.28)] bg-transparent px-6 text-[hsl(var(--landing-hero-ink))] shadow-none hover:bg-[hsl(var(--landing-hero-ink)/0.08)] hover:text-[hsl(var(--landing-hero-ink))]"
                >
                  {t("signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[7fr_3fr]">
          <PixelGridField
            tone="orange"
            animated
            hero
            className="min-h-[330px] border-b border-[hsl(var(--landing-hero-ink)/0.14)] lg:border-b-0"
            contentClassName="min-h-[330px]"
          >
            <span className="pixel-label absolute left-6 top-6 text-pixel-ink/60 sm:left-10">
              People first · Technology with purpose
            </span>
            <div
              data-hero-pet
              className="absolute -bottom-2 right-[7%] h-[72%]"
            >
              <PixelPet
                expression="smiling"
                height={224}
                label="Neak, the Apsara Talent mascot"
                className="h-full w-auto drop-shadow-[12px_12px_0_hsl(var(--pixel-ink)/0.12)]"
              />
            </div>
            <span className="pixel-label absolute bottom-6 left-6 text-pixel-ink sm:left-10">
              Phnom Penh · Cambodia
            </span>
          </PixelGridField>

          <div className="border-[hsl(var(--landing-hero-ink)/0.14)] lg:border-l">
            <div data-hero="stats" className="px-6 py-7 opacity-0 sm:px-10">
              <LandingLiveStats inverted />
            </div>
            <div className="border-t border-[hsl(var(--landing-hero-ink)/0.14)]">
              {HERO_FEATURES.map((feature) => (
                <Link
                  href="/signup/option"
                  key={feature.key}
                  className="group grid grid-cols-[38px_1fr_auto] items-center gap-3 border-b border-[hsl(var(--landing-hero-ink)/0.14)] px-6 py-5 text-[hsl(var(--landing-hero-ink))] transition-colors last:border-b-0 hover:bg-[hsl(var(--landing-hero-ink)/0.07)] sm:px-10"
                >
                  <span className="pixel-numeral text-[10px] text-[hsl(var(--landing-hero-ink)/0.38)]">
                    {feature.number}
                  </span>
                  <span className="text-sm sm:text-base">{t(feature.key)}</span>
                  <feature.icon
                    className="size-4 text-[hsl(var(--landing-hero-ink)/0.48)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[hsl(var(--landing-hero-ink))]"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
