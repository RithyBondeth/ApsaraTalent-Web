"use client";

import { useGsapMarquee } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/* --------------------------------- Constants -------------------------------- */
// Reuses existing feature translation keys — no new i18n entries needed
const MARQUEE_KEYS = [
  "featureSmartMatching",
  "featureResumeBuilder",
  "featureRealTimeChat",
  "featureInterviewScheduling",
  "featureCompanyProfiles",
  "featureBilingual",
] as const;

export default function LandingMarquee() {
  /* ---------------------------------- Utils --------------------------------- */
  const trackRef = useGsapMarquee<HTMLDivElement>();
  const t = useTranslations("landing");

  /* --------------------------------- Helpers -------------------------------- */
  const renderRow = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {MARQUEE_KEYS.map((key, index) => (
        <div key={key} className="flex items-center">
          <span
            className={cn(
              "pixel-display whitespace-nowrap px-6 text-2xl sm:px-10 sm:text-3xl md:text-4xl",
              index % 2 === 0
                ? "text-[hsl(var(--landing-hero-ink)/0.9)]"
                : "text-[hsl(var(--landing-hero-ink)/0.35)]",
            )}
          >
            {t(key)}
          </span>
          <span className="select-none text-xl text-pixel-4 sm:text-2xl">
            ■
          </span>
        </div>
      ))}
    </div>
  );

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section className="landing-hero-shell relative overflow-hidden border-b border-border py-0">
      {/* Velocity-Reactive Ribbon Section */}
      <div className="border-y border-[hsl(var(--landing-hero-ink)/0.14)] py-6 sm:py-8">
        <div ref={trackRef} className="flex w-max">
          {renderRow(false)}
          {renderRow(true)}
        </div>
      </div>
    </section>
  );
}
