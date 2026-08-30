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
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useReportProblemStore } from "@/stores/apis/support/report-problem.store";
import {
  PROBLEM_CATEGORIES,
  PROBLEM_DETAILS_MAX,
  type TProblemCategory,
} from "@/utils/types/support/report-problem.type";
import { LucideLoader2, LucideSend } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { IReportProblemDialogProps } from "./props";

export function ReportProblemDialog({
  open,
  onOpenChange,
}: IReportProblemDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("support");

  /* ------------------------------- All States ------------------------------- */
  const [category, setCategory] = useState<TProblemCategory>("bug");
  const [details, setDetails] = useState<string>("");

  /* ----------------------------- API Integration ---------------------------- */
  const { loading, error, reportProblem, reset } = useReportProblemStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (!open) return;
    reset();
    setCategory("bug");
    setDetails("");
  }, [open, reset]);

  /* --------------------------------- Methods -------------------------------- */
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmed = details.trim();
    if (!trimmed || loading) return;

    const sent = await reportProblem(category, trimmed);
    if (!sent) return;

    toast.success(t("reportSent"));
    handleClose();
  };

  /* -------------------------------- Render UI ------------------------------- */
  const remaining = PROBLEM_DETAILS_MAX - details.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md">
        {/* Header Section */}
        <DialogHeader>
          <DialogTitle>{t("reportTitle")}</DialogTitle>
          <DialogDescription>{t("reportDescription")}</DialogDescription>
        </DialogHeader>

        {/* Body Section: Category and Details */}
        <div className="flex flex-col gap-4 py-2">
          <RadioGroup
            value={category}
            onValueChange={(value) => setCategory(value as TProblemCategory)}
            className="gap-2"
          >
            {PROBLEM_CATEGORIES.map((value) => (
              <RadioGroupItemWithLabel
                key={value}
                value={value}
                id={`problem-${value}`}
                htmlFor={`problem-${value}`}
              >
                {t(`category.${value}`)}
              </RadioGroupItemWithLabel>
            ))}
          </RadioGroup>

          <div className="flex flex-col gap-1.5">
            <Textarea
              value={details}
              onChange={(event) =>
                // Clamped here as well as server-side so the count never goes
                // negative and a long paste cannot fail validation silently.
                setDetails(event.target.value.slice(0, PROBLEM_DETAILS_MAX))
              }
              placeholder={t("detailsPlaceholder")}
              className="min-h-28 rounded-none"
              aria-label={t("detailsPlaceholder")}
            />
            <TypographySmall className="self-end text-xs tabular-nums text-muted-foreground">
              {t("charactersLeft", { count: remaining })}
            </TypographySmall>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>

        {/* Footer Section */}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={loading || details.trim().length === 0}
          >
            {loading ? (
              <LucideLoader2 className="size-4 animate-spin" />
            ) : (
              <LucideSend className="size-4" />
            )}
            {loading ? t("sending") : t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
