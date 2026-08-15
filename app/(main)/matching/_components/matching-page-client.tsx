"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { CountUp } from "@/components/utils/animations/count-up";
import { Building2, Users } from "lucide-react";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";

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
  const chatInFlightRef = useRef<boolean>(false);
  const unmatchInFlightRef = useRef<boolean>(false);

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
      if (!currentUser || chatInFlightRef.current) return;
      if (senderId === receiverId) return;

      chatInFlightRef.current = true;
      setChatLoadingId(receiverId);
      try {
        const initateChatData = await initiateChat(senderId, receiverId);
        router.push(`/message?chatId=${initateChatData.id}`);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
      } finally {
        chatInFlightRef.current = false;
        setChatLoadingId(null);
      }
    },
    [currentUser, initiateChat, router],
  );

  // ── Unmatch Handler ──────────────────────────────────────────
  const handleUnmatch = useCallback(
    async (otherId: string) => {
      if (unmatchInFlightRef.current) return;
      const employeeId = isEmployee
        ? (currentUser?.employee?.id ?? "")
        : otherId;
      const companyId = isEmployee ? otherId : (currentUser?.company?.id ?? "");

      unmatchInFlightRef.current = true;
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
      unmatchInFlightRef.current = false;
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
  const matchingError = isEmployee
    ? getCurrentEmpStore.error
    : getCurrentCmpStore.error;
  const matchingUserId = isEmployee
    ? currentUser?.employee?.id
    : currentUser?.company?.id;

  if (mounted && currentUser && matchingError)
    return (
      <div className="mx-auto w-full max-w-[1500px] px-3 py-10 sm:px-4 lg:px-5">
        <PageState
          variant="error"
          title={matchingError}
          description={t("loadErrorDescription")}
          action={
            matchingUserId
              ? {
                  label: t("retry"),
                  onClick: () =>
                    isEmployee
                      ? getCurrentEmpStore.queryCurrentEmployeeMatching(
                          matchingUserId,
                        )
                      : getCurrentCmpStore.queryCurrentCompanyMatching(
                          matchingUserId,
                        ),
                }
              : undefined
          }
        />
      </div>
    );

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

  const matchCount = isEmployee
    ? (getCurrentEmpStore.currentEmployeeMatching?.length ?? 0)
    : (getCurrentCmpStore.currentCompanyMatching?.length ?? 0);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="matching-editorial animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("matchNetwork")}
        title={t("bannerTitle")}
        subtitle={`${t("bannerSubtitle1")} ${t("bannerSubtitle2")}`}
        stats={[
          {
            icon: "users",
            label: t("statMatches"),
            value: matchCount,
          },
        ]}
      />

      {/* Matches Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="pixel-display text-xl text-foreground sm:text-2xl">
                {t("yourMatches")}
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                <span className="pixel-numeral">
                  <CountUp to={matchCount} duration={900} />
                </span>{" "}
                {t("connections")}
              </p>
            </div>
          </div>
          <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            {isEmployee ? (
              <Building2 className="size-4" />
            ) : (
              <Users className="size-4" />
            )}
          </div>
        </div>

        {/* Matching Card List Section */}
        <div className="stagger-list flex w-full flex-col items-start gap-3">
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
                matchScore={cmp.matchScore}
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
                matchScore={emp.matchScore}
              />
            ))
          ) : (
            /* Empty Matching List Section */
            <PageState
              variant="empty"
              title={t("emptyList")}
              compact
              className="my-6 sm:my-8"
              action={{ label: t("goToFeed"), href: "/feed" }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
