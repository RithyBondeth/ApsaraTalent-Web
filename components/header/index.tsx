"use client";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { setCookie } from "cookies-next";
import { LucideLogIn, LucideMoon, LucideSun, LucideGlobe } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import LogoComponent from "@/components/utils/brand/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export default function Header({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const { theme, toggleTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const t = useTranslations("landing");

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <nav
      className={cn(
        "mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10",
        className,
      )}
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LogoComponent className="!h-14 sm:!h-16 xl:!h-20 w-auto shrink-0" />
        <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2.5">
          <Button variant="ghost">{t("products")}</Button>
          <Button variant="ghost">{t("learn")}</Button>
          <Button variant="ghost">{t("safety")}</Button>
          <Button variant="ghost">{t("support")}</Button>
        </div>
      </div>

      {/* Right Menu Section */}
      <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 shrink-0">
        {/* Language Switcher Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <LucideGlobe className="size-[1.2rem]" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold leading-none bg-amber-500 text-white dark:text-black rounded-full size-3.5 flex items-center justify-center">
                {language === "en" ? "EN" : "KH"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                language === "en" && "bg-accent",
              )}
            >
              <span className="text-base">🇬🇧</span>
              <span className="font-medium">English</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("km")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                language === "km" && "bg-accent",
              )}
            >
              <span className="text-base">🇰🇭</span>
              <span className="font-medium">ខ្មែរ</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle Section */}
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {mounted && resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
        </Button>

        {/* Login Section */}
        <Link href="/login">
          <Button className="text-xs sm:text-sm">
            {t("login")}
            <LucideLogIn />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
