"use client";

import LogoComponent from "@/components/utils/brand/logo";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LandingFooter() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("landing");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      {/* Dotted Background Section */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand Section */}
          <div className="flex flex-col gap-3 max-w-xs">
            <LogoComponent className="!h-14 w-auto self-start" />
            <TypographyMuted className="!text-xs !leading-relaxed">
              {t("angkorWatDescription")}
            </TypographyMuted>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-8 sm:gap-12 md:gap-16">
            {/* Platform Section */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">
                {t("footerPlatform")}
              </span>
              <Link href="/login">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("login")}
                </TypographyMuted>
              </Link>
              <Link href="/signup/option">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("getStarted")}
                </TypographyMuted>
              </Link>
            </div>

            {/* Products Section */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">{t("products")}</span>
              <Link href="/product">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("products")}
                </TypographyMuted>
              </Link>
              <Link href="/learn">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("learn")}
                </TypographyMuted>
              </Link>
              <Link href="/safety">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("safety")}
                </TypographyMuted>
              </Link>
              <Link href="/support">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("support")}
                </TypographyMuted>
              </Link>
            </div>

            {/* Legal Section */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">{t("footerLegal")}</span>
              <Link href="/privacy">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("footerPrivacy")}
                </TypographyMuted>
              </Link>
              <Link href="/terms">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  {t("footerTerms")}
                </TypographyMuted>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="mt-10 pt-6 border-t border-border/40">
          <TypographyMuted className="!text-xs text-center">
            &copy; {new Date().getFullYear()} Apsara Talent.{" "}
            {t("footerAllRightsReserved")}
          </TypographyMuted>
        </div>
      </div>
    </footer>
  );
}
