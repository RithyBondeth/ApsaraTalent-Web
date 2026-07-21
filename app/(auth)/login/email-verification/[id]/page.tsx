"use client";

import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import LogoComponent from "@/components/utils/brand/logo";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { LucideMail } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="auth-static-page flex h-[100dvh] min-h-0 w-full overflow-hidden tablet-md:flex-col">
      {/* Left Section */}
      <div className="auth-static-pane flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden bg-background px-7 py-10 sm:px-12 tablet-md:w-full tablet-md:pb-5 tablet-md:pt-16">
        <div className="auth-static-content flex w-full max-w-[440px] flex-col items-start gap-6">
          <LogoComponent className="auth-form-logo !h-10 w-auto self-start" />

          {/* Icon Badge Section */}
          <div className="auth-icon-badge size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideMail className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="auth-heading-group flex flex-col items-start">
            <TypographyH2 className="tablet-sm:text-2xl">
              {t("emailVerificationTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">
              {t("emailVerificationSubtitle")}
            </TypographyMuted>
          </div>

          {/* Button Section */}
          <Button
            className="auth-primary-action w-full"
            onClick={() => handleVerifyEmail()}
          >
            <LucideMail />
            {t("verify")}
          </Button>

          {/* Back to Login Link */}
          <Button
            variant="link"
            className="auth-text-link w-fit mx-auto"
            onClick={() => router.replace("/login")}
          >
            {t("backToLogin")}
          </Button>
        </div>
      </div>

      {/* Right Section: Auth Panel */}
      <AuthBrandPanel />
    </div>
  );
}
