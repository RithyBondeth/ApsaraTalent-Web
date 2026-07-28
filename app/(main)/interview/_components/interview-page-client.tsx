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
import { emptySvg, interviewBannerSvg } from "@/utils/constants/asset.constant";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import Image from "next/image";
import { CalendarCheck2 } from "lucide-react";
import { PageState } from "@/components/utils/feedback/page-state";

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
    <div className="interview-editorial mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 animate-page-in sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <section className="feed-hero grid min-h-[280px] w-full grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)] overflow-hidden border border-border bg-card tablet-md:grid-cols-1">
        <div className="flex min-w-0 flex-col justify-between gap-8 px-7 py-8 sm:px-9 sm:py-10 tablet-md:gap-5 tablet-md:px-5 tablet-md:py-6">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-7 bg-primary" />
            {t("interviewDesk")}
          </div>
          <div className="max-w-3xl">
            <h1 className="max-w-[18ch] text-balance text-3xl font-black leading-[1.05] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
            </h1>
            <p className="mt-4 max-w-[60ch] text-sm leading-6 text-muted-foreground sm:text-base">
              {isEmployee
                ? t("bannerSubtitle1Employee")
                : t("bannerSubtitle1Company")}{" "}
              {isEmployee
                ? t("bannerSubtitle2Employee")
                : t("bannerSubtitle2Company")}
            </p>
          </div>
          <p className="max-w-[70ch] border-l-2 border-foreground pl-3 text-xs leading-5 text-muted-foreground">
            {isEmployee ? t("bannerMutedEmployee") : t("bannerMutedCompany")}
          </p>
        </div>

        <div className="feed-hero-visual">
          <div aria-hidden className="feed-hero-visual-grid" />
          <div className="feed-hero-network-chip">
            <span className="feed-hero-network-icon" aria-hidden>
              <CalendarCheck2 />
            </span>
            <span>{t("interviewDesk")}</span>
            <span aria-hidden className="feed-hero-network-status" />
          </div>
          <div aria-hidden className="feed-hero-art-stage">
            <span className="feed-hero-node feed-hero-node-one" />
            <span className="feed-hero-node feed-hero-node-two" />
            <span className="feed-hero-node feed-hero-node-three" />
            <div className="feed-hero-art-frame">
              <div className="feed-hero-art-grid" />
              <div className="feed-hero-art-glow" />
              <Image
                src={interviewBannerSvg}
                alt=""
                height={260}
                width={360}
                className="feed-hero-artwork"
                priority
              />
              <span className="feed-hero-corner feed-hero-corner-nw" />
              <span className="feed-hero-corner feed-hero-corner-ne" />
              <span className="feed-hero-corner feed-hero-corner-sw" />
              <span className="feed-hero-corner feed-hero-corner-se" />
            </div>
          </div>
          <div aria-hidden className="feed-hero-signal-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {/* Error Banner Section */}
      {error && interviews.length > 0 && (
        <div className="w-full border border-destructive/20 border-l-[5px] border-l-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Interview Schedule Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">
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
          <div className="flex w-full flex-col gap-3 stagger-list">
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
              isEmployee
                ? t("noInterviewsEmployee")
                : t("noInterviewsCompany")
            }
            image={emptySvg}
            compact
            className="my-6 sm:my-8"
          />
        )}
      </section>
    </div>
  );
}
