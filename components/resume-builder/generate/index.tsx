"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LucideLayoutTemplate, LucideRocket } from "lucide-react";
import { IResumeBuilderGenerateProps } from "./props";
import { useTranslations } from "next-intl";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { resolveResumeTemplateTheme } from "@/utils/functions/resume/resume-theme";

/**
 * Sticky action bar pinned to the bottom of the builder flow — keeps the
 * generate CTA and the current template selection always in view.
 */
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
    <div className="sticky bottom-3 z-30 w-full">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-[0_8px_30px_hsl(var(--foreground)/0.14)] backdrop-blur-lg">
        {/* Selection Summary Section */}
        <div className="flex min-w-0 items-center gap-3">
          {theme ? (
            /* Template Accent Swatch Section */
            <div
              aria-hidden
              className="size-9 shrink-0 rounded-xl border border-border/60 overflow-hidden"
              style={{ background: theme.accentSoft }}
            >
              <div
                className="h-1/2 w-full"
                style={{ background: theme.accent }}
              />
            </div>
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50">
              <LucideLayoutTemplate className="size-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              {selectedTemplateLabel ?? t("selectTemplateFirst")}
            </span>
            <span className="hidden sm:block truncate text-xs text-muted-foreground">
              {t("generateDesc")}
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden md:block">
            <AiQuotaBadge />
          </div>
          <Button
            className="rounded-full px-5 sm:px-6"
            onClick={onGenerateClick}
            disabled={disabled}
          >
            {loading ? <Loader2 className="animate-spin" /> : <LucideRocket />}
            {loading ? t("preparingResume") : t("generateMyResume")}
          </Button>
        </div>
      </div>
    </div>
  );
}
