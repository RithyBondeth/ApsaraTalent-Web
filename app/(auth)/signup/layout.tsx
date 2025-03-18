"use client"

import { ReactNode } from "react"
import signupWhiteSvg from "@/assets/svg/signup-white.svg";
import signupBlackSvg from "@/assets/svg/signup-black.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
 
    // Determine which image to display (avoid SSR issues)
    const currentTheme = mounted ? resolvedTheme : "light";
    const signupImage = currentTheme === "dark" ? signupBlackSvg : signupWhiteSvg;

    return (
        <div className="h-screen w-screen flex items-center tablet-xl:flex-col tablet-xl:[&>div]:w-full">
            <div className="w-1/2 h-full flex justify-center items-center tablet-lg:h-fit tablet-xl:[&>div]:pb-20 phone-xl:!px-0 [&>div]:phone-xl:!px-5 [&>div]:phone-xl:!mt-8">{children}</div>
            <div className="w-1/2 h-full flex justify-center items-center bg-primary tablet-xl:p-10">
                <Image src={signupImage} alt="signup" height={undefined} width={600}/>
            </div>
        </div>
    )
}