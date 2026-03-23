"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { initateChat } from "./_apis/initiate-chat.api";
import MatchingLoadingSkeleton from "./skeleton";
import { emptySvgImage, matchingSvgImage } from "@/utils/constants/asset.constant";

export default function MatchingPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();

  /* ----------------------------- API Integration ---------------------------- */
  const getCurrentEmpStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCmpStore = useGetCurrentCompanyMatchingStore();

  /* -------------------------------- All States ------------------------------- */
  // Track which card is in a loading state to prevent double-clicks
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  /* --------------------------------- Effects --------------------------------- */
  // Use Custom Hook - Handles all ref logic and duplicate prevention for fetching favorites
  const { isEmployee, currentUser } = useFetchOnce({
    cacheKey: "matching-page",
    onEmployeeFetch: getCurrentEmpStore.queryCurrentEmployeeMatching,
    onCompanyFetch: getCurrentCmpStore.queryCurrentCompanyMatching,
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Chat Handler ─────────────────────────────────────────
  const handleChatNow = useCallback(
    async (senderId: string, receiverId: string) => {
      if (!currentUser || chatLoadingId) return;
      if (senderId === receiverId) return;

      setChatLoadingId(receiverId);
      try {
        const initateChatData = await initateChat(senderId, receiverId);
        router.push(`/message?chatId=${initateChatData.id}`);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
      } finally {
        setChatLoadingId(null);
      }
    },
    [currentUser, chatLoadingId, router],
  );

  /* ------------------------------ Loading State ------------------------------ */
  const isLoadingForEmployee =
    isEmployee &&
    (getCurrentEmpStore.loading ||
      getCurrentEmpStore.currentEmployeeMatching === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getCurrentCmpStore.loading ||
      getCurrentCmpStore.currentCompanyMatching === null);

  const isLoading = isLoadingForEmployee || isLoadingForCompany;

  if (isLoading) return <MatchingLoadingSkeleton isEmployee={isEmployee} />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
        {/* Content Section */}
        <div className="flex flex-col items-start gap-3 px-1 sm:px-5 tablet-xl:mt-2 tablet-xl:w-full tablet-xl:items-center">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            Ready to find your match? Let&apos;s make it happen.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Find Your Perfect Match & Start a Conversation
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Start chatting, connect instantly, and build your future together.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            When companies and talents like each other — it&apos;s a match.
          </TypographyMuted>
        </div>

        {/* Image Poster Section */}
        <Image
          src={matchingSvgImage}
          alt="matching"
          height={250}
          width={350}
          className="h-auto max-w-[320px] tablet-xl:!w-full"
          priority
        />
      </div>

      {/* Matching Card List Section */}
      <div className="flex flex-col items-start gap-3">
        {getCurrentEmpStore.currentEmployeeMatching &&
        getCurrentEmpStore.currentEmployeeMatching.length > 0 ? (
          getCurrentEmpStore.currentEmployeeMatching.map((cmp) => (
            /* Matching Company Card */
            <MatchingCompanyCard
              key={cmp.id}
              name={cmp.name}
              avatar={cmp.avatar ?? ""}
              industry={cmp.industry}
              description={cmp.description}
              companySize={cmp.companySize}
              foundedYear={cmp.foundedYear}
              openPosition={cmp.openPositions}
              location={cmp.location}
              onChatNowClick={() => {
                const senderId =
                  currentUser?.employee?.id ?? currentUser?.company?.id ?? "";
                handleChatNow(senderId, cmp.id);
              }}
            />
          ))
        ) : getCurrentCmpStore.currentCompanyMatching &&
          getCurrentCmpStore.currentCompanyMatching.length > 0 ? (
          getCurrentCmpStore.currentCompanyMatching.map((emp) => (
            /* Matching Employee Card */
            <MatchingEmployeeCard
              key={emp.id}
              name={`${emp.firstname} ${emp.lastname}`}
              username={emp.username ?? ""}
              avatar={emp.avatar ?? ""}
              description={emp.description}
              position={emp.job}
              experience={emp.yearsOfExperience}
              availability={emp.availability}
              location={emp.location ?? ""}
              skills={emp.skills.map((skill) => skill.name)}
              onChatNowClick={() => {
                const senderId =
                  currentUser?.employee?.id ?? currentUser?.company?.id ?? "";
                handleChatNow(senderId, emp.id);
              }}
            />
          ))
        ) : (
          /* Empty Matching List Section */
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image src={emptySvgImage} alt="empty" height={200} width={200} />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              Matching List Empty
            </TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
