"use client";

import { useTranslations } from "next-intl";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCallback } from "react";
import InterviewLoadingSkeleton from "./loading";
import { InterviewCard } from "@/components/interview/interview-card";
import { CreateInterviewDialog } from "@/components/interview/create-interview-dialog";
import { emptySvgImage } from "@/utils/constants/asset.constant";
import Image from "next/image";
import { TypographyP } from "@/components/utils/typography/typography-p";

export default function InterviewPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");

  /* ----------------------------- API Integration ---------------------------- */
  const { interviews, queryInterviews, updateStatus } = useInterviewStore();
  const { currentCompanyMatching, queryCurrentCompanyMatching } =
    useGetCurrentCompanyMatchingStore();

  /* --------------------------------- Effects --------------------------------- */
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
  if (interviews === null) return <InterviewLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5 animate-page-in">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TypographyH2>{t("title")}</TypographyH2>

        {/* Create Interview Dialog Section */}
        {isCompany && currentId && (
          <CreateInterviewDialog
            currentId={currentId}
            currentCompanyMatching={currentCompanyMatching}
          />
        )}
      </div>

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
