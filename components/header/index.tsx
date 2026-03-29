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
    <nav
      className={cn("flex justify-between items-center py-3 px-6", className)}
    >
      {/* Left Menu Section */}
      <div className="flex items-center tablet-lg:[&>button]:hidden">
        <LogoComponent className="mr-3 !h-20 w-auto" />
        <Button variant="ghost">Products</Button>
        <Button variant="ghost">Learn</Button>
        <Button variant="ghost">Safety</Button>
        <Button variant="ghost">Support</Button>
      </div>

      {/* Right Menu Section */}
      <div className="flex items-center gap-5 tablet-sm:gap-2">
        <Button variant="outline" onClick={toggleTheme}>
          {mounted && resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
        </Button>
        <Link href="/login">
          <Button className="tablet-sm:text-xs">
            Login
            <LucideLogIn />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
