"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideCheck, LucideInfo, LucidePhone } from "lucide-react";
import { useEffect, useState } from "react";
import LogoComponent from "@/components/utils/logo";
import phoneNumberWhiteSvg from "@/assets/svg/phone-number-white.svg";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneLoginSchema, TPhoneLoginForm } from "./validation";
import { useRouter } from "next/navigation";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useLoginOTPStore } from "@/stores/apis/auth/login-otp.store";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ClipLoader } from "react-spinners";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { ToastAction } from "@/components/ui/toast";

export default function PhoneNumberPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { toast } = useToast();
  const { setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();
  const { loading, error, message, isSuccess, loginOtp } = useLoginOTPStore();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<TPhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
  });

  const onSubmit = async (data: TPhoneLoginForm) => {
    setIsSubmitted(true);
    setBasicPhoneSignupData({
      phone: data.phone,
      rememberMe: data.rememberMe,
    });
    const phone = data.phone.replace("0", "+855");
    await loginOtp(phone);
  };

  useEffect(() => {
    if(!isSubmitted) return;
    
    if (isSuccess) {
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
      setTimeout(() => router.replace("/login/phone-number/phone-otp"), 1000);
    }

    if (loading)
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ClipLoader />
            <TypographySmall className="font-medium">
              Logging in...
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
  }, [error, loading, isSuccess, message, isSubmitted]);

  return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="h-fit w-[70%] flex flex-col items-stretch gap-3 tablet-lg:w-[85%] tablet-md:w-[95%] tablet-md:py-10">
          {/* Title Section */}
          <div className="mb-5">
            <LogoComponent />
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
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-sm:p-10">
        <Image
          src={phoneNumberWhiteSvg}
          alt="phone-number"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
