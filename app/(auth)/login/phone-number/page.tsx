"use client";

import phoneNumberWhiteSvg from "@/assets/svg/phone-number-white.svg";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { phoneLoginSchema, TPhoneLoginForm } from "./validation";

export default function PhoneNumberPage() {
  /*--------------------------------------- All States ---------------------------------------*/
  // Utils
  const router = useRouter();

  // Phone OTP Helpers
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();

  // API Integration
  const { loading, error, message, isSuccess, loginOtp } = useLoginOTPStore();

  /*------------------------------ React Hook Form: Phone OTP Form -----------------------------*/
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<TPhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
  });

  /*--------------------------------- Phone OTP Function ---------------------------------*/
  const onSubmit = async (data: TPhoneLoginForm) => {
    setIsSubmitted(true);
    setBasicPhoneSignupData({
      phone: data.phone ?? "",
      rememberMe: data.rememberMe,
    });
    const phone = data.phone ? data.phone.replace("0", "+855") : "";
    await loginOtp(phone);
  };

  /*---------------------------------- Phone OTP Effect ----------------------------------*/
  useEffect(() => {
    if (!isSubmitted) return;

    if (isSuccess) {
      toast.dismiss();
      toast.success(message ?? "OTP sent!", { duration: 1000 });
      setTimeout(() => router.replace("/login/phone-number/phone-otp"), 1000);
    }

    if (loading) toast.loading("Logging in...");

    if (error) {
      toast.dismiss();
      toast.error(message ?? "An error occurred", {
        action: { label: "Retry", onClick: () => reset() },
      });
    }
  }, [error, loading, isSuccess, message, isSubmitted]);

  return (
    /*-------------------------------------------- Main Content --------------------------------------------*/
    <div className="h-screen w-screen flex justify-between items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      {/* Left Section */}
      <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="h-fit w-[70%] flex flex-col items-stretch gap-3 tablet-lg:w-[85%] tablet-md:w-[95%] tablet-md:py-10">
          {/* Title Section */}
          <div className="mb-5">
            <LogoComponent className="!h-24 w-auto" withoutTitle />
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

      {/* Right Section: Image Poster Section */}
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
