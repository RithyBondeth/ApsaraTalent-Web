"use client";

import { useTranslations } from "next-intl";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCallback, useEffect, useState } from "react";
import InterviewLoadingSkeleton from "./loading";
import { InterviewCard } from "@/components/interview/interview-card";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import {
  emptySvgImage,
  interviewImageSvg,
} from "@/utils/constants/asset.constant";
import Image from "next/image";
import { TypographyP } from "@/components/utils/typography/typography-p";

export default function InterviewPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  /* ----------------------------- API Integration ---------------------------- */
  const { loading, interviews, queryInterviews, updateStatus, error } =
    useInterviewStore();
  const {
    currentCompanyMatching,
    queryCurrentCompanyMatching,
    loading: companyMatchingLoading,
  } = useGetCurrentCompanyMatchingStore();

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

  if (isLoading) return <InterviewLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5 animate-page-in">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Create Interview Dialog Section */}
        {isCompany && currentId && (
          <CreateInterviewDialog
            currentId={currentId}
            currentCompanyMatching={currentCompanyMatching}
          />
        )}
      </div>

      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8">
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            {isEmployee
              ? t("bannerSubtitle1Employee")
              : t("bannerSubtitle1Company")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            {isEmployee
              ? t("bannerSubtitle2Employee")
              : t("bannerSubtitle2Company")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            {isEmployee ? t("bannerMutedEmployee") : t("bannerMutedCompany")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={interviewImageSvg}
            alt="interview"
            height={250}
            width={350}
            className="h-auto max-w-[340px] tablet-xl:!w-full"
            priority
          />
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          {error}
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
            src={emptySvgImage}
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
