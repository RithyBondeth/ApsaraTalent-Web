"use client";

import ApplicationLoadingSkeleton, {
  ApplicationListSkeleton,
} from "@/components/application/skeleton";
import { ApplicantActivityDrawer } from "@/components/application/applicant-activity-drawer";
import { ApplicantCard } from "@/components/application/applicant-card";
import { ApplicationCard } from "@/components/application/application-card";
import { BulkActionToolbar } from "@/components/application/bulk-action-toolbar";
import { PipelineBoard } from "@/components/application/pipeline-board";
import { RejectApplicantDialog } from "@/components/application/reject-applicant-dialog";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { PageState } from "@/components/utils/feedback/page-state";
import { cn } from "@/lib/utils";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetOneCompanyStore } from "@/stores/apis/company/get-one-cmp.store";
import { useJobApplicationsStore } from "@/stores/apis/job/job-applications.store";
import { useMyApplicationsStore } from "@/stores/apis/job/my-applications.store";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { IApplication } from "@/utils/interfaces/application/application.interface";
import {
  OPEN_APPLICATION_STATUSES,
  TApplicationStatus,
} from "@/utils/types/application/application-status.type";
import {
  LucideBriefcaseBusiness,
  LucideCircleCheckBig,
  LucideFileText,
  LucideInbox,
  LucideKanban,
  LucideList,
  LucideSparkles,
  LucideUsers,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  initialIsEmployee: boolean;
}

/** How the company's applicant list is ordered. */
type TSort = "fit" | "newest";

/** How the company's applicant list is shown. */
type TView = "list" | "board";

export default function ApplicationPageClient({ initialIsEmployee }: Props) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [sort, setSort] = useState<TSort>("fit");
  const [view, setView] = useState<TView>("list");
  const [rejecting, setRejecting] = useState<IApplication | null>(null);
  // Set of application ids selected in the board's checkboxes, for bulk moves.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activityFor, setActivityFor] = useState<IApplication | null>(null);

  /* ----------------------------- API Integration ---------------------------- */
  const {
    applications,
    loading: myLoading,
    error: myError,
    withdrawingId,
    queryMyApplications,
    withdrawApplication,
  } = useMyApplicationsStore();

  const {
    applicants,
    loading: applicantsLoading,
    error: applicantsError,
    updatingId,
    bulkUpdating,
    queryJobApplications,
    updateStatus,
    bulkUpdateStatus,
  } = useJobApplicationsStore();

  const { companyData, queryOneCompany } = useGetOneCompanyStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => setMounted(true), []);

  const { isEmployee, isCompany, currentUser } = useFetchOnce({
    cacheKey: "application-page",
    onEmployeeFetch: () => queryMyApplications(),
    /*
      The company's own profile carries its open positions, and that is the
      list the job selector is built from — there is no endpoint that returns
      "jobs for a company" on its own. Skip the fetch when the profile is
      already loaded from another page.
    */
    onCompanyFetch: (companyId) => {
      if (useGetOneCompanyStore.getState().companyData?.id !== companyId)
        queryOneCompany(companyId);
    },
  });

  const companyId = currentUser?.company?.id;

  const jobs = useMemo(
    () =>
      (companyData?.openPositions ?? []).filter(
        (position): position is typeof position & { id: string } =>
          typeof position.id === "string",
      ),
    [companyData?.openPositions],
  );

  // Select the first job as soon as there is one, so the company lands on a
  // populated list rather than on a picker with nothing chosen.
  useEffect(() => {
    if (!isCompany || selectedJobId || jobs.length === 0) return;
    setSelectedJobId(jobs[0].id);
  }, [isCompany, jobs, selectedJobId]);

  useEffect(() => {
    if (!isCompany || !selectedJobId || !companyId) return;
    queryJobApplications(selectedJobId, companyId);
  }, [isCompany, selectedJobId, companyId, queryJobApplications]);

  // Selection is per-job. Switching jobs clears anything the recruiter had
  // ticked, so a bulk action can never fan out across the wrong role.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [selectedJobId]);

  /* ---------------------------------- Memos --------------------------------- */
  const sortedApplicants = useMemo(() => {
    const rows = [...applicants];
    if (sort === "newest")
      return rows.sort(
        (a, b) => Date.parse(b.appliedAt) - Date.parse(a.appliedAt),
      );

    /*
      Unscored applicants sort last rather than as zero. A pair the matching
      feed never scored is an unknown, and letting it sink below a genuine weak
      match would be reading "no data" as "bad fit".
    */
    return rows.sort((a, b) => {
      const scoreA = typeof a.matchScore === "number" ? a.matchScore : -1;
      const scoreB = typeof b.matchScore === "number" ? b.matchScore : -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return Date.parse(b.appliedAt) - Date.parse(a.appliedAt);
    });
  }, [applicants, sort]);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId),
    [jobs, selectedJobId],
  );

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Withdraw ──────────────────────────────────────────────────
  const handleWithdraw = useCallback(
    async (applicationId: string) => {
      const ok = await withdrawApplication(applicationId);
      if (ok) toast.success(t("withdrawSuccess"));
      else
        toast.error(
          useMyApplicationsStore.getState().error ?? t("withdrawError"),
        );
    },
    [withdrawApplication, t],
  );

  // ── Handle Advance ───────────────────────────────────────────────────
  const handleAdvance = useCallback(
    async (applicationId: string, status: TApplicationStatus) => {
      const ok = await updateStatus({ applicationId, status });
      // One message parameterised by the stage, rather than a success key per
      // stage that would have to be kept in step with the transition map.
      if (ok)
        toast.success(t("advanceSuccess", { stage: t(`status.${status}`) }));
      else
        toast.error(
          useJobApplicationsStore.getState().error ?? t("updateError"),
        );
    },
    [updateStatus, t],
  );

  // ── Handle Reject ────────────────────────────────────────────────────
  const handleReject = useCallback(
    async (applicationId: string, reason: string) => {
      const ok = await updateStatus({
        applicationId,
        status: "rejected",
        rejectionReason: reason || undefined,
      });
      if (ok) {
        toast.success(t("rejectSuccess"));
        setRejecting(null);
        return;
      }
      toast.error(useJobApplicationsStore.getState().error ?? t("updateError"));
    },
    [updateStatus, t],
  );

  // ── Handle Selection ────────────────────────────────────────────────
  const handleToggleSelect = useCallback((applicationId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(applicationId)) next.delete(applicationId);
      else next.add(applicationId);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  // ── Handle Bulk Move ────────────────────────────────────────────────
  const handleBulkMove = useCallback(
    async (status: TApplicationStatus) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      const result = await bulkUpdateStatus({ applicationIds: ids, status });
      if (!result) {
        toast.error(
          useJobApplicationsStore.getState().error ?? t("updateError"),
        );
        return;
      }
      // Two cases the recruiter cares about: everything moved, or some rows
      // were refused by the state machine. A mixed result names both counts
      // so the failures do not vanish silently.
      if (result.failedCount === 0) {
        toast.success(
          t("bulk.moveSuccess", {
            count: result.updatedCount,
            stage: t(`status.${status}`),
          }),
        );
      } else {
        toast.warning(
          t("bulk.moveMixed", {
            ok: result.updatedCount,
            failed: result.failedCount,
          }),
        );
      }
      // Drop the rows that moved out of the selection; keep the ones that
      // were refused so the recruiter can see which they were.
      const okIds = new Set(
        result.results.filter((r) => r.ok).map((r) => r.applicationId),
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of okIds) next.delete(id);
        return next;
      });
    },
    [selectedIds, bulkUpdateStatus, t],
  );

  // ── Handle Bulk Reject ──────────────────────────────────────────────
  const handleBulkReject = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const result = await bulkUpdateStatus({
      applicationIds: ids,
      status: "rejected",
    });
    if (!result) {
      toast.error(useJobApplicationsStore.getState().error ?? t("updateError"));
      return;
    }
    if (result.failedCount === 0) {
      toast.success(t("rejectSuccess"));
    } else {
      toast.warning(
        t("bulk.moveMixed", {
          ok: result.updatedCount,
          failed: result.failedCount,
        }),
      );
    }
    const okIds = new Set(
      result.results.filter((r) => r.ok).map((r) => r.applicationId),
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of okIds) next.delete(id);
      return next;
    });
  }, [selectedIds, bulkUpdateStatus, t]);

  /* ------------------------------ Loading State ----------------------------- */
  const isLoading =
    !mounted ||
    !currentUser ||
    (isEmployee && myLoading) ||
    (isCompany && companyData === null);

  if (isLoading)
    return (
      <ApplicationLoadingSkeleton
        role={initialIsEmployee ? USER_ROLE.EMPLOYEE : USER_ROLE.COMPANY}
      />
    );

  const error = isEmployee ? myError : applicantsError;
  const rows = isEmployee ? applications : sortedApplicants;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("applicationDesk")}
        title={isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
        subtitle={
          isEmployee ? t("bannerSubtitleEmployee") : t("bannerSubtitleCompany")
        }
        stats={
          isEmployee
            ? [
                {
                  icon: LucideFileText,
                  label: t("statTotal"),
                  value: applications.length,
                },
                {
                  icon: LucideSparkles,
                  label: t("statActive"),
                  value: applications.filter((a) =>
                    OPEN_APPLICATION_STATUSES.includes(a.status),
                  ).length,
                },
                {
                  icon: LucideCircleCheckBig,
                  label: t("statHired"),
                  value: applications.filter((a) => a.status === "hired")
                    .length,
                },
              ]
            : applicantsLoading
              ? undefined
              : [
                  {
                    icon: LucideUsers,
                    label: t("statApplicants"),
                    value: applicants.length,
                  },
                  {
                    icon: LucideInbox,
                    label: t("statNew"),
                    value: applicants.filter((a) => !a.reviewedAt).length,
                  },
                  {
                    icon: LucideCircleCheckBig,
                    label: t("statShortlisted"),
                    value: applicants.filter((a) =>
                      ["shortlisted", "interviewing", "offered"].includes(
                        a.status,
                      ),
                    ).length,
                  },
                ]
        }
      />

      {/* Error Banner Section */}
      {error && rows.length > 0 && (
        <div className="w-full border border-l-[5px] border-destructive/20 border-l-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="flex w-full flex-col gap-5">
        {/* Job Selector Section */}
        {isCompany && jobs.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={t("selectJob")}
          >
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                role="tab"
                aria-selected={job.id === selectedJobId}
                onClick={() => setSelectedJobId(job.id)}
                className={cn(
                  "border px-3 py-2 text-sm font-semibold transition-colors",
                  job.id === selectedJobId
                    ? "border-primary bg-primary text-primary-foreground shadow-hard-primary-xs"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/35 hover:text-foreground",
                )}
              >
                {job.title}
              </button>
            ))}
          </div>
        )}

        {/* Section Heading */}
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">
                {isEmployee
                  ? t("yourApplications")
                  : (selectedJob?.title ?? t("applicants"))}
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t("applicationCount", { count: rows.length })}
              </p>
            </div>
          </div>

          {/* View + Sort Controls */}
          {isCompany && rows.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-1"
                role="tablist"
                aria-label={t("view.list")}
              >
                {(["list", "board"] as const).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    size="sm"
                    variant={view === option ? "default" : "outline"}
                    className="rounded-none"
                    onClick={() => setView(option)}
                    aria-pressed={view === option}
                  >
                    {option === "list" ? (
                      <LucideList className="size-3.5" />
                    ) : (
                      <LucideKanban className="size-3.5" />
                    )}
                    {t(`view.${option}`)}
                  </Button>
                ))}
              </div>
              {/*
                The sort order applies to the flat list only. Ordering makes no
                sense inside a stage bucket where the whole point is grouping,
                so the toggle disappears on the board.
              */}
              {view === "list" && rows.length > 1 && (
                <div className="flex items-center gap-1">
                  {(["fit", "newest"] as const).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={sort === option ? "default" : "outline"}
                      className="rounded-none"
                      onClick={() => setSort(option)}
                    >
                      {t(`sortBy.${option}`)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
              <LucideFileText className="size-4" />
            </div>
          )}
        </div>

        {/* Bulk Toolbar Section — visible only on the board and only when at
            least one row is ticked. Sits above the columns rather than
            floating over them so the recruiter never loses the row they just
            selected under a scrim. */}
        {isCompany && view === "board" && (
          <BulkActionToolbar
            selectedCount={selectedIds.size}
            isBusy={bulkUpdating}
            onClear={clearSelection}
            onMove={handleBulkMove}
            onRejectSelection={handleBulkReject}
          />
        )}

        {/* List Section */}
        {isCompany && applicantsLoading ? (
          /* Switching jobs redraws only the rows — the banner and the job
             selector above are already on screen and stay where they are. */
          <ApplicationListSkeleton withScore />
        ) : error && rows.length === 0 ? (
          <PageState
            variant="error"
            title={error}
            compact
            className="my-6 sm:my-8"
            action={
              isEmployee
                ? { label: t("retry"), onClick: () => queryMyApplications() }
                : selectedJobId && companyId
                  ? {
                      label: t("retry"),
                      onClick: () =>
                        queryJobApplications(selectedJobId, companyId),
                    }
                  : undefined
            }
          />
        ) : rows.length > 0 ? (
          isCompany && view === "board" ? (
            <PipelineBoard
              applications={sortedApplicants}
              selectedIds={selectedIds}
              updatingId={updatingId}
              onToggleSelect={handleToggleSelect}
              onAdvance={handleAdvance}
              onReject={setRejecting}
              onOpenActivity={setActivityFor}
            />
          ) : (
            <div className="stagger-list flex w-full flex-col gap-3">
              {isEmployee
                ? applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      isWithdrawing={withdrawingId === application.id}
                      onWithdraw={handleWithdraw}
                    />
                  ))
                : sortedApplicants.map((application) => (
                    <ApplicantCard
                      key={application.id}
                      application={application}
                      isUpdating={updatingId === application.id}
                      onAdvance={handleAdvance}
                      onReject={setRejecting}
                    />
                  ))}
            </div>
          )
        ) : (
          /* Empty State Section */
          <PageState
            variant="empty"
            title={
              isEmployee
                ? t("noApplicationsEmployee")
                : jobs.length === 0
                  ? t("noJobsCompany")
                  : t("noApplicantsCompany")
            }
            description={
              isEmployee
                ? t("noApplicationsEmployeeDescription")
                : jobs.length === 0
                  ? t("noJobsCompanyDescription")
                  : t("noApplicantsCompanyDescription")
            }
            icon={
              jobs.length === 0 && isCompany
                ? LucideBriefcaseBusiness
                : LucideInbox
            }
            compact
            className="my-6 sm:my-8"
          />
        )}
      </section>

      {/* Reject Dialog Section */}
      {isCompany && (
        <RejectApplicantDialog
          application={rejecting}
          isSubmitting={updatingId === rejecting?.id}
          onCancel={() => setRejecting(null)}
          onConfirm={handleReject}
        />
      )}

      {/* Notes + history drawer, opened from a card on the board. */}
      {isCompany && (
        <ApplicantActivityDrawer
          application={activityFor}
          onClose={() => setActivityFor(null)}
        />
      )}
    </div>
  );
}
