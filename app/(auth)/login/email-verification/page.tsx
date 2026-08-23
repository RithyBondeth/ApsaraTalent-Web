"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthShell from "@/components/auth/auth-shell";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { LucideMailCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { emailVerificationSvg } from "@/utils/constants/asset.constant";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

/** Seconds the resend button stays disabled after a send. */
const RESEND_COOLDOWN_S = 60;
const OTP_LENGTH = 6;

function EmailVerificationForm() {
  /* ---------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");

  // The address is carried in the query rather than the path. It replaced a
  // token segment, and unlike that token it is not a secret — the person just
  // typed it into the signup form. The code is what stays out of the URL.
  const email = searchParams.get("email") ?? "";

  /* ------------------------------- All States ------------------------------ */
  const [otp, setOtp] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);

  /* ----------------------------- API Integration --------------------------- */
  const { loading, resending, error, verifyEmail, resendOtp, reset } =
    useVerifyEmailStore();

  /* -------------------------------- Effects -------------------------------- */
  useEffect(() => reset, [reset]);

  // Resend cooldown tick.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  /* --------------------------------- Methods ------------------------------- */
  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH || !email) return;

      const verified = await verifyEmail(email, code);

      if (!verified) {
        // Clear the field so the next attempt starts from empty rather than
        // making the person delete six digits by hand.
        setOtp("");
        return;
      }

      toast.success(t("emailVerifiedSuccess"), {
        duration: TOAST_DURATION_MS.MEDIUM,
      });
      // `/login` lands correctly from either entry state: someone who arrived
      // straight from signup is already authenticated, so the middleware moves
      // them on to the feed, while anyone who came back later gets the form.
      setTimeout(() => router.replace("/login"), DEFAULT_REDIRECT_DELAY_MS);
    },
    [email, router, t, verifyEmail],
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || !email) return;
    const sent = await resendOtp(email);
    if (!sent) return;
    setOtp("");
    setCooldown(RESEND_COOLDOWN_S);
    toast.success(t("verificationCodeResent"));
  }, [cooldown, email, resendOtp, t]);

  /* -------------------------------- Render UI ------------------------------ */
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
          <div className="mb-5 grid size-12 place-items-center rounded-none border border-border bg-muted/60 text-foreground shadow-hard-sm">
            <LucideMailCheck className="size-5" strokeWidth={1.6} />
          </div>
          <TypographyH2 className="tablet-sm:text-2xl">
            {t("emailVerificationTitle")}
          </TypographyH2>
          <TypographyMuted className="text-md tablet-sm:text-sm">
            {email
              ? t("emailVerificationSentTo", { email })
              : t("emailVerificationSubtitle")}
          </TypographyMuted>
        </div>

        {/* Code Entry Section */}
        <div
          className="flex flex-col items-start gap-3"
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              // Submit as soon as the last digit lands — nobody wants to type
              // six digits and then hunt for a button.
              if (value.length === OTP_LENGTH) void handleVerify(value);
            }}
            disabled={loading || !email}
          >
            <InputOTPGroup>
              {[0, 1, 2].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="input-otp-slot !size-12 tablet-md:!size-10 sm:!size-14"
                />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {[3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="input-otp-slot !size-12 tablet-md:!size-10 sm:!size-14"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <TypographySmall className="text-muted-foreground phone-xl:text-sm">
            {t("otpInstructions")}
          </TypographySmall>

          {!email && <ErrorMessage>{t("emailMissingForOtp")}</ErrorMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>

        {/* Resend Section */}
        <div style={{ "--d": "150ms" } as React.CSSProperties}>
          <TypographySmall className="text-muted-foreground">
            {t("didNotReceiveCode")}{" "}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={cooldown > 0 || resending || !email}
              className="font-semibold text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0
                ? t("resendCodeIn", { seconds: cooldown })
                : t("resendCode")}
            </button>
          </TypographySmall>
        </div>

        {/* Actions Section */}
        <div
          className="auth-action-row"
          style={{ "--d": "210ms" } as React.CSSProperties}
        >
          <AuthBackButton onClick={() => router.replace("/login")}>
            {t("back")}
          </AuthBackButton>
          <Button
            className="auth-submit h-11 w-full"
            onClick={() => void handleVerify(otp)}
            disabled={loading || otp.length !== OTP_LENGTH || !email}
          >
            <LucideMailCheck />
            {t("verify")}
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

export default function EmailVerificationPage() {
  // useSearchParams needs a Suspense boundary to keep the route static-safe.
  return (
    <Suspense fallback={null}>
      <EmailVerificationForm />
    </Suspense>
  );
}
