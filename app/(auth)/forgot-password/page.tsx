"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, TForgotPasswordForm } from "./validate";
import { forgotPasswordWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function ForgotPasswordPage() {
  /* ---------------------------------- Utils -------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");

  /* ------------------------------- All States ------------------------------ */
  const [inputValue, setInputValue] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  const { loading, error, message, forgotPassword } = useForgotPasswordStore();

  /* ------------------ React Hook Form: Forgot Password Form ----------------- */
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
      toast.success(t("forgotPasswordEmailSent"), { duration: 1000 });
      setTimeout(
        () => router.push("/reset-password"),
        DEFAULT_REDIRECT_DELAY_MS,
      );
    }
  }, [error, isSubmitted, loading, message, reset, router, t]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="min-h-screen w-full flex tablet-md:flex-col">
      {/* Left Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-background p-6 sm:p-10 tablet-md:w-full tablet-md:min-h-0 tablet-md:py-16">
        <div className="w-full max-w-[440px] flex flex-col items-start gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Icon Badge Section */}
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LucideLock className="size-7 text-primary" />
          </div>

          {/* Title Section */}
          <div className="flex flex-col items-start">
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
            className="w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              placeholder={t("emailOrMobile")}
              value={inputValue}
              prefix={
                isEmailInput(inputValue) ? (
                  <LucideMail strokeWidth={"1.3px"} />
                ) : isNumberPhoneInput(inputValue) ? (
                  <LucidePhone strokeWidth={"1.3px"} />
                ) : null
              }
              {...register("forgotPassword")}
              onChange={(e) => setInputValue(e.target.value)}
              validationMessage={errors.forgotPassword?.message}
            />
            <div className="flex items-center justify-stretch gap-3 [&>button]:w-1/2">
              <Button type="button" onClick={() => router.back()}>
                <LucideArrowLeft />
                {t("back")}
              </Button>
              <Button type="submit">{t("continue")}</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section: Image Poster Section */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-primary relative overflow-hidden tablet-md:hidden">
        {/* Decorative Circles Section */}
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-white/5" />

        <Image
          src={forgotPasswordWhiteSvg}
          alt="forgot-password"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
