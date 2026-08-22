"use client";

import { Button } from "@/components/ui/button";
import {
  LucideLoader2,
  LucideLayoutTemplate,
  LucideRocket,
} from "lucide-react";
import { IResumeBuilderGenerateProps } from "./props";
import { useTranslations } from "next-intl";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { resolveResumeTemplateTheme } from "@/utils/functions/resume";

export default function ResumeBuilderGenerate({
  onGenerateClick,
  disabled,
  loading,
  selectedTemplate,
  selectedTemplateLabel,
}: IResumeBuilderGenerateProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const theme = selectedTemplate
    ? resolveResumeTemplateTheme(selectedTemplate)
    : null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className="w-full border border-border bg-card shadow-hard">
      {/* Selection Summary Section */}
      <div className="flex min-w-0 items-center gap-3 border-b border-border p-4">
        {theme ? (
          /* Template Accent Swatch Section */
          <div
            aria-hidden
            className="size-10 shrink-0 overflow-hidden border border-border"
            style={{ background: theme.accentSoft }}
          >
            <div
              className="h-1/2 w-full"
              style={{ background: theme.accent }}
            />
          </div>
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/50">
            <LucideLayoutTemplate className="size-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            {t("templateLabel")}
          </span>
          <span className="truncate text-sm font-bold text-foreground">
            {selectedTemplateLabel ?? t("selectTemplateFirst")}
          </span>
        </div>
      </div>

      {/* Generation Details and Action Section */}
      <div className="flex flex-col gap-4 p-4">
        <p className="text-xs leading-5 text-muted-foreground">
          {t("generateDesc")}
        </p>

        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <AiQuotaBadge />
          </div>
          <Button
            className="h-11 w-full justify-between rounded-none px-4"
            onClick={onGenerateClick}
            disabled={disabled}
          >
            <span>
              {loading ? t("preparingResume") : t("generateMyResume")}
            </span>
            {loading ? (
              <LucideLoader2 className="animate-spin" />
            ) : (
              <LucideRocket />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
