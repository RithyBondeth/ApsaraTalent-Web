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
import { Textarea } from "@/components/ui/textarea";
import { LucideLoader2, LucideUserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IRejectApplicantDialogProps } from "./props";

const REASON_MAX_LENGTH = 1000;

export function RejectApplicantDialog({
  application,
  isSubmitting,
  onCancel,
  onConfirm,
}: IRejectApplicantDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");

  /* -------------------------------- All States ------------------------------ */
  const [reason, setReason] = useState<string>("");

  /* --------------------------------- Effects -------------------------------- */
  // Reset between candidates, or the previous person's reason is pre-filled
  // for the next one — which is exactly how a wrong reason gets sent.
  useEffect(() => setReason(""), [application?.id]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={application !== null} onOpenChange={onCancel}>
      <DialogContent variant="flush" size="md">
        <div className="h-1 w-20 bg-destructive" />

        <DialogHeader className="flex-row items-start gap-4 space-y-0 px-6 pb-6 pt-5 text-left">
          <div className="flex size-12 shrink-0 items-center justify-center border border-destructive/25 bg-destructive/10 text-destructive">
            <LucideUserX className="size-5" />
          </div>
          <div className="min-w-0 space-y-2 pr-8">
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight">
              {t("rejectDialogTitle")}
            </DialogTitle>
            <DialogDescription className="leading-6">
              {t("rejectDialogDescription", {
                name: application?.employeeName ?? t("unnamedApplicant"),
              })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-2 px-6 pb-5">
          <label
            htmlFor="rejection-reason"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t("rejectionReasonOptional")}
          </label>
          <Textarea
            id="rejection-reason"
            value={reason}
            maxLength={REASON_MAX_LENGTH}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t("rejectionReasonPlaceholder")}
            className="min-h-28 rounded-none"
          />
          {/* The candidate sees this, so say so before it is sent. */}
          <p className="text-xs text-muted-foreground">
            {t("rejectionReasonVisible")}
          </p>
        </div>

        <DialogFooter className="gap-2 border-t border-border/70 bg-muted/30 px-6 py-4 sm:space-x-0">
          <Button
            variant="outline"
            type="button"
            className="min-w-24 rounded-none"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            type="button"
            className="min-w-24 rounded-none"
            disabled={isSubmitting || !application}
            onClick={() =>
              application && onConfirm(application.id, reason.trim())
            }
          >
            {isSubmitting ? (
              <LucideLoader2 className="size-4 animate-spin" />
            ) : (
              <LucideUserX className="size-4" />
            )}
            {t("confirmReject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
