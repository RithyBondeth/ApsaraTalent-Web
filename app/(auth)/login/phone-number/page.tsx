"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import LogoComponent from "@/components/utils/brand/logo";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
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
    () => makePhoneLoginSchema({ phoneInvalid: tv("phoneInvalid") }),
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

  return (
    /* -------------------------------- Render UI -------------------------------- */
    <div className="auth-static-page flex h-[100dvh] min-h-0 w-full overflow-hidden tablet-md:flex-col">
      {/* Left Section */}
      <div className="auth-static-pane flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden bg-background px-7 py-10 sm:px-12 tablet-md:w-full tablet-md:pb-5 tablet-md:pt-16">
        <div className="auth-static-content flex w-full max-w-[440px] flex-col gap-6">
          {/* Logo Section */}
          <LogoComponent className="auth-form-logo !h-12 w-auto self-start" />

          {/* Title Section */}
          <div className="auth-heading-group flex flex-col items-start">
            <TypographyH2 className="phone-xl:text-xl">
              {t("phoneLoginTitle")}
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              {t("phoneLoginSubtitle")}
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            action=""
            className="auth-card-form flex flex-col items-stretch gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="auth-field flex flex-col gap-1.5">
              <label htmlFor="phone-number">{t("phoneNumber")}</label>
              <Input
                id="phone-number"
                prefix={<LucidePhone />}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t("phoneNumber")}
                {...register("phone")}
                validationMessage={errors.phone?.message}
              />
            </div>
            <div className="flex items-center gap-1">
              <Controller
                name="rememberMe"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="phone-remember-me"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor="phone-remember-me"
                className="cursor-pointer text-xs text-muted-foreground"
              >
                {t("rememberMeLabel")}
              </label>
            </div>
            <Button className="auth-primary-action">{t("loginButton")}</Button>
          </form>

          {/* Navigate Back Button Section */}
          <button
            onClick={() => router.replace("/login")}
            className="auth-text-link text-sm text-primary transition-colors text-center"
          >
            {t("backToEmailLogin")}
          </button>
        </div>
      </div>

      {/* Right Section: Auth Panel */}
      <AuthBrandPanel />
    </div>
  );
}
