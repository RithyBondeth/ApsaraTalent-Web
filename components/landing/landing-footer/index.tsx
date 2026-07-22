"use client";

import { GridRunners } from "@/components/ui/grid-runners";
import LogoComponent from "@/components/utils/brand/logo";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LandingFooter() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("landing");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <footer className="relative border-t border-border bg-background">
      {/* Grid Background Section */}
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <GridRunners
        className="landing-grid-runners opacity-35"
        density="quiet"
      />
      <div className="relative mx-auto max-w-7xl border-x border-border px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand Section */}
          <div className="flex flex-col gap-3 max-w-xs">
            <LogoComponent className="!h-12 w-auto self-start" />
            <TypographyMuted className="!text-xs !leading-relaxed">
              {t("matchVisualDescription")}
            </TypographyMuted>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 md:gap-x-16">
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
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <TypographyMuted className="!text-xs">
            &copy; {new Date().getFullYear()} Apsara Talent.{" "}
            {t("footerAllRightsReserved")}
          </TypographyMuted>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Apsara Talent · Cambodia
          </span>
        </div>
      </div>
    </footer>
  );
}
