"use client";

import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import {
  LucideChartSpline,
  LucidePencilRuler,
  LucideSearch,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResumeBuilderFeature() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-center gap-8 p-6 sm:p-8 rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]">
      {/* Title Section */}
      <TypographyH4 className="!m-0 font-semibold">
        {t("aiPoweredFeatures")}
      </TypographyH4>
      <div className="w-full flex justify-between items-start gap-6 tablet-lg:flex-col">
        {/* Feature 1 Card Section */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <LucidePencilRuler
              className="text-blue-500 size-7"
              strokeWidth={1.5}
            />
          </div>
          <TypographyLead className="text-sm text-center text-foreground font-semibold !m-0">
            {t("featureTitle")}
          </TypographyLead>
          <TypographyLead className="text-xs text-center text-muted-foreground !m-0">
            {t("featureDesc")}
          </TypographyLead>
        </div>

        {/* Feature 2 Card Section */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <LucideSearch
              className="text-emerald-500 size-7"
              strokeWidth={1.5}
            />
          </div>
          <TypographyLead className="text-sm text-center text-foreground font-semibold !m-0">
            {t("featureTitle")}
          </TypographyLead>
          <TypographyLead className="text-xs text-center text-muted-foreground !m-0">
            {t("featureDesc")}
          </TypographyLead>
        </div>

        {/* Feature 3 Card Section */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <LucideChartSpline
              className="text-violet-500 size-7"
              strokeWidth={1.5}
            />
          </div>
          <TypographyLead className="text-sm text-center text-foreground font-semibold !m-0">
            {t("featureTitle")}
          </TypographyLead>
          <TypographyLead className="text-xs text-center text-muted-foreground !m-0">
            {t("featureDesc")}
          </TypographyLead>
        </div>
      </div>
    </div>
  );
}
