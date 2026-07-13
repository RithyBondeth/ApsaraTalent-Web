"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AngkorWatWrapper } from "@/components/utils/animations/angkor-wat-wrapper";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";

export default function LandingAngkorWat() {
  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative h-[50dvh] sm:h-[70dvh] md:h-[80dvh] lg:h-[100dvh] overflow-hidden"
    >
      {/* Dotted Background Section */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] dark:opacity-[0.12] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />

      {/* Top Heading Section: (Parallax Drift) */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background via-background/80 to-transparent pt-10 pb-24">
        <div
          data-gsap="parallax"
          data-speed="0.3"
          className="mx-auto max-w-2xl text-center px-6"
        >
          <TypographyH2
            data-gsap="fade-up"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3"
          >
            <span className="text-gold-animated">{t("sectionHeading")}</span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-sm sm:text-base max-w-lg mx-auto"
          >
            {t("sectionSubtitle")}
          </TypographyMuted>
        </div>
      </div>

      {/* 3D Model Section: (Zoom-In on Scroll) */}
      <div
        data-gsap="zoom-parallax"
        className="absolute inset-x-0 top-20 bottom-20 z-[1] sm:top-24 sm:bottom-20 md:top-28 md:bottom-24 lg:top-16 lg:bottom-16"
      >
        <AngkorWatWrapper />
      </div>

      {/* Bottom Heading Section: (Parallax Drift) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pt-20 pb-10">
        <div
          data-gsap="parallax"
          data-speed="-0.25"
          className="mx-auto max-w-2xl text-center px-6"
        >
          <TypographyH2
            data-gsap="fade-up"
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
          >
            {t("inspiredBy")}{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              {t("angkorWat")}
            </span>
          </TypographyH2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-sm sm:text-base max-w-lg mx-auto"
          >
            {t("angkorWatDescription")}
          </TypographyMuted>
        </div>
      </div>
    </section>
  );
}
