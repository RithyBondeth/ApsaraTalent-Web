"use client";

import { useTranslations } from "next-intl";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
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
  const { loading, interviews, queryInterviews, updateStatus, error } =
    useInterviewStore();
  const {
    currentCompanyMatching,
    queryCurrentCompanyMatching,
    loading: companyMatchingLoading,
  } = useGetCurrentCompanyMatchingStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => setMounted(true), []);

  const { isEmployee, isCompany, currentUser } = useFetchOnce({
    cacheKey: "interview-page",
    onEmployeeFetch: (employeeId) => queryInterviews(employeeId, "employee"),
    onCompanyFetch: (companyId) => {
      queryInterviews(companyId, "company");
      queryCurrentCompanyMatching(companyId);
    },
  });

  const currentId = isEmployee
    ? currentUser?.employee?.id
    : currentUser?.company?.id;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Accept Interview ─────────────────────────────────────────
  const handleAccept = useCallback(
    (interviewId: string) => updateStatus(interviewId, "accepted"),
    [updateStatus],
  );

  // ── Handle Decline Interview ─────────────────────────────────────────
  const handleDecline = useCallback(
    (interviewId: string) => updateStatus(interviewId, "declined"),
    [updateStatus],
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
      {/* Banner Section */}
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {isEmployee
              ? t("bannerSubtitle1Employee")
              : t("bannerSubtitle1Company")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {isEmployee
              ? t("bannerSubtitle2Employee")
              : t("bannerSubtitle2Company")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {isEmployee ? t("bannerMutedEmployee") : t("bannerMutedCompany")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={interviewBannerSvg}
            alt="interview"
            height={250}
            width={350}
            className="h-auto max-w-[340px] shrink-0"
            priority
          />
        )}
      </div>

      {/* Tablet Banner Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <TypographyH3 className="!leading-snug">
            {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {isEmployee
              ? t("bannerSubtitle1Employee")
              : t("bannerSubtitle1Company")}
          </TypographyMuted>
          <TypographyMuted className="!leading-snug">
            {isEmployee
              ? t("bannerSubtitle2Employee")
              : t("bannerSubtitle2Company")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={interviewBannerSvg}
            alt="interview"
            width={160}
            height={160}
            className="shrink-0 h-auto object-contain"
            priority
          />
        )}
      </div>

      {/* Mobile Banner Section ≤650px */}
      <div className="hidden tablet-md:flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-3 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="font-bold text-sm leading-snug text-foreground">
            {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
          </h2>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {isEmployee
              ? t("bannerSubtitle1Employee")
              : t("bannerSubtitle1Company")}
          </p>
        </div>
        {mounted && (
          <Image
            src={interviewBannerSvg}
            alt="interview"
            width={88}
            height={88}
            className="flex-shrink-0 object-contain"
            priority
          />
        )}
      </div>

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
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      ) : (
        /* Interview Empty State Section */
        <div className="w-full flex flex-col items-center justify-center my-16">
          <Image
            src={emptySvg}
            alt="empty"
            height={200}
            width={200}
            className="animate-float"
          />
          <TypographyP className="!m-0 text-sm font-medium text-muted-foreground text-center">
            {isEmployee ? t("noInterviewsEmployee") : t("noInterviewsCompany")}
          </TypographyP>
        </div>
      )}
    </div>
  );
}
