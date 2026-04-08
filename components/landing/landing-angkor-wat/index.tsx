"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AngkorWatWrapper } from "@/components/utils/animations/angkor-wat-wrapper";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useTranslations } from "next-intl";

export default function LandingAngkorWat() {
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const t = useTranslations("landing");

  return (
    <section
      ref={sectionRef}
      className="relative h-[50dvh] sm:h-[70dvh] md:h-[80dvh] lg:h-[85dvh] overflow-hidden"
    >
      {/* Dotted Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] dark:opacity-[0.12] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />

      {/* Top Heading */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background via-background/80 to-transparent pt-10 pb-24">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2
            data-gsap="fade-up"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3"
          >
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              {t("sectionHeading")}
            </span>
          </h2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-sm sm:text-base max-w-lg mx-auto"
          >
            {t("sectionSubtitle")}
          </TypographyMuted>
        </div>
      </div>

      {/* 3D Model */}
      <div className="absolute inset-0 z-[1]">
        <AngkorWatWrapper />
      </div>

      {/* Bottom Heading */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pt-20 pb-10">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2
            data-gsap="fade-up"
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
          >
            {t("inspiredBy")}{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              {t("angkorWat")}
            </span>
          </h2>
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
