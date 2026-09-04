"use client";

import { cn } from "@/lib/utils";
import {
  LucideBriefcase,
  LucideClipboardList,
  LucideFlag,
  LucideLayoutDashboard,
  LucideLifeBuoy,
  LucideUsers,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TAdminNavItem = {
  href: string;
  labelKey:
    "overview" | "users" | "jobs" | "reports" | "problemReports" | "audit";
  icon: LucideIcon;
};

const NAV_ITEMS: TAdminNavItem[] = [
  { href: "/admin", labelKey: "overview", icon: LucideLayoutDashboard },
  { href: "/admin/users", labelKey: "users", icon: LucideUsers },
  { href: "/admin/jobs", labelKey: "jobs", icon: LucideBriefcase },
  { href: "/admin/reports", labelKey: "reports", icon: LucideFlag },
  {
    href: "/admin/problem-reports",
    labelKey: "problemReports",
    icon: LucideLifeBuoy,
  },
  { href: "/admin/audit", labelKey: "audit", icon: LucideClipboardList },
];

export function AdminNav() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <nav
      aria-label={t("label")}
      className="flex flex-wrap items-center gap-1 border border-border bg-card p-1 shadow-hard-xs"
    >
      {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
        // "/admin" must not light up on "/admin/users", so the root is matched
        // exactly while the sections match their subtree.
        const isActive =
          href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-hard-primary-xs"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon aria-hidden className="size-3.5 shrink-0" />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
