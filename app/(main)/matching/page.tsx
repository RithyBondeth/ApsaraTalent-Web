"use client";

import emptySvgImage from "@/assets/svg/empty.svg";
import matchingSvgImage from "@/assets/svg/matching.svg";
import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingCompanyCardSkeleton from "@/components/matching/matching-company-card/skeleton";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import MatchingEmployeeCardSkeleton from "@/components/matching/matching-employee-card/skeleton";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/use-fetch-once";
import axiosInstance from "@/lib/axios";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import MatchingBannerSkeleton from "./banner-skeleton";

export default function MatchingPage() {
  // Utils
  const router = useRouter();

  // API Integration — use field selectors to avoid re-renders from unrelated store changes
  const empMatching = useGetCurrentEmployeeMatchingStore((s) => s.currentEmployeeMatching);
  const empLoading = useGetCurrentEmployeeMatchingStore((s) => s.loading);
  const queryCurrentEmployeeMatching = useGetCurrentEmployeeMatchingStore((s) => s.queryCurrentEmployeeMatching);

  const cmpMatching = useGetCurrentCompanyMatchingStore((s) => s.currentCompanyMatching);
  const cmpLoading = useGetCurrentCompanyMatchingStore((s) => s.loading);
  const queryCurrentCompanyMatching = useGetCurrentCompanyMatchingStore((s) => s.queryCurrentCompanyMatching);

  // Track which card is in a loading state to prevent double-clicks
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  // Use Custom Hook - Handles all ref logic and duplicate prevention
  const { isEmployee, currentUser } = useFetchOnce({
    cacheKey: "matching-page",
    onEmployeeFetch: queryCurrentEmployeeMatching,
    onCompanyFetch: queryCurrentCompanyMatching,
  });

  // Compute All Loading States
  const isLoadingForEmployee =
    isEmployee && (empLoading || empMatching === null);

  const isLoadingForCompany =
    !isEmployee && (cmpLoading || cmpMatching === null);

  const isLoading = isLoadingForEmployee || isLoadingForCompany;

  // Chat Handler — uses backend REST endpoint, not Firebase
  const handleChatNow = useCallback(
    async (senderId: string, receiverId: string) => {
      if (!currentUser || chatLoadingId) return;

      setChatLoadingId(receiverId);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const res = await axiosInstance.post<{
          chatId: string;
          id: string;        // receiver's resolved User.id — used as chatId in the message page
          name: string;
          avatar: string;
        }>(`${baseUrl}/chat/initiate`, { senderId, receiverId });
        // The backend returns `id` = the receiver's User.id (resolved from employee/company ID).
        // The message page uses chatId as userId2 for getChatHistory socket call.
        router.push(`/message?chatId=${res.data.id}`);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
      } finally {
        setChatLoadingId(null);
      }
    },
    [currentUser, chatLoadingId, router],
  );

  if (isLoading) {
    return (
      <div className="w-full flex flex-col px-5 mt-3">
        <MatchingBannerSkeleton />
        <div className="flex flex-col items-start gap-3 p-3">
          {[...Array(3)].map((_, index) =>
            isEmployee ? (
              <MatchingCompanyCardSkeleton key={index} />
            ) : (
              <MatchingEmployeeCardSkeleton key={index} />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-5">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
        {/* Content Section */}
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center tablet-xl:mt-5 px-5">
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
          className="tablet-xl:!w-full"
          priority
        />
      </div>

      {/* Matching Card List Section */}
      <div className="flex flex-col items-start gap-3">
        {empMatching && empMatching.length > 0 ? (
          empMatching.map((cmp) => (
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
        ) : cmpMatching && cmpMatching.length > 0 ? (
          cmpMatching.map((emp) => (
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
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image src={emptySvgImage} alt="empty" height={200} width={200} />
            <TypographyP className="!m-0">No matched available</TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
