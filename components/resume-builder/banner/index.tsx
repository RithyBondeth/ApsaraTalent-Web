import { useTranslations } from "next-intl";

import { PageBanner } from "@/components/utils/layout/page-banner";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI ------------------------------- */
  // No stats: the resume builder has nothing to count that the editor below
  // does not already show.
  return (
    <PageBanner
      eyebrow={t("aiPoweredFeatures")}
      title={t("bannerTitle")}
      subtitle={`${t("bannerSubtitle1")} ${t("bannerMuted")}`}
    />
  );
}
