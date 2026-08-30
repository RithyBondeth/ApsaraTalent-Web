"use client";

import { Button } from "@/components/ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IAdminPaginationProps } from "./props";

/**
 * Prev/next over a server-paged list.
 *
 * Deliberately not the numbered `components/ui/pagination`: these lists are
 * unbounded (every user on the platform), so a full page-number row would
 * render hundreds of links, and the admin navigates by filtering rather than
 * by jumping to page 47.
 */
export function AdminPagination({
  page,
  limit,
  total,
  onPageChange,
  busy = false,
}: IAdminPaginationProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.common");

  const lastPage = Math.max(1, Math.ceil(total / limit));
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  /* -------------------------------- Render UI ------------------------------- */
  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <p className="text-xs tabular-nums text-muted-foreground">
        {t("showing", { first, last, total })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <LucideChevronLeft aria-hidden />
          {t("previous")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy || page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          {t("next")}
          <LucideChevronRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
