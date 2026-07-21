"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import { FeaturePageHeader } from "@/components/utils/layout/feature-page-header";
import { EditorialIllustration } from "@/components/utils/data-display/editorial-illustration";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useUnmatchStore } from "@/stores/apis/matching/unmatch.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useRouter } from "next/navigation";
import { useInitiateChatStore } from "@/stores/apis/chat/initiate-chat.store";
import { useChatStore } from "@/stores/features/chat/chat.store";
import { markUnmatchInitiated } from "@/stores/features/chat/socket-listeners";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { CountUp } from "@/components/utils/animations/count-up";

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
  const [unmatchingId, setUnmatchingId] = useState<string | null>(null);

  /* ----------------------------- API Integration ---------------------------- */
  const getCurrentEmpStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCmpStore = useGetCurrentCompanyMatchingStore();
  const { initiateChat } = useInitiateChatStore();
  const { unmatch } = useUnmatchStore();
  const removeChatByPartnerId = useChatStore((s) => s.removeChatByPartnerId);
  const getRecentChats = useChatStore((s) => s.getRecentChats);
  const removeInterviewsByPartnerId = useInterviewStore(
    (s) => s.removeInterviewsByPartnerId,
  );
  const silentRefetchInterviews = useInterviewStore((s) => s.silentRefetch);
  const markEmpMatchingAsSeen = useCountCurrentEmployeeMatchingStore(
    (s) => s.markAsSeen,
  );
  const markCmpMatchingAsSeen = useCountCurrentCompanyMatchingStore(
    (s) => s.markAsSeen,
  );
  /* 
    Subscribe to the totals so we can guard markAsSeen until they're loaded.
    Without this guard, markAsSeen(id) runs when currentUser resolves but
    before the count API returns — totalMatching is still null, so it writes
    seen=0 to localStorage and the badge inflates to the full total on next load.
  */
  const totalEmpMatching = useCountCurrentEmployeeMatchingStore(
    (s) => s.totalEmpMatching,
  );
  const totalCmpMatching = useCountCurrentCompanyMatchingStore(
    (s) => s.totalCmpMatching,
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
    // Only mark as seen once the server count has been fetched.
    // totalMatching starts as null and becomes a number after the API returns.
    if (isEmployee) {
      if (totalEmpMatching === null) return;
      markEmpMatchingAsSeen(id);
    } else {
      if (totalCmpMatching === null) return;
      markCmpMatchingAsSeen(id);
    }
  }, [
    currentUser,
    isEmployee,
    totalEmpMatching,
    totalCmpMatching,
    markEmpMatchingAsSeen,
    markCmpMatchingAsSeen,
  ]);

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
    [currentUser, chatLoadingId, initiateChat, router],
  );

  // ── Unmatch Handler ──────────────────────────────────────────
  const handleUnmatch = useCallback(
    async (otherId: string) => {
      if (unmatchingId) return;
      const employeeId = isEmployee
        ? (currentUser?.employee?.id ?? "")
        : otherId;
      const companyId = isEmployee ? otherId : (currentUser?.company?.id ?? "");

      setUnmatchingId(otherId);

      /* 
        Flag suppresses the "You have been unmatched" toast in the socket
        listener — must be set BEFORE the API call so it's active when the
        server emits unmatchUpdate back to us.
      */
      markUnmatchInitiated();

      // Show loading feedback
      const loadingToast = toast.loading(t("unmatchLoading"));

      // Optimistic removal — match card + chat sidebar + interviews
      if (isEmployee) getCurrentEmpStore.removeMatch(otherId);
      else getCurrentCmpStore.removeMatch(otherId);

      removeChatByPartnerId(otherId);
      removeInterviewsByPartnerId(otherId);

      await unmatch(employeeId, companyId, isEmployee);
      setUnmatchingId(null);

      // Read fresh state directly from the store after await (avoids stale closure)
      const { unmatchError: postError } = useUnmatchStore.getState();

      toast.dismiss(loadingToast);

      if (!postError) {
        // Badge decrement is handled by the socket unmatchUpdate event (fires for
        // both parties) — no local decrement needed here to avoid double-counting.
        toast.success(t("unmatchSuccess"));
      } else {
        // Restore all three optimistically-removed pieces
        const currentId = isEmployee
          ? currentUser?.employee?.id
          : currentUser?.company?.id;
        const role = isEmployee ? USER_ROLE.EMPLOYEE : USER_ROLE.COMPANY;

        if (currentId) {
          // 1. Restore match list
          if (isEmployee)
            getCurrentEmpStore.queryCurrentEmployeeMatching(currentId);
          else getCurrentCmpStore.queryCurrentCompanyMatching(currentId);

          // 2. Restore chat sidebar
          getRecentChats();
          // 3. Restore interviews
          void silentRefetchInterviews(currentId, role);
        }

        toast.error(t("unmatchError"));
      }
    },
    [
      unmatchingId,
      isEmployee,
      currentUser,
      unmatch,
      getCurrentEmpStore,
      getCurrentCmpStore,
      removeChatByPartnerId,
      removeInterviewsByPartnerId,
      getRecentChats,
      silentRefetchInterviews,
      t,
    ],
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
      {/* Compact Page Introduction Section */}
      <FeaturePageHeader
        title={t("bannerTitle")}
        description={t("bannerSubtitle1")}
      />

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
              onUnmatch={() => handleUnmatch(cmp.id)}
              isChatLoading={chatLoadingId === cmp.id}
              isUnmatching={unmatchingId === cmp.id}
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
              onUnmatch={() => handleUnmatch(emp.id)}
              isChatLoading={chatLoadingId === emp.id}
              isUnmatching={unmatchingId === emp.id}
              companyId={currentUser?.company?.id ?? ""}
              skillScore={emp.skillScore}
            />
          ))
        ) : (
          /* Empty Matching List Section */
          <div className="w-full flex flex-col items-center justify-center gap-4 my-16">
            {/* Editorial Illustration Section */}
            <EditorialIllustration variant="matching" />

            {/* Empty List Text Section */}
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              {t("emptyList")}
            </TypographyP>

            {/* Go To Feed Button Section */}
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
