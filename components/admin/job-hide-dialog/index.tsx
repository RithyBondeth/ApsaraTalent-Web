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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { IJobHideDialogProps } from "./props";

/** The API rejects anything shorter, so the form should too. */
const MIN_REASON_LENGTH = 10;

export function JobHideDialog({
  open,
  onOpenChange,
  jobTitle,
  companyName,
  saving,
  onSubmit,
}: IJobHideDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.jobDialog");

  /* -------------------------------- All States ------------------------------ */
  const [reason, setReason] = useState("");

  /* --------------------------------- Effects -------------------------------- */
  // Reset on open, not on close: clearing during the close animation makes
  // the dialog visibly blank out on its way off screen.
  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  /* --------------------------------- Handlers ------------------------------- */
  const reasonTooShort = reason.trim().length < MIN_REASON_LENGTH;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("title", { title: jobTitle })}</DialogTitle>
          <DialogDescription>
            {t("description", { company: companyName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="admin-job-reason">{t("reasonLabel")}</Label>
          <Textarea
            id="admin-job-reason"
            rows={4}
            value={reason}
            maxLength={500}
            placeholder={t("reasonPlaceholder")}
            onChange={(event) => setReason(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">{t("reasonHelp")}</p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={reasonTooShort || saving}
            onClick={() => {
              if (reasonTooShort || saving) return;
              onSubmit(reason.trim());
            }}
          >
            {saving ? t("hiding") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
