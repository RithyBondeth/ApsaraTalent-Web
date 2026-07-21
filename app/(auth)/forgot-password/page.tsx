"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import LogoComponent from "@/components/utils/brand/logo";
import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { isEmailInput } from "@/utils/functions/validation/check-email-input";
import { isNumberPhoneInput } from "@/utils/functions/validation/check-phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideArrowLeft,
  LucideLock,
  LucideMail,
  LucidePhone,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { makeForgotPasswordSchema, TForgotPasswordForm } from "./validate";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function ForgotPasswordPage() {
  /* ---------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");

  /* ------------------------------- All States ------------------------------ */
  const [inputValue, setInputValue] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ----------------------------- API Integration --------------------------- */
  const { loading, error, message, forgotPassword } = useForgotPasswordStore();

  /* ------------------ React Hook Form: Forgot Password Form ---------------- */
  // ── Define Schema For Forgot Password Form ────────────────────────
  const forgotPasswordSchema = useMemo(
    () =>
      makeForgotPasswordSchema({
        phoneOrEmailRequired: tv("phoneOrEmailRequired"),
        phoneOrEmailInvalid: tv("phoneOrEmailInvalid"),
      }),
    [tv],
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /* -------------------------------- Methods -------------------------------- */
  // ── Forgot Password Function ───────────────────────────────────────
  const onSubmit = async (data: TForgotPasswordForm) => {
    setIsSubmitted(true);
    const idenifier = data.forgotPassword;
    if (isNumberPhoneInput(idenifier))
      await forgotPassword(idenifier.replace("0", "+855"));
    else await forgotPassword(idenifier);
  };

  /* -------------------------------- Effects -------------------------------- */
  // ── Forgot Password Effect ─────────────────────────────────────────
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
      toast.success(t("forgotPasswordEmailSent"), {
        duration: TOAST_DURATION_MS.SHORT,
      });
      setTimeout(
        () => router.replace("/reset-password"),
        DEFAULT_REDIRECT_DELAY_MS,
      );
    }
  }, [error, isSubmitted, loading, message, reset, router, t]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="auth-static-page flex h-[100dvh] min-h-0 w-full overflow-hidden tablet-md:flex-col">
      {/* Left Section */}
      <div className="auth-static-pane flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden bg-background px-7 py-10 sm:px-12 tablet-md:w-full tablet-md:pb-5 tablet-md:pt-16">
        <div className="auth-static-content flex w-full max-w-[440px] flex-col items-start gap-6">
          <LogoComponent className="auth-form-logo !h-10 w-auto self-start" />

          {/* Icon Badge Section */}
          <div className="auth-icon-badge size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideLock className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="auth-heading-group flex flex-col items-start">
            <TypographyH2 className="tablet-sm:text-2xl">
              {t("forgotPageTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">
              {t("forgotSubtitle")}
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            action=""
            className="auth-card-form w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="auth-field flex flex-col gap-1.5">
              <label htmlFor="recovery-identifier">{t("emailOrMobile")}</label>
              <Input
                id="recovery-identifier"
                type="text"
                autoComplete="username"
                placeholder={t("emailOrMobile")}
                value={inputValue}
                prefix={
                  isEmailInput(inputValue) ? (
                    <LucideMail strokeWidth={1.5} />
                  ) : isNumberPhoneInput(inputValue) ? (
                    <LucidePhone strokeWidth={1.5} />
                  ) : null
                }
                {...register("forgotPassword")}
                onChange={(e) => setInputValue(e.target.value)}
                validationMessage={errors.forgotPassword?.message}
              />
            </div>
            <div className="flex items-center justify-stretch gap-3 [&>button]:w-1/2">
              <Button
                type="button"
                variant="outline"
                className="auth-secondary-action"
                onClick={() => router.replace("/login")}
              >
                <LucideArrowLeft />
                {t("back")}
              </Button>
              <Button type="submit" className="auth-primary-action">
                {t("continue")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <AuthBrandPanel />
    </div>
  );
}
