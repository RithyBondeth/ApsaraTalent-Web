import Image from "next/image";
import { ReactNode } from "react";
import {
  signupBlackSvg,
  signupWhiteSvg,
} from "@/utils/constants/asset.constant";

export default function SignupLayout({ children }: { children: ReactNode }) {
  /* ------------------------------- Render UI ------------------------------- */
  return (
    <div className="min-h-screen w-full flex items-stretch overflow-x-hidden">
      {/* Children Section */}
      <div className="w-1/2 min-h-screen flex justify-center items-center px-6 sm:px-8 py-8 sm:py-10 tablet-xl:w-full tablet-xl:min-h-screen tablet-xl:items-start tablet-xl:px-4 tablet-xl:py-6">
        <div className="w-full max-w-[680px] animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          {children}
        </div>
      </div>

      {/* Image Poster Section */}
      <div className="w-1/2 min-h-screen flex justify-center items-center bg-primary px-8 py-10 relative overflow-hidden tablet-xl:hidden">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-10 size-32 rounded-full bg-white/[0.03]" />

        <Image
          src={signupWhiteSvg}
          alt="signup"
          className="h-auto w-full max-w-[620px] relative z-10 dark:hidden"
          priority
        />
        <Image
          src={signupBlackSvg}
          alt="signup"
          className="hidden h-auto w-full max-w-[620px] relative z-10 dark:block"
          priority
        />
      </div>
    </div>
  );
}
