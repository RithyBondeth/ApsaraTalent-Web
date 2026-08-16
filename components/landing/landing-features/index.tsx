"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { PixelGridField } from "@/components/utils/brand/pixel-grid-field";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { cn } from "@/lib/utils";
import { landingFeatureKeys } from "@/utils/constants/landing.constant";
import { useTranslations } from "next-intl";

/* --------------------------------- Constants -------------------------------- */
const WIDE_CARD_INDEXES = new Set([0, 3, 5]);

export default function LandingFeatures() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section ref={sectionRef} className="relative border-b border-border">
      {/* Grid Background Section */}

      {/* Features Section */}
      <div className="relative z-10 mx-auto max-w-[1600px] border-x border-border">
        <div className="grid gap-6 border-b border-border px-6 py-16 sm:px-10 sm:py-20 md:grid-cols-[1fr_0.7fr] md:items-end lg:px-14 lg:py-24">
          {/* Feature Header Section */}
          <div>
            <span
              data-gsap="fade-up"
              className="pixel-label mb-4 block text-muted-foreground"
            >
              {t("featuresHeadingHighlight")} · 06
            </span>
            <TypographyH2
              data-gsap="split-words"
              className="pixel-display max-w-2xl text-3xl [perspective:800px] sm:text-4xl lg:text-5xl"
            >
              {t("featuresHeading")}{" "}
              <span className="landing-highlight">
                {t("featuresHeadingHighlight")}
              </span>
            </TypographyH2>
          </div>

          {/* Feature Description Section */}
          <TypographyMuted
            data-gsap="blur-reveal"
            className="max-w-lg text-sm !leading-relaxed sm:text-base md:justify-self-end"
          >
            {t("featuresDescription")}
          </TypographyMuted>
        </div>

        <PixelGridField
          tone="blue"
          animated
          className="border-b border-border"
          contentClassName="flex min-h-[300px] items-end px-6 py-8 sm:px-10 sm:py-10 lg:px-14"
        >
          <div className="mx-auto w-full max-w-5xl border border-pixel-ink/20 bg-[hsl(var(--pixel-paper-1))] text-pixel-ink">
            <div className="flex items-center justify-between border-b border-pixel-ink/15 px-5 py-4 sm:px-7">
              <span className="pixel-label text-[10px] text-pixel-ink/55">
                Live talent signals
              </span>
              <span className="flex items-center gap-2 text-xs">
                <span className="size-2 bg-[hsl(var(--pixel-blue-2))]" />
                System online
              </span>
            </div>
            <div className="grid sm:grid-cols-3">
              {landingFeatureKeys.slice(0, 3).map((feature, index) => (
                <div
                  key={feature.titleKey}
                  className="border-b border-pixel-ink/15 px-5 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <feature.icon className="size-5" strokeWidth={1.5} />
                    <span className="pixel-numeral text-[10px] text-pixel-ink/45">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{t(feature.titleKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </PixelGridField>

        {/* Feature Cards Section */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {landingFeatureKeys.map((feature, index) => (
            <article
              key={feature.titleKey}
              className={cn(
                "landing-feature-card group relative min-h-[250px] overflow-hidden border-b border-r border-border bg-card/35 p-6 sm:p-8",
                WIDE_CARD_INDEXES.has(index) && "lg:col-span-2",
              )}
            >
              <div className="flex items-start justify-between">
                <span className="pixel-numeral text-xs text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="grid size-11 place-items-center border border-border bg-background text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <feature.icon className="size-5" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-16 max-w-md">
                <TypographyH3 className="mb-3 text-xl font-medium tracking-tight">
                  {t(feature.titleKey)}
                </TypographyH3>
                <TypographyMuted className="!text-sm !leading-relaxed">
                  {t(feature.descKey)}
                </TypographyMuted>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
