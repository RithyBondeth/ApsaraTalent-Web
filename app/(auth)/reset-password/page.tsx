"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideCheck,
  LucideEye,
  LucideEyeClosed,
  LucideInfo,
  LucideKey,
  LucideLockKeyhole,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import resetPasswordWhiteSvg from "@/assets/svg/reset-password-white.svg";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, TResetPasswordForm } from "./validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useResetPasswordStore } from "@/stores/apis/auth/reset-password.store";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";

export default function ResetPasswordPage() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] =
    useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const { loading, error, message, resetPassword } = useResetPasswordStore();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: TResetPasswordForm) => {
    setIsSubmitted(true);
    await resetPassword(data.token, data.password, data.confirmPassword);
    console.log({
      token: data.token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  useEffect(() => {
    if (!isSubmitted) return;

    if (loading)
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={50} loop />
            <TypographySmall className="font-medium">
              Loading...
            </TypographySmall>
          </div>
        ),
      });

    if (error)
      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-row items-center gap-2">
            <LucideInfo />
            <TypographySmall className="font-medium leading-relaxed">
              {message}
            </TypographySmall>
          </div>
        ),
        action: (
          <ToastAction altText="Try again" onClick={() => reset()}>
            Retry
          </ToastAction>
        ),
      });

    if (!loading && !error && message) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">
              {message}
            </TypographySmall>
          </div>
        ),
        duration: 1500,
      });
      setTimeout(() => router.push("/login"), 1000);
    }
  }, [error, loading, message, isSubmitted]);

  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
        <div className="h-fit w-[60%] flex flex-col items-stretch gap-3 tablet-lg:w-[80%] tablet-md:py-10">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="phone-xl:text-2xl">
              Set Up Your New Password
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              Create a strong password to keep your account safe.
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              prefix={<LucideKey />}
              placeholder="Token"
              {...register("token")}
              validationMessage={errors.token?.message}
            />
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
              placeholder="Password"
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
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              validationMessage={errors.confirmPassword?.message}
            />
            <Button type="submit">Continue</Button>
          </form>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-md:p-10">
        <Image
          src={resetPasswordWhiteSvg}
          alt=""
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
