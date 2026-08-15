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
              "pixel-display whitespace-nowrap px-6 text-2xl uppercase sm:px-10 sm:text-4xl md:text-5xl",
              index % 2 === 0
                ? "text-[hsl(var(--auth-ink)/0.9)]"
                : "text-stroke-neutral",
            )}
          >
            {t(key)}
          </span>
          <span className="select-none text-xl text-[hsl(var(--auth-ink)/0.3)] sm:text-2xl">
            ·
          </span>
        </div>
      ))}
    </div>
  );

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-10 sm:py-14">
      {/* Velocity-Reactive Ribbon Section */}
      <div className="rotate-[-1deg] scale-[1.02] border-y border-[hsl(var(--auth-ink)/0.12)] bg-[hsl(var(--auth-paper))] py-5 sm:py-7">
        <div ref={trackRef} className="flex w-max">
          {renderRow(false)}
          {renderRow(true)}
        </div>
      </div>
    </section>
  );
}
