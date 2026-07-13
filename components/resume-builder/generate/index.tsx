"use client";

import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideRocket } from "lucide-react";
import { IResumeBuilderGenerateProps } from "./props";
import { useTranslations } from "next-intl";

/* -------------------------------- Component ------------------------------- */
export default function ResumeBuilderGenerate({
  onGenerateClick,
  disabled,
}: IResumeBuilderGenerateProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full bg-foreground text-background flex flex-col items-center justify-center rounded-2xl gap-3 p-8 sm:p-10">
      {/* Title Section */}
      <TypographyH4 className="!m-0 text-background">
        {t("readyToCreate")}
      </TypographyH4>

      {/* Description Section */}
      <TypographyMuted className="text-sm text-background/70 text-center">
        {t("generateDesc")}
      </TypographyMuted>

      {/* Button Section */}
      <Button
        variant="secondary"
        className="rounded-full px-6 mt-1"
        onClick={onGenerateClick}
        disabled={disabled}
      >
        <LucideRocket />
        {t("generateMyResume")}
      </Button>

      {/* Disabled Hint Section */}
      {disabled && (
        <TypographyMuted className="text-xs text-background/50">
          {t("selectTemplateFirst")}
        </TypographyMuted>
      )}
    </div>
  );
}
