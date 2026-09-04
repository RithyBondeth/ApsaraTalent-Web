"use client";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminListSkeleton } from "@/components/admin/admin-list-skeleton";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import { formatShortDate } from "@/utils/functions/date";
import { LucideClipboardList, LucideFileClock } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 50;

export default function AdminAuditPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.audit");
  const tAction = useTranslations("admin.userDetail.action");

  /* ----------------------------- API Integration ---------------------------- */
  const { audit, loadingAudit, error, getAudit } = useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  const [page, setPage] = useState(1);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    void getAudit({ page, limit: PAGE_SIZE });
  }, [page, getAudit]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        stats={
          audit
            ? [
                {
                  label: t("statEntries"),
                  value: audit.total.toLocaleString(),
                  icon: LucideClipboardList,
                },
              ]
            : undefined
        }
      />

      {/* Log Section */}
      <section className="border border-border bg-card p-5 shadow-hard">
        {loadingAudit && !audit ? (
          <AdminListSkeleton count={8} rowClassName="h-12" />
        ) : error && !audit ? (
          <PageState variant="error" title={error} compact />
        ) : audit && audit.items.length === 0 ? (
          <PageState
            variant="empty"
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            icon={LucideFileClock}
            compact
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="py-3 pr-4 font-bold">{t("colWhen")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colAction")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colActor")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colTarget")}</th>
                    <th className="py-3 font-bold">{t("colReason")}</th>
                  </tr>
                </thead>
                <tbody>
                  {audit?.items.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border align-top last:border-b-0"
                    >
                      <td className="py-3 pr-4 text-xs tabular-nums text-muted-foreground">
                        {formatShortDate(entry.createdAt)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-foreground">
                        {tAction(entry.action)}
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {/* Snapshot, so a departed admin's decisions stay
                            attributable after their account is deleted. */}
                        {entry.actorEmail ?? t("deletedAdmin")}
                      </td>
                      <td className="py-3 pr-4 text-xs">
                        {entry.targetUserId ? (
                          <Link
                            href={`/admin/users/${entry.targetUserId}`}
                            className="text-foreground underline-offset-4 hover:text-primary hover:underline"
                          >
                            {t("viewAccount")}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {entry.reason ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {audit ? (
              <AdminPagination
                page={audit.page}
                limit={audit.limit}
                total={audit.total}
                busy={loadingAudit}
                onPageChange={setPage}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
