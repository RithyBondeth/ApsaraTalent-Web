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
import type {
  TProblemCategory,
  TReportStatus,
} from "@/utils/types/admin/admin.type";
import { LucideInbox, LucideLifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;

/** Same transitions as the moderation queue; the same four labels apply. */
const TRANSITIONS: TReportStatus[] = ["reviewed", "resolved", "dismissed"];

const CATEGORIES: TProblemCategory[] = [
  "bug",
  "account",
  "payment",
  "content",
  "other",
];

export default function AdminProblemReportsPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.problemReports");
  const tStatus = useTranslations("admin.status");
  const tCategory = useTranslations("admin.problemReports.categories");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    problemReports,
    loadingProblemReports,
    saving,
    error,
    getProblemReports,
    updateProblemReportStatus,
  } = useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  // Opens on the queue that needs working, not on everything ever filed.
  const [status, setStatus] = useState<TReportStatus | "all">("pending");
  const [category, setCategory] = useState<TProblemCategory | "all">("all");
  const [page, setPage] = useState(1);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    setPage(1);
  }, [status, category]);

  useEffect(() => {
    void getProblemReports({
      page,
      limit: PAGE_SIZE,
      ...(status !== "all" ? { status } : {}),
      ...(category !== "all" ? { category } : {}),
    });
  }, [page, status, category, getProblemReports]);

  /* --------------------------------- Handlers ------------------------------- */
  const handleTransition = async (
    reportId: string,
    next: TReportStatus,
  ): Promise<void> => {
    const ok = await updateProblemReportStatus(reportId, { status: next });
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
          problemReports
            ? [
                {
                  label: t("statInQueue"),
                  value: problemReports.total.toLocaleString(),
                  icon: LucideLifeBuoy,
                },
              ]
            : undefined
        }
      >
        <div className="mt-5 flex flex-col gap-3 sm:max-w-md sm:flex-row">
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
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value as TProblemCategory | "all")
            }
          >
            <SelectTrigger aria-label={t("filterCategory")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {tCategory(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageBanner>

      {/* Queue Section */}
      <section className="border border-border bg-card p-5 shadow-hard">
        {loadingProblemReports && !problemReports ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        ) : error && !problemReports ? (
          <PageState variant="error" title={error} compact />
        ) : problemReports && problemReports.items.length === 0 ? (
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
              {problemReports?.items.map((report) => (
                <li
                  key={report.id}
                  className="border border-border p-4 shadow-hard-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {tCategory(report.category)}
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
                    {t("filedBy")}{" "}
                    <span className="font-semibold text-foreground">
                      {report.reporter?.email ?? t("deletedReporter")}
                    </span>
                  </p>

                  <p className="mt-2 whitespace-pre-line border-l-[4px] border-l-border pl-3 text-sm text-foreground">
                    {report.details}
                  </p>

                  {(report.pageUrl || report.userAgent) && (
                    <dl className="mt-3 grid grid-cols-1 gap-2 border-t border-border pt-3 text-xs text-muted-foreground sm:grid-cols-2">
                      {report.pageUrl && (
                        <div>
                          <dt className="font-semibold uppercase tracking-[0.06em]">
                            {t("pageUrl")}
                          </dt>
                          {/* Rendered as plain text on purpose — the URL was
                              typed by an unauthenticated form and could point
                              anywhere. An admin who wants to visit copies it. */}
                          <dd className="mt-1 break-all font-mono">
                            {report.pageUrl}
                          </dd>
                        </div>
                      )}
                      {report.userAgent && (
                        <div>
                          <dt className="font-semibold uppercase tracking-[0.06em]">
                            {t("userAgent")}
                          </dt>
                          <dd className="mt-1 break-all font-mono">
                            {report.userAgent}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}

                  {report.resolutionNote && (
                    <p className="mt-3 border-l-[4px] border-l-primary bg-primary/5 py-2 pl-3 text-sm text-foreground">
                      <span className="mr-1 font-semibold">
                        {t("lastNote")}:
                      </span>
                      {report.resolutionNote}
                    </p>
                  )}

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

            {problemReports ? (
              <div className="mt-4">
                <AdminPagination
                  page={problemReports.page}
                  limit={problemReports.limit}
                  total={problemReports.total}
                  busy={loadingProblemReports}
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
