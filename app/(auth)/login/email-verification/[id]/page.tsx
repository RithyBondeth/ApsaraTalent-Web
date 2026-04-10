"use client";

import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { LucideMail } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  emailVerificationWhiteSvg,
  emailVerificationBlackSvg,
} from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function EmailVerificationPage() {
  /* ---------------------------------- Utils -------------------------------- */
  const { resolvedTheme } = useTheme();
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
  // ── Verify Email Effect ─────────────────────────────────────────
  useEffect(() => {
    if (!isSubmitted) return;

    if (loading) toast.loading(t("verifying"));

    if (error) {
      toast.dismiss();
      toast.error(t("verificationFailed"));
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(t("emailVerifiedSuccess"), { duration: 1500 });
      setTimeout(() => router.push("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }
  }, [error, isSubmitted, loading, message, router, t]);

  // ── Get Current Image Based on Theme ─────────────────────────────
  const currentTheme = resolvedTheme || "light";
  const emailVerificationImage =
    currentTheme === "dark"
      ? emailVerificationWhiteSvg
      : emailVerificationBlackSvg;

  /* ------------------------------ Render UI ------------------------------ */
  return (
    <div className="min-h-screen w-full flex tablet-md:flex-col">
      {/* Left Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-background p-6 sm:p-10 tablet-md:w-full tablet-md:min-h-0 tablet-md:py-16">
        <div className="w-full max-w-[440px] flex flex-col items-start gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Icon Badge Section */}
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideMail className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="flex flex-col items-start">
            <TypographyH2 className="tablet-sm:text-2xl">
              {t("emailVerificationTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">
              {t("emailVerificationSubtitle")}
            </TypographyMuted>
          </div>

          {/* Button Section */}
          <Button className="w-full" onClick={() => handleVerifyEmail()}>
            <LucideMail />
            {t("verify")}
          </Button>

          {/* Back to Login Link */}
          <Button
            variant="link"
            className="w-fit mx-auto"
            onClick={() => router.back()}
          >
            {t("backToLogin")}
          </Button>
        </div>
      </div>

      {/* Right Section: Image Poster Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-primary relative overflow-hidden tablet-md:hidden">
        {/* Decorative Circles Section */}
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-white/5" />

        <Image
          src={emailVerificationImage}
          alt="login"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
