"use client";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { LucideMailCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { emailVerificationSvg } from "@/utils/constants/asset.constant";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function EmailVerificationPage() {
  /* ---------------------------------- Utils -------------------------------- */
  const params = useParams();
  const token = params?.id;
  const router = useRouter();
  const t = useTranslations("auth");

  /* ------------------------------- All States ------------------------------ */
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ----------------------------- API Integration --------------------------- */
  const { loading, error, message, verifyEmail } = useVerifyEmailStore();

  /* --------------------------------- Methods ------------------------------- */
  // ── Verify Email Function ──────────────────────────────────────
  const handleVerifyEmail = async () => {
    setIsSubmitted(true);
    await verifyEmail(token as string);
  };

  /* -------------------------------- Effects -------------------------------- */
  // ── Verify Email Effect ────────────────────────────────────────
  useEffect(() => {
    if (!isSubmitted) return;

    if (loading) toast.loading(t("verifying"));

    if (error) {
      toast.dismiss();
      toast.error(t("verificationFailed"));
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(t("emailVerifiedSuccess"), {
        duration: TOAST_DURATION_MS.MEDIUM,
      });
      setTimeout(() => router.replace("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }
  }, [error, isSubmitted, loading, message, router, t]);

  /* ------------------------------ Render UI ------------------------------ */
  return (
    <AuthShell
      image={emailVerificationSvg}
      imageAlt={t("emailVerificationTitle")}
      eyebrowKey="verifyPanelEyebrow"
      titleKey="verifyPanelTitle"
      subtitleKey="verifyPanelSubtitle"
    >
      <div className="auth-stagger flex w-full flex-col gap-7">
        {/* Icon Badge and Title Section */}
        <div style={{ "--d": "0ms" } as React.CSSProperties}>
          <div className="mb-5 grid size-12 place-items-center rounded-none bg-foreground text-background shadow-[3px_3px_0_hsl(var(--foreground)/0.12)]">
            <LucideMailCheck className="size-5" strokeWidth={1.6} />
          </div>
          <TypographyH2 className="tablet-sm:text-2xl">
            {t("emailVerificationTitle")}
          </TypographyH2>
          <TypographyMuted className="text-md tablet-sm:text-sm">
            {t("emailVerificationSubtitle")}
          </TypographyMuted>
        </div>

        {/* Actions Section */}
        <div
          className="auth-action-row"
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <AuthBackButton onClick={() => router.replace("/login")}>
            {t("back")}
          </AuthBackButton>
          <Button
            className="auth-submit h-11 w-full"
            onClick={() => handleVerifyEmail()}
            disabled={loading}
          >
            <LucideMailCheck />
            {t("verify")}
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
