"use client";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themes/theme-store";
import { setCookie } from "cookies-next";
import { LucideLogIn, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import LogoComponent from "@/components/utils/brand/logo";

export default function Header({ className }: { className?: string }) {
  /* ----------------------------- API Integration ---------------------------- */
  const { theme, toggleTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <nav className={cn("mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10", className)}>
      {/* Left Menu Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LogoComponent className="!h-14 sm:!h-16 xl:!h-20 w-auto shrink-0" />
        <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2.5">
          <Button variant="ghost">Products</Button>
          <Button variant="ghost">Learn</Button>
          <Button variant="ghost">Safety</Button>
          <Button variant="ghost">Support</Button>
        </div>
      </div>

      {/* Right Menu Section */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
        <Button variant="outline" onClick={toggleTheme}>
          {mounted && resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
        </Button>
        <Link href="/login">
          <Button className="text-xs sm:text-sm">
            Login
            <LucideLogIn />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
