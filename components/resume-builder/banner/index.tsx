import { FeaturePageHeader } from "@/components/utils/layout/feature-page-header";
import { useTranslations } from "next-intl";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <FeaturePageHeader
      title={t("bannerTitle")}
      description={t("bannerSubtitle1")}
    />
  );
}
