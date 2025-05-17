"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideArrowLeft,
  LucideCheck,
  LucideInfo,
  LucideMail,
  LucidePhone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import forgotPasswordWhiteSvg from "@/assets/svg/forgot-password-white.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, TForgotPasswordForm } from "./validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { ClipLoader } from "react-spinners";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { isEmailInput } from "@/utils/extensions/check-email-input";
import { isNumberPhoneInput } from "@/utils/extensions/check-phone-input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const { toast } = useToast();
  const { loading, error, message, forgotPassword } = useForgotPasswordStore();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: TForgotPasswordForm) => {
    await forgotPassword(data.forgotPassword);
    console.log("Message: ", message);
  };

  useEffect(() => {
    if (loading) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ClipLoader />
            <TypographySmall className="font-medium">
              Loading...
            </TypographySmall>
          </div>
        ),
      });
    }

    if (error) {
      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-row items-center gap-2">
            <LucideInfo />
            <TypographySmall className="font-medium leading-loose">
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
    }

    if (!loading && !error && message) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium">{message}</TypographySmall>
          </div>
        ),
        duration: 1500,
      });
      router.push("/reset-password");
    }
  }, [error, message, loading]);

  return (
    <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
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
                  <LucideMail />
                ) : isNumberPhoneInput(inputValue) ? (
                  <LucidePhone />
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
