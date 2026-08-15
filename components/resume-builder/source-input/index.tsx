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
    <section className="w-full border border-t-[5px] border-border border-t-foreground bg-card p-4 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] sm:p-5">
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex flex-col gap-3">
          {/* Left Section */}
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center border border-foreground bg-foreground text-background">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <h2 className="pixel-display text-base text-foreground">
                {t("pasteInfoTitle")}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("pasteInfoDescription")}
              </p>
            </div>
          </div>

          {/* Information Source Status Section */}
          <div
            className={cn(
              "inline-flex w-full items-center gap-2 border px-3 py-2 text-xs font-semibold",
              usingPastedInfo
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-muted/35 text-muted-foreground",
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
            <Label
              htmlFor="resume-source-text"
              className="pixel-label text-[10px]"
            >
              {t("pasteInfoLabel")}
            </Label>
            {usingPastedInfo && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 rounded-none px-2 text-xs"
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
            className="min-h-56 resize-y rounded-none border-border bg-background text-sm leading-6 focus-visible:ring-1"
            maxLength={maxLength}
            disabled={disabled}
            aria-describedby="resume-source-help"
          />
          {/* Help Section */}
          <div
            id="resume-source-help"
            className="flex flex-col gap-2 border-t border-border pt-3 text-[11px] leading-4 text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 shrink-0 text-success" />
              {t("pasteInfoPrivacy")}
            </span>
            <span className="pixel-numeral">
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
