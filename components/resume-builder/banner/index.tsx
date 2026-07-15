import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import { resumeBuilderBannerSvg } from "@/utils/constants/asset.constant";
import { useTranslations } from "next-intl";
import { LucideSparkles } from "lucide-react";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="relative w-full flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/[0.07] via-transparent to-muted/30 px-5 py-6 sm:px-8 sm:py-8">
      {/* Copy Section */}
      <div className="flex min-w-0 flex-col items-start gap-2.5">
        {/* AI Badge Section */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
          <LucideSparkles className="size-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            {t("aiPoweredFeatures")}
          </span>
        </div>

        <TypographyH2 className="!leading-snug text-lg sm:text-2xl">
          {t("bannerTitle")}
        </TypographyH2>
        <TypographyMuted className="!leading-relaxed text-xs sm:text-sm line-clamp-2 max-w-xl">
          {t("bannerSubtitle1")}
        </TypographyMuted>
        <TypographyMuted className="hidden sm:block !leading-relaxed text-xs max-w-xl">
          {t("bannerMuted")}
        </TypographyMuted>
      </div>

      {/* Illustration Section */}
      <Image
        src={resumeBuilderBannerSvg}
        alt="resume builder"
        height={250}
        width={350}
        className="hidden md:block h-auto w-[220px] lg:w-[300px] shrink-0"
        priority
      />
    </div>
  );
}
