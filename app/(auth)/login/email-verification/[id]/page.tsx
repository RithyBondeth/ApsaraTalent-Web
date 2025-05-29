"use client";

import Image from "next/image";
import emailVerificationWhiteSvg from "@/assets/svg/email-verification-black.svg";
import emailVerificationBlackSvg from "@/assets/svg/email-verification-white.svg";
import { useTheme } from "next-themes";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { LucideCheck, LucideInfo, LucideMail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVerifyEmailStore } from "@/stores/apis/auth/verify-email.store";
import { ClipLoader } from "react-spinners";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function EmailVerificationPage() {
  const { resolvedTheme } = useTheme();
  const params = useParams();
  const token = params?.id;

  const { toast } = useToast();
  const router = useRouter();
  const { loading, error, message, verifyEmail } = useVerifyEmailStore();

  const currentTheme = resolvedTheme || "light";
  const emailVerificationImage =
    currentTheme === "dark"
      ? emailVerificationWhiteSvg
      : emailVerificationBlackSvg;

  const handleVerifyEmail = async () => {
    await verifyEmail(token as string);
  }

  useEffect(() => {
    if (loading)
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
        )
      });

    if (!loading && !error && message) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">{message}</TypographySmall>
          </div>
        ),
        duration: 1500,
      });
      router.push("/login");
    }
  }, [error, loading, message]);

  return (
    <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
      <div className="w-1/2 flex justify-center items-center bg-primary-foreground tablet-md:h-[40%]">
        <div className="size-[65%] flex flex-col items-stretch gap-3 tablet-md:justify-center tablet-md:size-full tablet-md:pb-10 tablet-md:p-5">
          {/* Title Section */}
          <div className="mb-5">
            <TypographyH2 className="tablet-sm:text-2xl">Email Verification</TypographyH2>
            <TypographyMuted className="text-md tablet-sm:text-sm">Please verify you email by clicking the verify button below.</TypographyMuted>
          </div>
          {/* Button Section */}
          <Button onClick={() => handleVerifyEmail()}>
            <LucideMail/>
            Verify
          </Button>
        </div>
      </div>
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
