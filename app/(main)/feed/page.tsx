"use client"

import FeedCard from "@/components/feed-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function FeedPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
      // Determine which image to display (avoid SSR issues)
      const currentTheme = mounted ? resolvedTheme : "light";
      const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;

    return (
        <div>
            {/* Header Section */}
            <div className='flex items-start justify-between gap-5'>
                <div className="flex flex-col items-start gap-5">
                    <TypographyH2 className="leading-relaxed">Apply to your favorite jobs from anywhere.</TypographyH2>
                    <TypographyMuted className="leading-relaxed">Find your dream job with ease and apply to it from anywhere.</TypographyMuted>
                </div>
                <Image src={feedImage} alt='feed' height={300} width={400}/>
            </div>
            <FeedCard/>
        </div>
    )
}