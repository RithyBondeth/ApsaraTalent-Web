"use client";

import signupBlackSvg from "@/assets/svg/signup-black.svg";
import signupWhiteSvg from "@/assets/svg/signup-white.svg";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
  // Utils
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Get Image Based On Theme
  const currentTheme = mounted ? resolvedTheme : "light";
  const signupImage = currentTheme === "dark" ? signupBlackSvg : signupWhiteSvg;

  return (
    <div className="h-screen w-screen flex items-center tablet-xl:flex-col tablet-xl:[&>div]:w-full">
      {/* Children Section */}
      <div className="w-1/2 h-full flex justify-center items-center tablet-lg:h-fit tablet-xl:[&>div]:pb-20 phone-xl:!px-0 [&>div]:phone-xl:!px-5 [&>div]:phone-xl:!mt-8">
        {children}
      </div>

      {/* Image Poster Section */}
      <div className="w-1/2 h-full flex justify-center items-center bg-primary tablet-xl:p-10">
        <Image src={signupImage} alt="signup" height={undefined} width={600} />
      </div>
    </div>
  );
}
