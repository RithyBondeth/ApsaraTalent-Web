"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInitiateChatStore } from "@/stores/apis/chat/initiate-chat.store";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { emptySvg, matchingBannerSvg } from "@/utils/constants/asset.constant";
import { CountUp } from "@/components/utils/animation/count-up";

interface Props {
  initialIsEmployee: boolean;
}

export default function MatchingPageClient({ initialIsEmployee }: Props) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("matching");

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  // Track which card is in a loading state to prevent double-clicks
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  /* ----------------------------- API Integration ---------------------------- */
  const getCurrentEmpStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCmpStore = useGetCurrentCompanyMatchingStore();
  const { initiateChat } = useInitiateChatStore();
  const markEmpMatchingAsSeen = useCountCurrentEmployeeMatchingStore(
    (s) => s.markAsSeen,
  );
  const markCmpMatchingAsSeen = useCountCurrentCompanyMatchingStore(
    (s) => s.markAsSeen,
  );

  /* --------------------------------- Effects ---------------------------------*/
  useEffect(() => setMounted(true), []);

  const { isEmployee, currentUser } = useFetchOnce({
    cacheKey: "matching-page",
    onEmployeeFetch: getCurrentEmpStore.queryCurrentEmployeeMatching,
    onCompanyFetch: getCurrentCmpStore.queryCurrentCompanyMatching,
  });

  useEffect(() => {
    const id = currentUser?.employee?.id ?? currentUser?.company?.id;
    if (!id) return;
    if (isEmployee) markEmpMatchingAsSeen(id);
    else markCmpMatchingAsSeen(id);
  }, [currentUser, isEmployee, markEmpMatchingAsSeen, markCmpMatchingAsSeen]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Sender ID ────────────────────────────────────────────
  const senderId = useMemo(
    () => currentUser?.employee?.id ?? currentUser?.company?.id ?? "",
    [currentUser],
  );

  // ── Chat Handler ─────────────────────────────────────────
  const handleChatNow = useCallback(
    async (senderId: string, receiverId: string) => {
      if (!currentUser || chatLoadingId) return;
      if (senderId === receiverId) return;

      setChatLoadingId(receiverId);
      try {
        const initateChatData = await initiateChat(senderId, receiverId);
        router.push(`/message?chatId=${initateChatData.id}`);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
      } finally {
        setChatLoadingId(null);
      }
    },
    [currentUser, chatLoadingId, router],
  );

  /* ------------------------------- Loading State ----------------------------- */
  const isLoadingForEmployee =
    isEmployee &&
    (getCurrentEmpStore.loading ||
      getCurrentEmpStore.currentEmployeeMatching === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getCurrentCmpStore.loading ||
      getCurrentCmpStore.currentCompanyMatching === null);

  const isLoading =
    !mounted || !currentUser || isLoadingForEmployee || isLoadingForCompany;

  if (isLoading)
    return <MatchingLoadingSkeleton isEmployee={initialIsEmployee} />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-5 px-2.5 sm:px-5 animate-page-in">
      {/* Banner Section */}
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {t("bannerTitle")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle1")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle2")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {t("bannerMuted")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={matchingBannerSvg}
            alt="matching"
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
            {t("bannerTitle")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle1")}
          </TypographyMuted>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle2")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={matchingBannerSvg}
            alt="matching"
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
            {t("bannerTitle")}
          </h2>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {t("bannerSubtitle1")}
          </p>
        </div>
        {mounted && (
          <Image
            src={matchingBannerSvg}
            alt="matching"
            width={88}
            height={88}
            className="flex-shrink-0 object-contain"
            priority
          />
        )}
      </div>

      {/* Match Count Header Section */}
      {(() => {
        const count = isEmployee
          ? (getCurrentEmpStore.currentEmployeeMatching?.length ?? 0)
          : (getCurrentCmpStore.currentCompanyMatching?.length ?? 0);
        if (count === 0) return null;
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">
              <CountUp to={count} duration={900} />
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {t("matchesCount", { count })}
            </span>
          </div>
        );
      })()}

      {/* Matching Card List Section */}
      <div className="w-full flex flex-col items-start gap-3 stagger-list">
        {getCurrentEmpStore.currentEmployeeMatching &&
        getCurrentEmpStore.currentEmployeeMatching.length > 0 ? (
          getCurrentEmpStore.currentEmployeeMatching.map((cmp) => (
            /* Matching Company Card */
            <MatchingCompanyCard
              key={cmp.id}
              id={cmp.id}
              name={cmp.name}
              avatar={cmp.avatar ?? ""}
              industry={cmp.industry}
              description={cmp.description}
              companySize={cmp.companySize}
              foundedYear={cmp.foundedYear}
              openPosition={cmp.openPositions}
              location={cmp.location}
              onChatNowClick={() => handleChatNow(senderId, cmp.id)}
              onScheduleClick={() => router.push(`/interview?with=${cmp.id}`)}
              isChatLoading={chatLoadingId === cmp.id}
              employeeId={currentUser?.employee?.id ?? ""}
              employeeName={
                [
                  currentUser?.employee?.firstname,
                  currentUser?.employee?.lastname,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                currentUser?.employee?.username ||
                ""
              }
              employeeJob={currentUser?.employee?.job}
              employeeSkills={(currentUser?.employee?.skills ?? []).map(
                (s) => s.name,
              )}
              employeeExperience={currentUser?.employee?.yearsOfExperience}
              employeeDescription={currentUser?.employee?.description}
              skillScore={cmp.skillScore}
            />
          ))
        ) : getCurrentCmpStore.currentCompanyMatching &&
          getCurrentCmpStore.currentCompanyMatching.length > 0 ? (
          getCurrentCmpStore.currentCompanyMatching.map((emp) => (
            /* Matching Employee Card */
            <MatchingEmployeeCard
              key={emp.id}
              id={emp.id}
              name={`${emp.firstname} ${emp.lastname}`}
              username={emp.username ?? ""}
              avatar={emp.avatar ?? ""}
              description={emp.description}
              position={emp.job}
              experience={emp.yearsOfExperience}
              availability={emp.availability}
              location={emp.location ?? ""}
              skills={emp.skills.map((skill) => skill.name)}
              onChatNowClick={() => handleChatNow(senderId, emp.id)}
              onScheduleClick={() => router.push(`/interview?with=${emp.id}`)}
              isChatLoading={chatLoadingId === emp.id}
              companyId={currentUser?.company?.id ?? ""}
              skillScore={emp.skillScore}
            />
          ))
        ) : (
          /* Empty Matching List Section */
          <div className="w-full flex flex-col items-center justify-center gap-4 my-16">
            <Image
              src={emptySvg}
              alt="empty"
              height={200}
              width={200}
              className="animate-float"
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              {t("emptyList")}
            </TypographyP>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background shadow-sm transition-all hover:opacity-85 active:scale-95"
            >
              {t("goToFeed")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
