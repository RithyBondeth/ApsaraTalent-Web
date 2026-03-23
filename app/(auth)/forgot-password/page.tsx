"use client";

import forgotPasswordWhiteSvg from "@/assets/svg/forgot-password-white.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { isEmailInput } from "@/utils/extensions/check-email-input";
import { isNumberPhoneInput } from "@/utils/extensions/check-phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowLeft, LucideMail, LucidePhone } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, TForgotPasswordForm } from "./validate";

export default function ForgotPasswordPage() {
  /* ------------------------------- All States ------------------------------ */
  // Utils
  const router = useRouter();

  // Forgot Password Helpers
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

    if (loading) toast.loading("Loading...");

    if (error) {
      toast.dismiss();
      toast.error(message ?? "An error occurred", {
        action: { label: "Retry", onClick: () => reset() },
      });
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(message, { duration: 1000 });
      setTimeout(() => router.push("/reset-password"), 1000);
    }
  }, [error, message, loading, isSubmitted]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      {/* Left Section */}
      <div className="w-1/2 flex justify-center items-center bg-primary-foreground tablet-md:h-[40%]">
        <div className="size-[60%] flex flex-col items-stretch gap-3 tablet-md:justify-center tablet-md:size-full tablet-md:pb-10 tablet-md:p-5">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="tablet-sm:text-2xl">
              Forgot your Password?
            </TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">
              Enter your Email or Mobile. We will help you reset your password.
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            action=""
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              placeholder="Email or Mobile"
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
              <Button type="button" onClick={() => router.push("/login")}>
                <LucideArrowLeft />
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section: Image Poster Section */}
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-md:h-[60%]">
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
