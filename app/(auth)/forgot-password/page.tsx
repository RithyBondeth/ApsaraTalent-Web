"use client";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { isNumberPhoneInput } from "@/utils/functions/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideKeyRound, LucideMail, LucidePhone } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { makeForgotPasswordSchema, TForgotPasswordForm } from "./validation";
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

  const identifierField = register("forgotPassword");

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
    <AuthShell
      eyebrowKey="forgotPanelEyebrow"
      titleKey="forgotPanelTitle"
      subtitleKey="forgotPanelSubtitle"
    >
      <div className="auth-stagger flex w-full flex-col gap-7">
        {/* Icon Badge and Title Section */}
        <div style={{ "--d": "0ms" } as React.CSSProperties}>
          <div className="mb-5 grid size-12 place-items-center rounded-none bg-foreground text-background shadow-[3px_3px_0_hsl(var(--foreground)/0.12)]">
            <LucideKeyRound className="size-5" strokeWidth={1.6} />
          </div>
          <TypographyH2 className="tablet-sm:text-2xl">
            {t("forgotPageTitle")}
          </TypographyH2>
          <TypographyMuted className="text-md tablet-sm:text-sm">
            {t("forgotSubtitle")}
          </TypographyMuted>
        </div>

        {/* Form Section */}
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <AuthField
            label={t("emailOrMobile")}
            type="text"
            icon={
              isNumberPhoneInput(inputValue) ? (
                <LucidePhone className="size-[18px]" strokeWidth={1.6} />
              ) : (
                <LucideMail className="size-[18px]" strokeWidth={1.6} />
              )
            }
            error={errors.forgotPassword?.message}
            {...identifierField}
            onChange={(e) => {
              identifierField.onChange(e);
              setInputValue(e.target.value);
            }}
          />
          <div className="auth-action-row">
            <AuthBackButton onClick={() => router.replace("/login")}>
              {t("back")}
            </AuthBackButton>
            <Button type="submit" className="auth-submit" disabled={loading}>
              {t("continue")}
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
