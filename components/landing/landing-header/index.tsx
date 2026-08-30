"use client";

import { cn } from "@/lib/utils";
import { LucideArrowRight, LucideLogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LogoComponent from "@/components/utils/brand/logo";
import Switcher from "@/components/utils/switcher";

/* ---------------------------------------------------------------------------
 * The header shared by the landing page, its sub-pages, and the legal pages.
 *
 * `sessionRole` is the `auth-session-role` cookie, read on the server by the
 * page that renders this and threaded down, so the button is right on first
 * paint rather than flipping after hydration.
 *
 * It has to be passed rather than inferred here because /privacy and /terms are
 * the one place this header meets a signed-in reader: they are not in the
 * middleware matcher, so nothing redirects them, and a person arriving from
 * Settings was being shown a Login button for a session they already had. The
 * landing routes never hit this case — middleware sends authenticated users to
 * /feed — but they pass the prop too, so the header has one behaviour.
 *
 * The three states mirror the middleware exactly: no cookie is a guest, "none"
 * is signed in but still owes the role step, anything else is a full session.
 * ------------------------------------------------------------------------- */

export default function Header({
  className,
  sessionRole = null,
}: {
  className?: string;
  sessionRole?: string | null;
}) {
  /* ---------------------------------- Utils ---------------------------------- */
  const t = useTranslations("landing");

  const session =
    sessionRole === null
      ? { href: "/login", label: t("login"), Icon: LucideLogIn }
      : sessionRole === "none"
        ? {
            href: "/signup/option",
            label: t("finishSetup"),
            Icon: LucideArrowRight,
          }
        : { href: "/feed", label: t("openApp"), Icon: LucideArrowRight };

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

        {/* Session Section */}
        <Link href={session.href}>
          <Button
            className="size-10 rounded-none p-0 text-xs shadow-none sm:h-10 sm:w-auto sm:px-5 sm:text-sm"
            aria-label={session.label}
          >
            <span className="hidden sm:inline">{session.label}</span>
            <session.Icon />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
