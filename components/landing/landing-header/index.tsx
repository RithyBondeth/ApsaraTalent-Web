"use client";

import { cn } from "@/lib/utils";
import { LucideArrowRight } from "lucide-react";
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
      aria-label="Apsara Talent"
      className={cn(
        "mx-auto flex h-16 w-full max-w-[1600px] items-stretch justify-between border-x border-border",
        className,
      )}
    >
      {/* Left Menu Section */}
      <div className="flex min-w-0 items-stretch">
        <Link
          href="/"
          aria-label="Apsara Talent home"
          className="flex min-w-[150px] items-center border-r border-border px-5 transition-colors hover:bg-muted/55 sm:min-w-[220px] sm:px-7"
        >
          <LogoComponent className="h-10 w-auto" priority />
        </Link>
        <div className="hidden items-stretch lg:flex">
          <Link href="/product">
            <Button
              variant="ghost"
              className="h-full border-r border-border px-6"
            >
              {t("products")}
            </Button>
          </Link>
          <Link href="/learn">
            <Button
              variant="ghost"
              className="h-full border-r border-border px-6"
            >
              {t("learn")}
            </Button>
          </Link>
          <Link href="/safety">
            <Button
              variant="ghost"
              className="h-full border-r border-border px-6"
            >
              {t("safety")}
            </Button>
          </Link>
          <Link href="/support">
            <Button
              variant="ghost"
              className="h-full border-r border-border px-6"
            >
              {t("support")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Menu Section */}
      <div className="flex shrink-0 items-stretch">
        {/* Language and theme utility cells */}
        <div className="flex items-stretch border-l border-border">
          <Switcher inline variant="grid" className="h-full" />
        </div>

        {/* Login Section */}
        <Link href="/login" className="flex">
          <Button
            className="h-full min-w-16 rounded-none border-l border-foreground bg-foreground px-5 text-xs text-background shadow-none hover:bg-foreground/85 hover:text-background sm:min-w-[148px] sm:px-7 sm:text-sm"
            aria-label={t("login")}
          >
            <span className="hidden sm:inline">{t("login")}</span>
            <LucideArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
