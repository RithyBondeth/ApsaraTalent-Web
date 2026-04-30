"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LucideKeyRound } from "lucide-react";
import { IResetPasswordDialogProps } from "./props";
import { useTranslations } from "next-intl";

export function ResetPasswordDialog(props: IResetPasswordDialogProps) {
  /* --------------------------------- Props --------------------------------- */
  const { open, onOpenChange, email, sending, onSendReset, sent } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          {/* Reset Password Icon Header Section */}
          <div className="mx-auto mb-2 flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20">
            <LucideKeyRound className="size-6 text-primary" />
          </div>

          {/* Reset Password Title Section */}
          <DialogTitle className="text-center">{t("resetPasswordTitle")}</DialogTitle>

          {/* Reset Password Description Section */}
          <DialogDescription className="text-center text-sm leading-relaxed">
            {sent ? (
              t("resetSentDesc", { email: email ?? "" })
            ) : (
              t("resetDesc", { email: email ?? "" })
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Reset Password Footer Section: Done, Send Reset Link, Cancel Buttons */}
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {sent ? (
            <Button
              className="w-full rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              {t("done")}
            </Button>
          ) : (
            <>
              <Button
                className="w-full rounded-xl"
                onClick={onSendReset}
                disabled={sending}
              >
                {sending ? t("sending") : t("sendResetLink")}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={sending}
              >
                {t("cancel")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
