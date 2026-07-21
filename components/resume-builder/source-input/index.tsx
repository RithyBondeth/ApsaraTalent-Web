"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ClipboardPaste, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { IResumeSourceInputProps } from "./props";

export default function ResumeSourceInput(props: IResumeSourceInputProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { value, onChange, disabled = false, maxLength = 8_000 } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const usingPastedInfo = value.trim().length > 0;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section className="w-full rounded-2xl border border-border/70 bg-card p-5 shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] transition-[border-color,box-shadow] duration-300 hover:border-brand/20 hover:shadow-[0_10px_28px_hsl(var(--foreground)/0.06)] sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          {/* Left Section */}
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-brand/20 bg-brand-soft p-2.5">
              <Sparkles className="size-5 text-brand" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t("pasteInfoTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("pasteInfoDescription")}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              usingPastedInfo
                ? "border-brand/25 bg-brand-soft text-brand-soft-foreground"
                : "border-border bg-muted/50 text-muted-foreground",
            )}
          >
            {usingPastedInfo ? (
              <ClipboardPaste className="size-3.5" />
            ) : (
              <UserRound className="size-3.5" />
            )}
            {usingPastedInfo ? t("usingPastedInfo") : t("usingProfileInfo")}
          </div>
        </div>

        {/* Textarea Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="resume-source-text">{t("pasteInfoLabel")}</Label>
            {usingPastedInfo && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onChange("")}
                disabled={disabled}
              >
                {t("useProfileInstead")}
              </Button>
            )}
          </div>
          <Textarea
            id="resume-source-text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={t("pasteInfoPlaceholder")}
            className="min-h-48 resize-y rounded-xl border-input bg-background/60 px-4 py-3 leading-relaxed transition-[border-color,box-shadow] focus-visible:border-brand/60 focus-visible:ring-brand/10"
            maxLength={maxLength}
            disabled={disabled}
            aria-describedby="resume-source-help"
          />
          {/* Help Section */}
          <div
            id="resume-source-help"
            className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
              {t("pasteInfoPrivacy")}
            </span>
            <span className="tabular-nums">
              {t("pasteInfoCharacterCount", {
                count: value.length,
                max: maxLength,
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
