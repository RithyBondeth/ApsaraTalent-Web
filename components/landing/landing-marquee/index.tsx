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
              "px-6 sm:px-10 text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight whitespace-nowrap",
              index % 2 === 0
                ? "text-amber-600/90 dark:text-amber-400/90"
                : "text-stroke-amber",
            )}
          >
            {t(key)}
          </span>
          <span className="text-xl sm:text-2xl text-amber-500/60 dark:text-amber-400/50 select-none">
            ✦
          </span>
        </div>
      ))}
    </div>
  );

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      {/* Velocity-Reactive Ribbon Section */}
      <div className="rotate-[-1.5deg] scale-[1.02] border-y border-amber-500/15 bg-amber-500/[0.04] py-5 sm:py-7 dark:border-amber-400/10 dark:bg-amber-400/[0.04]">
        <div ref={trackRef} className="flex w-max">
          {renderRow(false)}
          {renderRow(true)}
        </div>
      </div>
    </section>
  );
}
