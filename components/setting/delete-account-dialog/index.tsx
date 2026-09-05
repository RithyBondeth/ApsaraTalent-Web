"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LucideTrash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IDeleteAccountDialogProps } from "./props";

/**
 * Explicit consent for a terminal action. Two hurdles: read what happens
 * (spelled out), and tick the box to say "I understand". Only then does
 * the confirm button enable.
 *
 * A "type DELETE to confirm" text input is what GitHub does for repos, but
 * for a personal account the checkbox reads warmer and the danger is
 * already communicated by the destructive styling and the copy. The 30-day
 * grace window is the real second chance; the dialog is the pause before
 * scheduling it.
 */
export function DeleteAccountDialog(props: IDeleteAccountDialogProps) {
  /* --------------------------------- Props --------------------------------- */
  const { open, onOpenChange, onConfirm, processing } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- All States ------------------------------ */
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Reset the checkbox every time the dialog reopens so a previous "yes"
    // never carries over to a fresh open — the confirmation is per-visit.
    if (!open) setAcknowledged(false);
  }, [open]);

  /* --------------------------------- Handlers ------------------------------- */
  const handleConfirm = async () => {
    const ok = await onConfirm();
    if (ok) onOpenChange(false);
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-14 items-center justify-center border border-destructive-border bg-destructive-subtle">
            <LucideTrash2 className="size-6 text-destructive-accent" />
          </div>
          <DialogTitle className="text-center">
            {t("deleteAccountDialogTitle")}
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed">
            {t("deleteAccountDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 border border-border bg-muted/50 p-3">
          <Checkbox
            id="delete-acknowledge"
            checked={acknowledged}
            onCheckedChange={(value) => setAcknowledged(value === true)}
            disabled={processing}
            className="mt-0.5"
          />
          <Label
            htmlFor="delete-acknowledge"
            className="cursor-pointer text-xs leading-5"
          >
            {t("deleteAccountAcknowledge")}
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={!acknowledged || processing}
            onClick={handleConfirm}
          >
            {processing
              ? t("deleteAccountProcessing")
              : t("deleteAccountConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
