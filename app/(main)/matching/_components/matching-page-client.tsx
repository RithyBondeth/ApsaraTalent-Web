"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useUnmatchStore } from "@/stores/apis/matching/unmatch.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInitiateChatStore } from "@/stores/apis/chat/initiate-chat.store";
import { useChatStore } from "@/stores/features/chat/chat.store";
import { markUnmatchInitiated } from "@/stores/features/chat/socket-listeners";
import { MatchingLoadingSkeleton } from "@/components/matching/skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";
import { emptySvg, matchingBannerSvg } from "@/utils/constants/asset.constant";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { CountUp } from "@/components/utils/animations/count-up";
import { Building2, Handshake, Users } from "lucide-react";

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
    <div className="matching-editorial mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 animate-page-in sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <section className="feed-hero grid min-h-[280px] w-full grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)] overflow-hidden border border-border bg-card tablet-md:grid-cols-1">
        <div className="flex min-w-0 flex-col justify-between gap-8 px-7 py-8 sm:px-9 sm:py-10 tablet-md:gap-5 tablet-md:px-5 tablet-md:py-6">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-7 bg-foreground" />
            {t("matchNetwork")}
          </div>
          <div className="max-w-3xl">
            <h1 className="max-w-[18ch] text-balance text-3xl font-black leading-[1.05] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              {t("bannerTitle")}
            </h1>
            <p className="mt-4 max-w-[60ch] text-sm leading-6 text-muted-foreground sm:text-base">
              {t("bannerSubtitle1")} {t("bannerSubtitle2")}
            </p>
          </div>
          <p className="max-w-[70ch] border-l-2 border-foreground pl-3 text-xs leading-5 text-muted-foreground">
            {t("bannerMuted")}
          </p>
        </div>

        <div className="feed-hero-visual">
          <div aria-hidden className="feed-hero-visual-grid" />
          <div className="feed-hero-network-chip">
            <span className="feed-hero-network-icon" aria-hidden>
              <Handshake />
            </span>
            <span>{t("matchNetwork")}</span>
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
                src={matchingBannerSvg}
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

      {/* Matches Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">
                {t("yourMatches")}
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                <span className="tabular-nums">
                  <CountUp to={matchCount} duration={900} />
                </span>{" "}
                {t("connections")}
              </p>
            </div>
          </div>
          <div className="grid size-9 shrink-0 place-items-center bg-foreground text-background">
            {isEmployee ? (
              <Building2 className="size-4" />
            ) : (
              <Users className="size-4" />
            )}
          </div>
        </div>

        {/* Matching Card List Section */}
        <div className="flex w-full flex-col items-start gap-3 stagger-list">
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
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4 border border-border bg-card px-5 py-12 text-center">
            <Image
              src={emptySvg}
              alt="empty"
              height={200}
              width={200}
              className="animate-float grayscale"
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              {t("emptyList")}
            </TypographyP>
            <Link
              href="/feed"
              className="inline-flex min-h-10 items-center gap-2 bg-foreground px-5 py-2 text-xs font-semibold text-background transition-all hover:opacity-85 active:scale-95"
            >
              {t("goToFeed")}
            </Link>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
