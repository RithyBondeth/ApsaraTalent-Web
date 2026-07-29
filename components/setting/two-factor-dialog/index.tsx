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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useTwoFactorStore } from "@/stores/apis/auth/two-factor.store";
import {
  LucideAlertCircle,
  LucideLoader2,
  LucideShieldCheck,
  LucideShieldOff,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ITwoFactorDialogProps } from "./props";
import { OTP_LENGTH } from "@/utils/constants/auth.constant";

const QRCode = dynamic(() => import("react-qr-code"), {
  ssr: false,
});

export function TwoFactorDialog({
  open,
  mode,
  onOpenChange,
  onSuccess,
}: ITwoFactorDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("twoFactor");

  /* ------------------------------ API Integration --------------------------- */
  const { loading, error, qrCodeUrl, secret, setup, enable, disable, reset } =
    useTwoFactorStore();

  /* -------------------------------- All States ------------------------------ */
  const [otp, setOtp] = useState<string>("");
  // enable flow has two steps: 1 = show QR, 2 = verify OTP
  const [step, setStep] = useState<1 | 2>(mode === "disable" ? 2 : 1);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (!open) return;
    reset();
    setOtp("");
    if (mode === "enable") {
      setStep(1);
      setup();
    } else {
      setStep(2);
    }
  }, [open, mode, reset, setup]);

  /* -------------------------------- Methods --------------------------------- */
  // ── Handle Close ──────────────────────────────────
  const handleClose = () => {
    reset();
    setOtp("");
    onOpenChange(false);
  };

  // ── Handle Verify ──────────────────────────────────
  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) return;
    const success = mode === "enable" ? await enable(otp) : await disable(otp);
    if (success) {
      handleClose();
      onSuccess();
    }
  };

  /* ------------------------------ Render UI -------------------------------- */
  const isEnableFlow = mode === "enable";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm rounded-none border-t-[5px] border-t-primary shadow-[6px_6px_0_hsl(var(--foreground)/0.09)]">
        {/* Dialog Header Section */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEnableFlow ? (
              <LucideShieldCheck className="size-5 text-emerald-500" />
            ) : (
              <LucideShieldOff className="size-5 text-destructive" />
            )}
            {isEnableFlow ? t("enableTitle") : t("disableTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEnableFlow
              ? step === 1
                ? t("enableStep1Desc")
                : t("enableStep2Desc")
              : t("disableDesc")}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1 Section: QR Code (enable flow only) */}
        {isEnableFlow && step === 1 && (
          <div className="flex flex-col items-center gap-4 py-2">
            {loading ? (
              <div className="flex items-center justify-center h-[160px]">
                <LucideLoader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <LucideAlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            ) : qrCodeUrl ? (
              <>
                <div className="border bg-white p-3">
                  <QRCode value={qrCodeUrl} size={160} />
                </div>
                {secret && (
                  <div className="w-full flex flex-col gap-1">
                    <TypographyMuted className="text-xs text-center">
                      {t("manualEntry")}
                    </TypographyMuted>
                    <code className="block select-all break-all bg-muted px-3 py-2 text-center font-mono text-xs">
                      {secret}
                    </code>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Step 2 Section: OTP input (Both Flows) */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-3 py-2">
            <TypographySmall className="text-muted-foreground text-center text-xs">
              {t("otpHint")}
            </TypographySmall>
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              disabled={loading}
            >
              <InputOTPGroup>
                {Array.from({ length: OTP_LENGTH }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <div className="flex items-center gap-1.5 text-destructive text-xs">
                <LucideAlertCircle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Dialog Footer Section */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="rounded-none"
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          {isEnableFlow && step === 1 ? (
            <Button
              className="rounded-none"
              onClick={() => setStep(2)}
              disabled={loading || !qrCodeUrl}
            >
              {t("next")}
            </Button>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={loading || otp.length < OTP_LENGTH}
              variant={isEnableFlow ? "default" : "destructive"}
              className="rounded-none"
            >
              {loading && (
                <LucideLoader2 className="size-4 animate-spin mr-1" />
              )}
              {isEnableFlow ? t("enableConfirm") : t("disableConfirm")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
