"use client";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import { formatShortDate } from "@/utils/functions/date";
import type { TReportStatus } from "@/utils/types/admin/admin.type";
import { LucideFlag, LucideInbox } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;

/** The transitions offered on a report, in the order an admin works them. */
const TRANSITIONS: TReportStatus[] = ["reviewed", "resolved", "dismissed"];

export default function AdminReportsPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.reports");
  const tStatus = useTranslations("admin.status");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    reports,
    loadingReports,
    saving,
    error,
    getReports,
    updateReportStatus,
  } = useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  // Opens on the queue that needs working, not on everything ever filed.
  const [status, setStatus] = useState<TReportStatus | "all">("pending");
  const [page, setPage] = useState(1);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    void getReports({
      page,
      limit: PAGE_SIZE,
      ...(status !== "all" ? { status } : {}),
    });
  }, [page, status, getReports]);

  /* --------------------------------- Handlers ------------------------------- */
  const handleTransition = async (
    reportId: string,
    next: TReportStatus,
  ): Promise<void> => {
    const ok = await updateReportStatus(reportId, { status: next });
    if (ok) toast.success(t("updated", { status: tStatus(next) }));
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        stats={
          reports
            ? [
                {
                  label: t("statInQueue"),
                  value: reports.total.toLocaleString(),
                  icon: LucideFlag,
                },
              ]
            : undefined
        }
      >
        <div className="mt-5 sm:max-w-56">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as TReportStatus | "all")}
          >
            <SelectTrigger aria-label={t("filterStatus")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{tStatus("pending")}</SelectItem>
              <SelectItem value="reviewed">{tStatus("reviewed")}</SelectItem>
              <SelectItem value="resolved">{tStatus("resolved")}</SelectItem>
              <SelectItem value="dismissed">{tStatus("dismissed")}</SelectItem>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageBanner>

      {/* Queue Section */}
      <section className="border border-border bg-card p-5 shadow-hard">
        {loadingReports && !reports ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
        ) : error && !reports ? (
          <PageState variant="error" title={error} compact />
        ) : reports && reports.items.length === 0 ? (
          <PageState
            variant="empty"
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            icon={LucideInbox}
            compact
          />
        ) : (
          <>
            <ul className="space-y-3">
              {reports?.items.map((report) => (
                <li
                  key={report.id}
                  className="border border-border p-4 shadow-hard-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {report.reason}
                    </span>
                    <StatusPill
                      status={report.status}
                      label={tStatus(report.status)}
                    />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatShortDate(report.createdAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("against")}{" "}
                    {report.reported ? (
                      <Link
                        href={`/admin/users/${report.reported.id}`}
                        className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                      >
                        {report.reported.name}
                      </Link>
                    ) : (
                      t("deletedUser")
                    )}{" "}
                    · {t("by")} {report.reporter?.name ?? t("deletedUser")}
                  </p>

                  {report.details ? (
                    <p className="mt-2 border-l-[4px] border-l-border pl-3 text-sm text-foreground">
                      {report.details}
                    </p>
                  ) : null}

                  {/* Actions Section */}
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                    {TRANSITIONS.filter((next) => next !== report.status).map(
                      (next) => (
                        <Button
                          key={next}
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={saving}
                          onClick={() => void handleTransition(report.id, next)}
                        >
                          {t(`markAs.${next}`)}
                        </Button>
                      ),
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {reports ? (
              <div className="mt-4">
                <AdminPagination
                  page={reports.page}
                  limit={reports.limit}
                  total={reports.total}
                  busy={loadingReports}
                  onPageChange={setPage}
                />
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
