"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FeaturePageHeader } from "@/components/utils/layout/feature-page-header";
import { EditorialIllustration } from "@/components/utils/data-display/editorial-illustration";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InterviewLoadingSkeleton from "@/components/interview/skeleton";
import { InterviewCard } from "@/components/interview/interview-card";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";

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
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5 animate-page-in">
      {/* Compact Introduction Section */}
      <FeaturePageHeader
        title={isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
        description={
          isEmployee
            ? t("bannerSubtitle1Employee")
            : t("bannerSubtitle1Company")
        }
      />

      {/* Error Banner Section */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Create Interview Action Section (Company Only) */}
      {isCompany && currentId && (
        <div className="flex items-center justify-end">
          <CreateInterviewDialog
            currentId={currentId}
            currentCompanyMatching={currentCompanyMatching}
            initialEmployeeId={initialEmployeeId}
          />
        </div>
      )}

      {/* Interview List Section */}
      {interviews.length > 0 ? (
        <div className="flex flex-col gap-3 stagger-list">
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
        <div className="w-full flex flex-col items-center justify-center gap-4 my-16">
          <EditorialIllustration variant="interview" />
          <TypographyP className="!m-0 text-sm font-medium text-muted-foreground text-center">
            {isEmployee ? t("noInterviewsEmployee") : t("noInterviewsCompany")}
          </TypographyP>
        </div>
      )}
    </div>
  );
}
