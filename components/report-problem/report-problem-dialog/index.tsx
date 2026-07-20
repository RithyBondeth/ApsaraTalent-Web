"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { Textarea } from "@/components/ui/textarea";
import { useSupportStore } from "@/stores/apis/support/support.store";
import {
  PROBLEM_CATEGORIES,
  PROBLEM_DESCRIPTION_MAX_LENGTH,
  SUPPORT_EMAIL,
} from "@/utils/constants/report-problem";
import { TProblemCategory } from "@/utils/types/report-problem/report-problem.type";
import { LucideInfo } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { IReportProblemDialogProps } from "./props";

export default function ReportProblemDialog(props: IReportProblemDialogProps) {
  /* --------------------------------- Props --------------------------------- */
  const { open, onOpenChange } = props;

  /* --------------------------------- Utils --------------------------------- */
  const t = useTranslations("reportProblem");

  /* ------------------------------- All States ------------------------------ */
  const [category, setCategory] = useState<TProblemCategory>("bug");
  const [details, setDetails] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  /* ---------------------------- API Integration ---------------------------- */
  const reporting = useSupportStore((state) => state.reporting);
  const reportProblem = useSupportStore((state) => state.reportProblem);

  /* -------------------------------- Methods -------------------------------- */
  // ── Reset the form back to its defaults ──────────────
  const resetForm = (): void => {
    setCategory("bug");
    setDetails("");
    setShowError(false);
  };

  // ── Handle dialog open change ──────────────
  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  // ── Handle submitting the report ──────────────
  const handleSubmit = async (): Promise<void> => {
    if (!details.trim()) {
      setShowError(true);
      return;
    }

    const ok = await reportProblem({
      category,
      details: details.trim(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    });

    if (ok) {
      toast.success(t("reportSent"));
      handleOpenChange(false);
    } else {
      toast.error(t("reportFailed", { email: SUPPORT_EMAIL }));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Dialog Content Section */}
      <DialogContent className="sm:max-w-md">
        {/* Dialog Header Section */}
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {/* Dialog Body Section: Category and Details */}
        <div className="flex flex-col gap-4 py-2">
          {/* Category Section */}
          <div className="flex flex-col gap-2.5">
            <Label className="text-sm font-medium">{t("categoryLabel")}</Label>
            <RadioGroup
              value={category}
              onValueChange={(v) => setCategory(v as TProblemCategory)}
              className="flex flex-col gap-2.5"
            >
              {PROBLEM_CATEGORIES.map((c) => (
                <RadioGroupItemWithLabel
                  key={c.value}
                  value={c.value}
                  id={`problem-${c.value}`}
                  htmlFor={`problem-${c.value}`}
                >
                  {t(c.labelKey)}
                </RadioGroupItemWithLabel>
              ))}
            </RadioGroup>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="problem-details" className="text-sm font-medium">
              {t("detailsLabel")}
            </Label>
            <Textarea
              id="problem-details"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (showError) setShowError(false);
              }}
              placeholder={t("detailsPlaceholder")}
              maxLength={PROBLEM_DESCRIPTION_MAX_LENGTH}
              aria-invalid={showError}
              className="min-h-28 resize-none"
            />
            {showError && (
              <p className="text-xs text-destructive">{t("detailsRequired")}</p>
            )}
          </div>

          {/* Diagnostics Note Section */}
          <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2">
            <LucideInfo className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("diagnosticsNote")}
            </p>
          </div>
        </div>

        {/* Dialog Footer Section: Cancel and Open Email Buttons */}
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={reporting}
          >
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={reporting}>
            {reporting ? t("sending") : t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
