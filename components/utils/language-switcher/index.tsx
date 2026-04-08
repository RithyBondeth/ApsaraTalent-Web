"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { setCookie } from "cookies-next";
import { LucideGlobe } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Compact language switcher for auth pages.
 * Renders as a fixed-position globe button in the top-right corner.
 */
export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
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
    </div>
  );
}
