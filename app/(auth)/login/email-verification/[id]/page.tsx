"use client";

import emailVerificationWhiteSvg from "@/assets/svg/email-verification-black.svg";
import emailVerificationBlackSvg from "@/assets/svg/email-verification-white.svg";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { LucideMail } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerificationPage() {
  // Utils
  const { resolvedTheme } = useTheme();
  const params = useParams();
  const token = params?.id;
  const router = useRouter();

  // Verify Email Helper
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // API Integration
  const { loading, error, message, verifyEmail } = useVerifyEmailStore();

  // Verify Email Function
  const handleVerifyEmail = async () => {
    setIsSubmitted(true);
    await verifyEmail(token as string);
  };

  // Verify Email Effect
  useEffect(() => {
    if (!isSubmitted) return;

    if (loading) toast.loading("Verifying...");

    if (error) {
      toast.dismiss();
      toast.error(message ?? "Verification failed");
    }

    if (!loading && !error && message) {
      toast.dismiss();
      toast.success(message, { duration: 1500 });
      setTimeout(() => router.push("/login"), 1000);
    }
  }, [error, loading, message, isSubmitted]);

  // Get Current Image Based on Theme
  const currentTheme = resolvedTheme || "light";
  const emailVerificationImage =
    currentTheme === "dark"
      ? emailVerificationWhiteSvg
      : emailVerificationBlackSvg;

  return (
    <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      <div className="w-1/2 flex justify-center items-center bg-primary-foreground tablet-md:h-[40%]">
        <div className="size-[65%] flex flex-col items-stretch gap-3 tablet-md:justify-center tablet-md:size-full tablet-md:pb-10 tablet-md:p-5">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="tablet-sm:text-2xl">
              Email Verification
            </TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">
              Please verify you email by clicking the verify button below.
            </TypographyMuted>
          </div>

          {/* Button Section */}
          <Button onClick={() => handleVerifyEmail()}>
            <LucideMail />
            Verify
          </Button>
        </div>
      </div>
      
      {/* Image Poster Section */}
      <div className="w-1/2 flex justify-center items-center bg-primary tablet-lg:p-10">
        <Image
          src={emailVerificationImage}
          alt="login"
          height={undefined}
          width={600}
        />
      </div>
    </div>
  );
}
