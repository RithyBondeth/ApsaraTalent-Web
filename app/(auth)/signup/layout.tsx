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
        <div className="h-screen w-screen flex justify-between items-stretch">
            <div className="h-screen w-1/2 flex justify-center items-center">{children}</div>
            <div className="w-1/2 flex justify-center items-center bg-primary">
                <Image src={signupImage} alt="signup" height={undefined} width={600}/>
            </div>
        </div>
    )
}