"use client";

import { cn } from "@/lib/utils";
import { LucideLogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import LogoComponent from "@/components/utils/brand/logo";
import LanguageToggle from "@/components/utils/toggles/language-toggle";
import ThemeToggle from "@/components/utils/toggles/theme-toggle";
import { useTranslations } from "next-intl";

export default function Header({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const t = useTranslations("landing");

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
          <Link href="/product">
            <Button variant="ghost">{t("products")}</Button>
          </Link>
          <Link href="/learn">
            <Button variant="ghost">{t("learn")}</Button>
          </Link>
          <Link href="/safety">
            <Button variant="ghost">{t("safety")}</Button>
          </Link>
          <Link href="/support">
            <Button variant="ghost">{t("support")}</Button>
          </Link>
        </div>
      </div>

      {/* Right Menu Section */}
      <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 shrink-0">
        {/* Language Toggle Section */}
        <LanguageToggle />

        {/* Theme Toggle Section */}
        <ThemeToggle />

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
