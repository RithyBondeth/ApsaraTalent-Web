import LogoComponent from "@/components/utils/brand/logo";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      {/* Dotted background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <LogoComponent className="!h-14 w-auto self-start" />
            <TypographyMuted className="!text-xs !leading-relaxed">
              Cambodia&apos;s leading talent platform connecting professionals
              and companies for a brighter future.
            </TypographyMuted>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">Platform</span>
              <Link href="/login">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  Login
                </TypographyMuted>
              </Link>
              <Link href="/signup/option">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  Sign Up
                </TypographyMuted>
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">Legal</span>
              <Link href="/privacy-policy">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  Privacy Policy
                </TypographyMuted>
              </Link>
              <Link href="/terms-of-service">
                <TypographyMuted className="!text-xs hover:text-foreground transition-colors cursor-pointer">
                  Terms of Service
                </TypographyMuted>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/40">
          <TypographyMuted className="!text-xs text-center">
            &copy; {new Date().getFullYear()} Apsara Talent. All rights
            reserved.
          </TypographyMuted>
        </div>
      </div>
    </footer>
  );
}
