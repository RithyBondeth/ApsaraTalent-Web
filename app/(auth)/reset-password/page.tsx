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
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, TResetPasswordForm } from "./validate";
import { resetPasswordWhiteSvg } from "@/utils/constants/asset.constant";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function ResetPasswordPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router       = useRouter();
  const searchParams = useSearchParams();

  /* ── Auto-read token from URL: /reset-password?token=xxx ── */
  const tokenFromUrl = searchParams.get("token") ?? "";

  /* -------------------------------- All States ------------------------------ */
  const [passwordVisibility,    setPasswordVisibility]    = useState(false);
  const [confirmPassVisibility, setConfirmPassVisibility] = useState(false);
  const [isSubmitted,           setIsSubmitted]           = useState(false);

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

    if (loading) toast.loading("Loading...");

    if (error) {
      toast.dismiss();
      toast.error(message ?? "An error occurred", {
        action: { label: "Retry", onClick: () => reset() },
      });
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(message, { duration: 1500 });
      setTimeout(() => router.push("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }
  }, [error, loading, message, isSubmitted]);

  /* ---------------------------------- Render UI -------------------------------- */
  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      {/* Left Section */}
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
        <div className="h-fit w-[60%] flex flex-col items-stretch gap-3 tablet-lg:w-[80%] tablet-md:py-10">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="phone-xl:text-2xl">
              Set Up Your New Password
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              {tokenFromUrl
                ? "Create a strong password to keep your account safe."
                : "Paste the token from your email, then enter a new password."}
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Token field — hidden when auto-filled from URL query param */}
            {!tokenFromUrl && (
              <Input
                prefix={<LucideKey />}
                placeholder="Token (from your email)"
                {...register("token")}
                validationMessage={errors.token?.message}
              />
            )}

            <Input
              prefix={<LucideLockKeyhole />}
              suffix={
                passwordVisibility ? (
                  <LucideEyeClosed onClick={() => setPasswordVisibility(false)} />
                ) : (
                  <LucideEye onClick={() => setPasswordVisibility(true)} />
                )
              }
              type={passwordVisibility ? "text" : "password"}
              placeholder="New Password"
              {...register("password")}
              validationMessage={errors.password?.message}
            />
            <Input
              prefix={<LucideLockKeyhole />}
              suffix={
                confirmPassVisibility ? (
                  <LucideEyeClosed onClick={() => setConfirmPassVisibility(false)} />
                ) : (
                  <LucideEye onClick={() => setConfirmPassVisibility(true)} />
                )
              }
              type={confirmPassVisibility ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              validationMessage={errors.confirmPassword?.message}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section: Image Poster */}
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-md:h-[60%] tablet-md:p-10">
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
