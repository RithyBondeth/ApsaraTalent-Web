"use client";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useResetPasswordStore } from "@/stores/apis/auth/reset-password.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideKeyRound, LucideLockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { makeResetPasswordSchema, TResetPasswordForm } from "./validation";
import { resetPasswordSvg } from "@/utils/constants/asset.constant";
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
    <AuthShell
      image={resetPasswordSvg}
      imageAlt={t("resetPageTitle")}
      eyebrowKey="resetPanelEyebrow"
      titleKey="resetPanelTitle"
      subtitleKey="resetPanelSubtitle"
    >
      <div className="auth-stagger flex w-full flex-col gap-7">
        {/* Icon Badge and Title Section */}
        <div style={{ "--d": "0ms" } as React.CSSProperties}>
          <div className="mb-5 grid size-12 place-items-center rounded-none bg-foreground text-background shadow-hard-sm">
            <LucideKeyRound className="size-5" strokeWidth={1.6} />
          </div>
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
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          {/* Token Field Section: Hidden when auto-filled from URL query parameter */}
          {!tokenFromUrl && (
            <AuthField
              label={t("tokenPlaceholder")}
              type="text"
              icon={
                <LucideKeyRound className="size-[18px]" strokeWidth={1.6} />
              }
              error={errors.token?.message}
              {...register("token")}
            />
          )}

          <AuthField
            label={t("newPassword")}
            type="password"
            autoComplete="new-password"
            icon={
              <LucideLockKeyhole className="size-[18px]" strokeWidth={1.6} />
            }
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthField
            label={t("confirmPassword")}
            type="password"
            autoComplete="new-password"
            icon={
              <LucideLockKeyhole className="size-[18px]" strokeWidth={1.6} />
            }
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="auth-action-row">
            <AuthBackButton onClick={() => router.replace("/login")}>
              {t("back")}
            </AuthBackButton>
            <Button
              type="submit"
              className="auth-submit h-11"
              disabled={loading}
            >
              {loading ? t("resetting") : t("resetPassword")}
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
