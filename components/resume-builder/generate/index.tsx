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
    <div className="w-full bg-primary text-secondary flex flex-col items-center justify-center rounded-md gap-3 p-5">
      {/* Title Section */}
      <TypographyH4>{t("readyToCreate")}</TypographyH4>

      {/* Description Section */}
      <TypographyMuted>{t("generateDesc")}</TypographyMuted>

      {/* Button Section */}
      <Button
        variant={"secondary"}
        onClick={onGenerateClick}
        disabled={disabled}
      >
        <LucideRocket />
        {t("generateMyResume")}
      </Button>

      {/* Disabled Section */}
      {disabled && (
        <TypographyMuted className="text-xs">
          {t("selectTemplateFirst")}
        </TypographyMuted>
      )}
    </div>
  );
}
