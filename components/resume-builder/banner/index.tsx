import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import { resumeBuilderBannerSvg } from "@/utils/constants/asset.constant";
import { useTranslations } from "next-intl";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <>
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {t("bannerTitle")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle1")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle2")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {t("bannerMuted")}
          </TypographyMuted>
        </div>
        <Image
          src={resumeBuilderBannerSvg}
          alt="resume builder"
          height={250}
          width={350}
          className="h-auto max-w-[340px] shrink-0"
          priority
        />
      </div>

      {/* Tablet Banner Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <TypographyH3 className="!leading-snug">
            {t("bannerTitle")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle1")}
          </TypographyMuted>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle2")}
          </TypographyMuted>
        </div>
        <Image
          src={resumeBuilderBannerSvg}
          alt="resume builder"
          width={160}
          height={160}
          className="shrink-0 h-auto object-contain"
          priority
        />
      </div>

      {/* Mobile Banner Section ≤650px */}
      <div className="hidden tablet-md:flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-3 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="font-bold text-sm leading-snug text-foreground">
            {t("bannerTitle")}
          </h2>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {t("bannerSubtitle1")}
          </p>
        </div>
        <Image
          src={resumeBuilderBannerSvg}
          alt="resume builder"
          width={88}
          height={88}
          className="flex-shrink-0 object-contain"
          priority
        />
      </div>
    </>
  );
}
