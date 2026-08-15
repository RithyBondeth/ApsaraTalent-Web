"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { InterviewCard } from "@/components/interview/interview-card";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { CalendarCheck2, CalendarClock, CircleCheckBig } from "lucide-react";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";

interface Props {
  initialIsEmployee: boolean;
}

export default function InterviewPageClient({ initialIsEmployee }: Props) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const initialEmployeeId = searchParams.get("with") ?? undefined;

  /* ----------------------------- API Integration ---------------------------- */
  const {
    loading,
    interviews,
    queryInterviews,
    updateStatus,
    updatingId,
    error,
  } = useInterviewStore();
  const {
    currentCompanyMatching,
    queryCurrentCompanyMatching,
    loading: companyMatchingLoading,
  } = useGetCurrentCompanyMatchingStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => setMounted(true), []);

  const { isEmployee, isCompany, currentUser } = useFetchOnce({
    cacheKey: "interview-page",
    onEmployeeFetch: (employeeId) =>
      queryInterviews(employeeId, USER_ROLE.EMPLOYEE),
    onCompanyFetch: (companyId) => {
      queryInterviews(companyId, USER_ROLE.COMPANY);
      /* 
        CreateInterviewDialog needs the matching list to show candidate options.
        Skip the fetch if the list is already loaded (e.g. user previously visited
        /matching), so we don't duplicate the request on every interview page visit.
      */
      if (
        !useGetCurrentCompanyMatchingStore.getState().currentCompanyMatching
      ) {
        queryCurrentCompanyMatching(companyId);
      }
    },
  });

  const currentId = isEmployee
    ? currentUser?.employee?.id
    : currentUser?.company?.id;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Accept Interview ─────────────────────────────────────────
  const handleAccept = useCallback(
    async (interviewId: string) => {
      const ok = await updateStatus(interviewId, "accepted");
      if (ok) toast.success(t("acceptSuccess"));
      else toast.error(t("updateError"));
    },
    [updateStatus, t],
  );

  // ── Handle Decline Interview ─────────────────────────────────────────
  const handleDecline = useCallback(
    async (interviewId: string) => {
      const ok = await updateStatus(interviewId, "declined");
      if (ok) toast.success(t("declineSuccess"));
      else toast.error(t("updateError"));
    },
    [updateStatus, t],
  );

  /* ------------------------------ Loading State ----------------------------- */
  const isLoadingForCompany =
    isCompany && (companyMatchingLoading || currentCompanyMatching === null);

  const isLoading = !mounted || !currentUser || loading || isLoadingForCompany;

  if (isLoading)
    return (
      <InterviewLoadingSkeleton
        role={initialIsEmployee ? USER_ROLE.EMPLOYEE : USER_ROLE.COMPANY}
      />
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="interview-editorial animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("interviewDesk")}
        title={isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
        subtitle={`${
          isEmployee
            ? t("bannerSubtitle1Employee")
            : t("bannerSubtitle1Company")
        } ${
          isEmployee
            ? t("bannerSubtitle2Employee")
            : t("bannerSubtitle2Company")
        }`}
        stats={
          loading && interviews.length === 0
            ? undefined
            : [
                {
                  icon: CalendarCheck2,
                  label: t("statScheduled"),
                  value: interviews.length,
                },
                {
                  icon: CalendarClock,
                  label: t("statPending"),
                  value: interviews.filter((i) => i.status === "pending")
                    .length,
                },
                {
                  icon: CircleCheckBig,
                  label: t("statAccepted"),
                  value: interviews.filter((i) => i.status === "accepted")
                    .length,
                },
              ]
        }
      />

      {/* Error Banner Section */}
      {error && interviews.length > 0 && (
        <div className="w-full border border-l-[5px] border-destructive/20 border-l-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Interview Schedule Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="pixel-display text-xl text-foreground sm:text-2xl">
                {t("scheduledInterviews")}
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t("scheduledCount", { count: interviews.length })}
              </p>
            </div>
          </div>
          {isCompany && currentId ? (
            <CreateInterviewDialog
              currentId={currentId}
              currentCompanyMatching={currentCompanyMatching}
              initialEmployeeId={initialEmployeeId}
            />
          ) : (
            <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
              <CalendarCheck2 className="size-4" />
            </div>
          )}
        </div>

        {/* Interview List Section */}
        {error && interviews.length === 0 ? (
          <PageState
            variant="error"
            title={error}
            compact
            className="my-6 sm:my-8"
            action={
              currentId && currentUser?.role
                ? {
                    label: t("retry"),
                    onClick: () => queryInterviews(currentId, currentUser.role),
                  }
                : undefined
            }
          />
        ) : interviews.length > 0 ? (
          <div className="stagger-list flex w-full flex-col gap-3">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                isEmployee={isEmployee}
                isUpdating={updatingId === interview.id}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        ) : (
          /* Interview Empty State Section */
          <PageState
            variant="empty"
            title={
              isEmployee ? t("noInterviewsEmployee") : t("noInterviewsCompany")
            }
            compact
            className="my-6 sm:my-8"
          />
        )}
      </section>
    </div>
  );
}
