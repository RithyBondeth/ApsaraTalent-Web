"use client";

import { cn } from "@/lib/utils";
import { LucideLogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LogoComponent from "@/components/utils/brand/logo";
import Switcher from "@/components/utils/switcher";

export default function Header({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <nav
      className={cn(
        "mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-8">
        <LogoComponent className="!h-11 w-auto shrink-0" priority />
        <div className="hidden items-center gap-1 lg:flex">
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Combined Language + Theme Switcher */}
        <Switcher inline />

        {/* Login Section */}
        <Link href="/login">
          <Button
            className="size-10 rounded-none p-0 text-xs shadow-none sm:h-10 sm:w-auto sm:px-5 sm:text-sm"
            aria-label={t("login")}
          >
            <span className="hidden sm:inline">{t("login")}</span>
            <LucideLogIn />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
