"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import phoneOTPWhiteSvg from "@/assets/svg/phone-otp-white.svg";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/utils/error-message";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useEffect, useState } from "react";
import { LucideCheck, LucideInfo } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";

export default function PhoneOTPPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { toast } = useToast();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();
  const { loading, error, message, accessToken, refreshToken, verifyOtp } =
    useVerifyOTPStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ otp: string }>();
  const onSubmit = async (data: { otp: string }) => {
    setIsSubmitted(true);
    const phone = basicPhoneSignupData?.phone?.replace("0", "+855") ?? '';
    const user = await verifyOtp(
      phone,
      data.otp,
      basicPhoneSignupData?.rememberMe ?? true
    );

    if (user.role === "none" && !user.profileCompleted) {
      router.push("/signup/option");
    } else {
      router.push("/feed");
    }
  };

  useEffect(() => {
    if (!isSubmitted) return;

    if (accessToken && refreshToken) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">
              {message}
            </TypographySmall>
          </div>
        ),
        duration: 1000,
      });
      setTimeout(() => router.replace("/feed"), 1000);
    }

    if (loading)
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ApsaraLoadingSpinner size={40} loop/>
            <TypographySmall className="font-medium">
              Verifying your otp code...
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
  }, [
    loading,
    error,
    message,
    accessToken,
    refreshToken,
    isSubmitted,
  ]);


  return (
    <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground tablet-md:h-fit">
        <div className="w-[70%] flex flex-col items-stretch gap-3 tablet-md:w-[90%] tablet-md:py-10">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="phone-xl:text-2xl">
              OTP Verification
            </TypographyH2>
            <TypographyMuted className="text-md phone-xl:text-sm">
              We will sent you an one time password code on your phone number.
            </TypographyMuted>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch gap-5"
          >
            <Controller
              name="otp"
              control={control}
              defaultValue=""
              rules={{
                required: "OTP Code is required",
                minLength: {
                  value: 6,
                  message: "OTP must be 6 digits",
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col items-start gap-3">
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={1}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={2}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={4}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                      <InputOTPSlot
                        index={5}
                        className="input-otp-slot tablet-md:!size-10"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  <TypographySmall className="text-muted-foreground phone-xl:text-sm">
                    Enter your one time password code here.
                  </TypographySmall>
                  {errors.otp && (
                    <ErrorMessage>{errors.otp.message}</ErrorMessage>
                  )}
                </div>
              )}
            />
            <Button type="submit">Continue</Button>
          </form>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-md:p-10 tablet-md:h-full">
        <Image
          src={phoneOTPWhiteSvg}
          alt="phone-otp"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
