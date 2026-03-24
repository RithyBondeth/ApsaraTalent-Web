"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import LogoComponent from "@/components/utils/logo";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useLoginOTPStore } from "@/stores/apis/auth/login-otp.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucidePhone } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { phoneLoginSchema, TPhoneLoginForm } from "./validation";
import { phoneNumberWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function PhoneNumberPage() {
  /* ----------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");

  /* --------------------------------- All States ----------------------------- */
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();

  /* ----------------------------- API Integration ---------------------------- */
  // API Integration
  const { loading, error, message, isSuccess, loginOtp } = useLoginOTPStore();

  /* --------------------- React Hook Form: Phone OTP Form --------------------- */
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
  // ── Phone OTP Function ───────────────────────────────────────
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
  // ── Phone OTP Effect ─────────────────────────────────────────
  useEffect(() => {
    if (!isSubmitted) return;

    if (isSuccess) {
      toast.dismiss();
      toast.success(t("otpSent"), { duration: 1000 });
      setTimeout(() => router.replace("/login/phone-number/phone-otp"), DEFAULT_REDIRECT_DELAY_MS);
    }

    if (loading) toast.loading(t("loggingIn"));

    if (error) {
      toast.dismiss();
      toast.error(t("anErrorOccurred"), {
        action: { label: t("retry"), onClick: () => reset() },
      });
    }
  }, [error, loading, isSuccess, message, isSubmitted]);

  return (
    /* -------------------------------- Render UI -------------------------------- */
    <div className="min-h-screen w-full flex tablet-md:flex-col">
      {/* Left Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-background p-6 sm:p-10 tablet-md:w-full tablet-md:min-h-0 tablet-md:py-12">
        <div className="w-full max-w-[440px] flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Logo */}
          <LogoComponent className="!h-24 w-auto self-start" withoutTitle />

          {/* Title Section */}
          <div>
            <TypographyH2 className="phone-xl:text-xl">
              Sign in with Your Phone Number
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              Enter your phone number and password to access your account.
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            action=""
            className="flex flex-col items-stretch gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              prefix={<LucidePhone />}
              type="number"
              placeholder="Phone Number"
              {...register("phone")}
              validationMessage={errors.phone?.message}
            />
            <div className="flex items-center gap-1">
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
              <TypographyMuted className="text-xs">Remember me</TypographyMuted>
            </div>
            <Button>Login</Button>
          </form>

          {/* Back to login link */}
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            ← Back to email login
          </Link>
        </div>
      </div>

      {/* Right Section: Image Poster Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-primary relative overflow-hidden tablet-md:hidden">
        <Image
          src={phoneNumberWhiteSvg}
          alt="phone-number"
          height={undefined}
          width={600}
        />
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5" />
      </div>
    </div>
  );
}
