import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import { resumeBuilderImageSvg } from "@/utils/constants/asset.constant";
import { useTranslations } from "next-intl";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Heading 1 Section */}
        <TypographyH2 className="leading-relaxed tablet-xl:text-center">
          {t("bannerTitle")}
        </TypographyH2>
        {/* Heading 2 Section */}
        <TypographyH4 className="leading-relaxed tablet-xl:text-center">
          {t("bannerSubtitle1")}
        </TypographyH4>
        {/* Heading 3 Section */}
        <TypographyH4 className="leading-relaxed tablet-xl:text-center">
          {t("bannerSubtitle2")}
        </TypographyH4>
        {/* Muted Section */}
        <TypographyMuted className="leading-relaxed tablet-xl:text-center">
          {t("bannerMuted")}
        </TypographyMuted>
      </div>
      {/* Image Section */}
      <Image
        src={resumeBuilderImageSvg}
        alt="resume builder"
        height={300}
        width={400}
        className="h-auto max-w-[340px] tablet-xl:!w-full"
      />
    </div>
  );
}
