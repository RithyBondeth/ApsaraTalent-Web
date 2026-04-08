"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
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
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, TResetPasswordForm } from "./validate";
import { resetPasswordWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";
import Link from "next/link";

export default function ResetPasswordPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");

  /* ── Auto-read token from URL: /reset-password?token=xxx ── */
  const tokenFromUrl = searchParams.get("token") ?? "";

  /* -------------------------------- All States ------------------------------ */
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] =
    useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ----------------------------- API Integration ----------------------------- */
  const { loading, error, message, resetPassword } = useResetPasswordStore();

  /* ------------------- React Hook Form: Reset Password Form ------------------- */
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

  /* ── Pre-fill token whenever URL param is available ── */
  useEffect(() => {
    if (tokenFromUrl) setValue("token", tokenFromUrl);
  }, [tokenFromUrl, setValue]);

  /* --------------------------------- Methods ---------------------------------- */
  const onSubmit = async (data: TResetPasswordForm) => {
    setIsSubmitted(true);
    await resetPassword(data.token, data.password, data.confirmPassword);
  };

  /* --------------------------------- Effects ---------------------------------- */
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
      toast.success(t("resetPasswordSuccess"), { duration: 1500 });
      setTimeout(() => router.push("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }
  }, [error, isSubmitted, loading, message, reset, router, t]);

  /* ---------------------------------- Render UI -------------------------------- */
  return (
    <div className="min-h-screen w-full flex tablet-md:flex-col">
      {/* Left Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-background p-6 sm:p-10 tablet-md:w-full tablet-md:min-h-0 tablet-md:py-16">
        <div className="w-full max-w-[440px] flex flex-col items-start gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Icon Badge Section */}
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideKey className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="flex flex-col items-start">
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
            className="w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Token Field Section — hidden when auto-filled from URL query param */}
            {!tokenFromUrl && (
              <Input
                prefix={<LucideKey />}
                type="text"
                placeholder={t("tokenPlaceholder")}
                {...register("token")}
                validationMessage={errors.token?.message}
              />
            )}

            <Input
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
              placeholder={t("newPassword")}
              {...register("password")}
              validationMessage={errors.password?.message}
            />
            <Input
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
              placeholder={t("confirmPassword")}
              {...register("confirmPassword")}
              validationMessage={errors.confirmPassword?.message}
            />
            <Button type="submit" disabled={loading}>
              {loading ? t("resetting") : t("resetPassword")}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="w-full flex justify-center">
            <button
              onClick={() => router.back()}
              className="underline text-sm text-primary hover:text-primary/80 transition-colors text-center"
            >
              {`\u2190 ${t("backToLogin")}`}
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Image Poster */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-primary relative overflow-hidden tablet-md:hidden">
        {/* Decorative Circles Section */}
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-white/5" />

        <Image
          src={resetPasswordWhiteSvg}
          alt="reset-password"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
