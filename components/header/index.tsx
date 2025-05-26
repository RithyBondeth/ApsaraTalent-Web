"use client"

import { Button } from "../ui/button";
import LogoComponent from "../utils/logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideMoon, LucideSun } from "lucide-react";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { setCookie } from "cookies-next";

export default function Header({ className }: { className?: string }) {
    const { theme, toggleTheme } = useThemeStore();
    const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme); // Save theme for SSR
  }, [theme, setTheme]);

    return (
        <nav className={cn("flex justify-between items-center py-3 px-6", className)}>
            {/* Left Menu Section */}
            <div className="flex items-center tablet-lg:[&>button]:hidden">
                <LogoComponent className="mr-5"/>
                <Button variant="ghost">Products</Button>
                <Button variant="ghost">Learn</Button>
                <Button variant="ghost">Safety</Button>
                <Button variant="ghost">Support</Button>
            </div>

            {/* Right Menu Section */}
            <div className="flex items-center gap-5 tablet-sm:gap-2">
                <Button variant="outline" onClick={toggleTheme}>
                    {resolvedTheme === 'dark' ? <LucideSun/> : <LucideMoon/> }
                </Button>
                <Link href="/login">
                    <Button className="tablet-sm:text-xs">Login</Button>
                </Link>
            </div>
        </nav>
    )
}