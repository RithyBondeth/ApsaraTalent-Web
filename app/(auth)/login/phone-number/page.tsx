"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AuthShell from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import LogoComponent from "@/components/utils/brand/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useLoginOTPStore } from "@/stores/apis/auth/login-otp.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucidePhone } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { makePhoneLoginSchema, TPhoneLoginForm } from "./validation";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function PhoneNumberPage() {
  /* ----------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");

  /* --------------------------------- All States ----------------------------- */
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Get User Basic Data From Phone Signup
  const { setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();

  /* ----------------------------- API Integration ---------------------------- */
  const { loading, error, message, isSuccess, loginOtp } = useLoginOTPStore();

  /* --------------------- React Hook Form: Phone OTP Form -------------------- */
  // ── Define Schema For Phone OTP Form ────────────────────────
  const phoneLoginSchema = useMemo(
    () =>
      makePhoneLoginSchema({
        phoneRequired: tv("phoneRequired"),
        phoneInvalid: tv("phoneInvalid"),
      }),
    [tv],
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<TPhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Callback URL Function ────────────────────────────────────
  const callbackUrl = useMemo(() => {
    const value = searchParams.get("callbackUrl");
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
      return "/feed";
    }
    return value;
  }, [searchParams]);

  // ── Phone OTP Href Function ──────────────────────────────────
  const phoneOtpHref = useMemo(() => {
    if (callbackUrl === "/feed") return "/login/phone-number/phone-otp";
    return `/login/phone-number/phone-otp?callbackUrl=${encodeURIComponent(
      callbackUrl,
    )}`;
  }, [callbackUrl]);

  // ── Phone Send OTP Function ──────────────────────────────────
  const onSubmit = async (data: TPhoneLoginForm) => {
    setIsSubmitted(true);
    setBasicPhoneSignupData({
      phone: data.phone ?? "",
      rememberMe: data.rememberMe,
    });
    const phone = data.phone ? data.phone.replace("0", "+855") : "";
    await loginOtp(phone);
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Phone Send OTP Effect ────────────────────────────────────
  useEffect(() => {
    if (!isSubmitted) return;

    if (isSuccess) {
      toast.dismiss();
      toast.success(t("otpSent"), { duration: TOAST_DURATION_MS.SHORT });
      setTimeout(() => router.replace(phoneOtpHref), DEFAULT_REDIRECT_DELAY_MS);
    }

    if (loading) toast.loading(t("loggingIn"));

    if (error) {
      toast.dismiss();
      toast.error(t("anErrorOccurred"), {
        action: { label: t("retry"), onClick: () => reset() },
      });
    }
  }, [
    error,
    isSubmitted,
    isSuccess,
    loading,
    message,
    phoneOtpHref,
    reset,
    router,
    t,
  ]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <AuthShell
      eyebrowKey="phonePanelEyebrow"
      titleKey="phonePanelTitle"
      subtitleKey="phonePanelSubtitle"
    >
      <div className="auth-stagger flex w-full flex-col gap-7">
        {/* Logo and Title Section */}
        <div style={{ "--d": "0ms" } as React.CSSProperties}>
          <LogoComponent className="!h-16 w-auto self-start" priority />
          <TypographyH2 className="mt-5 phone-xl:text-xl">
            {t("phoneLoginTitle")}
          </TypographyH2>
          <TypographyMuted className="text-md phone-xl:text-sm">
            {t("phoneLoginSubtitle")}
          </TypographyMuted>
        </div>

        {/* Form Section */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <AuthField
            label={`${t("phoneNumber")} *`}
            type="tel"
            inputMode="numeric"
            aria-required="true"
            icon={<LucidePhone className="size-[18px]" strokeWidth={1.6} />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <label className="flex cursor-pointer items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <TypographyMuted className="text-xs">
              {t("rememberMeLabel")}
            </TypographyMuted>
          </label>
          <div className="auth-action-row">
            <AuthBackButton onClick={() => router.replace("/login")}>
              {t("back")}
            </AuthBackButton>
            <Button
              type="submit"
              className="auth-submit h-11"
              disabled={loading}
            >
              {t("loginButton")}
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
