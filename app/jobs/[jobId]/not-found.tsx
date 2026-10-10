"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideSearchX } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * Shown for every reason a posting is not public — gone, expired, taken down,
 * or from a suspended account. The API answers all four identically so that
 * walking ids tells a scraper nothing, and this page keeps that promise by
 * saying the same thing in all four cases.
 */
export default function JobNotFound() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("publicJob");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-md flex-col gap-5 border border-border bg-card p-6 shadow-hard sm:p-8">
        <span className="flex size-10 items-center justify-center border border-border bg-muted/60 [&>svg]:size-5">
          <LucideSearchX />
        </span>
        <h1 className="text-lg font-black tracking-[-0.01em]">
          {t("notFoundTitle")}
        </h1>
        <TypographyMuted className="text-sm leading-6">
          {t("notFoundBody")}
        </TypographyMuted>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/search/employee">{t("browseJobs")}</Link>
        </Button>
      </div>
    </main>
  );
}
