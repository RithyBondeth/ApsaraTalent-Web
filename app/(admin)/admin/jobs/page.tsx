"use client";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { JobHideDialog } from "@/components/admin/job-hide-dialog";
import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { TAdminJob, TJobVisibility } from "@/utils/types/admin/admin.type";
import { LucideBriefcase, LucideFlag, LucideSearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 25;
/** Long enough that a two-character typo does not scan every posting. */
const SEARCH_DEBOUNCE_MS = 350;

export default function AdminJobsPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.jobs");

  /* ----------------------------- API Integration ---------------------------- */
  const { jobs, loadingJobs, saving, error, getJobs, hideJob, restoreJob } =
    useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  const [search, setSearch] = useState("");
  // Opens on live postings — the ones that can still reach a candidate.
  const [visibility, setVisibility] = useState<TJobVisibility>("visible");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<TAdminJob | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    setPage(1);
  }, [search, visibility]);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        void getJobs({
          page,
          limit: PAGE_SIZE,
          visibility,
          ...(search.trim() ? { search: search.trim() } : {}),
        }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [page, search, visibility, getJobs]);

  /* --------------------------------- Handlers ------------------------------- */
  const handleHide = async (reason: string) => {
    if (!target) return;
    if (await hideJob(target.id, reason)) {
      setTarget(null);
      toast.success(t("hidden", { title: target.title }));
    }
  };

  const handleRestore = async (job: TAdminJob) => {
    if (await restoreJob(job.id)) {
      toast.success(t("restored", { title: job.title }));
    }
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
          jobs
            ? [
                {
                  label: t("statInView"),
                  value: jobs.total.toLocaleString(),
                  icon: LucideBriefcase,
                },
              ]
            : undefined
        }
      >
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            type="search"
            value={search}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={visibility}
            onValueChange={(value) => setVisibility(value as TJobVisibility)}
          >
            <SelectTrigger
              className="sm:w-48"
              aria-label={t("filterVisibility")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">{t("filterLive")}</SelectItem>
              <SelectItem value="hidden">{t("filterHidden")}</SelectItem>
              <SelectItem value="all">{t("filterAll")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageBanner>

      {/* Results Section */}
      <section className="border border-border bg-card p-5 shadow-hard">
        {loadingJobs && !jobs ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : error && !jobs ? (
          <PageState variant="error" title={error} compact />
        ) : jobs && jobs.items.length === 0 ? (
          <PageState
            variant="empty"
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            icon={LucideSearchX}
            compact
          />
        ) : (
          <>
            <ul className="space-y-3">
              {jobs?.items.map((job) => (
                <li
                  key={job.id}
                  className="flex flex-wrap items-start justify-between gap-3 border border-border p-4 shadow-hard-xs"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {job.title}
                      </span>
                      <StatusPill
                        status={job.hiddenAt ? "banned" : "active"}
                        label={job.hiddenAt ? t("hiddenLabel") : t("liveLabel")}
                      />
                      {job.companyOpenReportCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums text-destructive">
                          <LucideFlag aria-hidden className="size-3" />
                          {t("companyReports", {
                            count: job.companyOpenReportCount,
                          })}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.companyId ? (
                        <Link
                          href={`/admin/users?search=${encodeURIComponent(job.companyName)}`}
                          className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          {job.companyName}
                        </Link>
                      ) : (
                        job.companyName
                      )}
                      {job.location ? ` · ${job.location}` : ""} · {job.type} ·{" "}
                      {t("posted", { date: formatShortDate(job.createdAt) })}
                    </p>

                    {job.hiddenReason ? (
                      <p className="mt-2 border-l-[4px] border-l-warning-border bg-warning-subtle px-3 py-2 text-xs text-warning-accent">
                        {job.hiddenReason}
                      </p>
                    ) : null}
                  </div>

                  {job.hiddenAt ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={saving}
                      onClick={() => void handleRestore(job)}
                    >
                      {t("restore")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={saving}
                      onClick={() => setTarget(job)}
                    >
                      {t("hide")}
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            {jobs ? (
              <div className="mt-4">
                <AdminPagination
                  page={jobs.page}
                  limit={jobs.limit}
                  total={jobs.total}
                  busy={loadingJobs}
                  onPageChange={setPage}
                />
              </div>
            ) : null}
          </>
        )}
      </section>

      {/* Dialog Section */}
      <JobHideDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        jobTitle={target?.title ?? ""}
        companyName={target?.companyName ?? ""}
        saving={saving}
        onSubmit={(reason) => void handleHide(reason)}
      />
    </div>
  );
}
