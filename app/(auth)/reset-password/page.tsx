"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import LogoComponent from "@/components/utils/brand/logo";
import { useResetPasswordStore } from "@/stores/apis/auth/reset-password.store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideEye,
  LucideEyeClosed,
  LucideKey,
  LucideLockKeyhole,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { makeResetPasswordSchema, TResetPasswordForm } from "./validate";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function ResetPasswordPage() {
  /* ---------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  /* ── Auto-read token from URL: /reset-password?token=xxx ── */
  const tokenFromUrl = searchParams.get("token") ?? "";

  /* -------------------------------- All States ------------------------------ */
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] =
    useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ----------------------------- API Integration ----------------------------- */
  const { loading, error, message, resetPassword } = useResetPasswordStore();

  /* ------------------- React Hook Form: Reset Password Form ------------------ */
  // ── Initialize Reset Password Form with Default Values ──────────────────
  const resetPasswordSchema = useMemo(
    () =>
      makeResetPasswordSchema({
        passwordRequired: tv("passwordRequired"),
        passwordMinLength: tv("passwordMinLength"),
        passwordNeedsNumber: tv("passwordNeedsNumber"),
        passwordNeedsSpecial: tv("passwordNeedsSpecial"),
        confirmPasswordRequired: tv("confirmPasswordRequired"),
        passwordsMismatch: tv("passwordsMismatch"),
      }),
    [tv],
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl },
  });

  /* --------------------------------- Methods ---------------------------------- */
  // ── Reset Password Function ──────────────────────────────────────────────
  const onSubmit = async (data: TResetPasswordForm) => {
    setIsSubmitted(true);
    await resetPassword(data.token ?? "", data.password, data.confirmPassword);
  };

  /* --------------------------------- Effects ---------------------------------- */
  // ── Pre-fill Token Whenever URL Param is Available Effect ────────────────
  useEffect(() => {
    if (tokenFromUrl) setValue("token", tokenFromUrl);
  }, [tokenFromUrl, setValue]);

  // ── Reset Password Effect ────────────────────────────────────────────────
  useEffect(() => {
    if (!isSubmitted) return;

    if (loading) toast.loading(t("loading"));

    if (error) {
      toast.dismiss();
      toast.error(t("anErrorOccurred"), {
        action: { label: t("retry"), onClick: () => reset() },
      });
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(t("resetPasswordSuccess"), {
        duration: TOAST_DURATION_MS.MEDIUM,
      });
      setTimeout(() => router.replace("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }
  }, [error, isSubmitted, loading, message, reset, router, t]);

  /* -------------------------------- Render UI --------------------------------- */
  return (
    <div className="auth-static-page flex h-[100dvh] min-h-0 w-full overflow-hidden tablet-md:flex-col">
      {/* Left Section */}
      <div className="auth-static-pane flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden bg-background px-7 py-10 sm:px-12 tablet-md:w-full tablet-md:pb-5 tablet-md:pt-16">
        <div className="auth-static-content flex w-full max-w-[440px] flex-col items-start gap-6">
          <LogoComponent className="auth-form-logo !h-10 w-auto self-start" />

          {/* Icon Badge Section */}
          <div className="auth-icon-badge size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideKey className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="auth-heading-group flex flex-col items-start">
            <TypographyH2 className="phone-xl:text-2xl">
              {t("resetPageTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              {tokenFromUrl
                ? t("resetSubtitleWithToken")
                : t("resetSubtitleWithoutToken")}
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            className="auth-card-form w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Token Field Section: Hidden when auto-filled from URL query param */}
            {!tokenFromUrl && (
              <div className="auth-field flex flex-col gap-1.5">
                <label htmlFor="reset-token">{t("tokenPlaceholder")}</label>
                <Input
                  id="reset-token"
                  prefix={<LucideKey />}
                  type="text"
                  placeholder={t("tokenPlaceholder")}
                  {...register("token")}
                  validationMessage={errors.token?.message}
                />
              </div>
            )}

            <div className="auth-field flex flex-col gap-1.5">
              <label htmlFor="new-password">{t("newPassword")}</label>
              <Input
                id="new-password"
                prefix={<LucideLockKeyhole />}
                suffix={
                  passwordVisibility ? (
                    <LucideEyeClosed
                      onClick={() => setPasswordVisibility(false)}
                    />
                  ) : (
                    <LucideEye onClick={() => setPasswordVisibility(true)} />
                  )
                }
                type={passwordVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("newPassword")}
                {...register("password")}
                validationMessage={errors.password?.message}
              />
            </div>
            <div className="auth-field flex flex-col gap-1.5">
              <label htmlFor="confirm-new-password">
                {t("confirmPassword")}
              </label>
              <Input
                id="confirm-new-password"
                prefix={<LucideLockKeyhole />}
                suffix={
                  confirmPassVisibility ? (
                    <LucideEyeClosed
                      onClick={() => setConfirmPassVisibility(false)}
                    />
                  ) : (
                    <LucideEye onClick={() => setConfirmPassVisibility(true)} />
                  )
                }
                type={confirmPassVisibility ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPassword")}
                {...register("confirmPassword")}
                validationMessage={errors.confirmPassword?.message}
              />
            </div>
            <Button
              type="submit"
              className="auth-primary-action"
              disabled={loading}
            >
              {loading ? t("resetting") : t("resetPassword")}
            </Button>
          </form>

          {/* Navigate Back Button Section */}
          <div className="w-full flex justify-center">
            <button
              onClick={() => router.replace("/login")}
              className="auth-text-link text-sm text-primary transition-colors text-center"
            >
              {`\u2190 ${t("backToLogin")}`}
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Auth Panel */}
      <AuthBrandPanel />
    </div>
  );
}
