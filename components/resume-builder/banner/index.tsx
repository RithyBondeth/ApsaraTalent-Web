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
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center tablet-xl:mt-5">
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
        alt="feed"
        height={300}
        width={400}
        className="tablet-xl:!w-full"
      />
    </div>
  );
}
