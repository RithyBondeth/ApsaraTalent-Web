"use client";

import signupBlackSvg from "@/assets/svg/signup-black.svg";
import signupWhiteSvg from "@/assets/svg/signup-white.svg";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
  /* --------------------------------- Utils --------------------------------- */
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  /* -------------------- Get Current Image Based on Theme -------------------- */
  // Only resolve the theme after mounting — avoids SSR/client hydration mismatch
  // Because resolvedTheme is undefined on the server.
  const currentTheme = mounted ? resolvedTheme : "light";
  const signupImage = currentTheme === "dark" ? signupBlackSvg : signupWhiteSvg;

  return (
    /* ------------------------------- Render UI ------------------------------- */
    <div className="min-h-screen w-full flex items-stretch overflow-x-hidden">
      {/* Children Section */}
      <div className="w-1/2 min-h-screen flex justify-center items-center px-8 py-10 tablet-xl:w-full tablet-xl:min-h-screen tablet-xl:items-start tablet-xl:px-4 tablet-xl:py-6">
        <div className="w-full max-w-[680px]">{children}</div>
      </div>

      {/* Image Poster Section */}
      <div className="w-1/2 min-h-screen flex justify-center items-center bg-primary px-8 py-10 tablet-xl:hidden">
        <Image
          src={signupImage}
          alt="signup"
          className="h-auto w-full max-w-[620px]"
          priority
        />
      </div>
    </div>
  );
}
