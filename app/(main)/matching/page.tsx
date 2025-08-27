"use client";

import MatchingCompanyCard from "@/components/matching/matching-company-card";
import MatchingCompanyCardSkeleton from "@/components/matching/matching-company-card/skeleton";
import MatchingEmployeeCard from "@/components/matching/matching-employee-card";
import MatchingEmployeeCardSkeleton from "@/components/matching/matching-employee-card/skeleton";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import Image from "next/image";
import matchingSvgImage from "@/assets/svg/matching.svg";
import emptySvgImage from "@/assets/svg/empty.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MatchingBannerSkeleton from "./banner-skeleton";
import { useGetOneEmployeeStore } from "@/stores/apis/employee/get-one-emp.store";
import { createOrGetChat } from "@/utils/firebase/services/chat-service";
import { TypographyP } from "@/components/utils/typography/typography-p";

export default function MatchingPage() {
  const router = useRouter();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const userLoading = useGetCurrentUserStore((state) => state.loading);
  const isInitialized = useGetCurrentUserStore((state) => state.isInitialized);
  const isEmployee = currentUser?.role === "employee";

  const getCurrentEmployeeMatchingStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCompanyMatchingStore = useGetCurrentCompanyMatchingStore();
  const { employeeData, queryOneEmployee } = useGetOneEmployeeStore();
  

  useEffect(() => {
    if (currentUser && currentUser.employee && isEmployee) {
      getCurrentEmployeeMatchingStore.queryCurrentEmployeeMatching(
        currentUser.employee.id
      );
    }
    if (currentUser && currentUser.company && !isEmployee) {
      getCurrentCompanyMatchingStore.queryCurrentCompanyMatching(
        currentUser.company.id
      );
    }
  }, [currentUser, isEmployee]);

  // Compute loading state to avoid flicker of empty state before first fetch resolves
  const isLoadingForEmployee =
    isEmployee &&
    (getCurrentEmployeeMatchingStore.loading ||
      getCurrentEmployeeMatchingStore.currentEmployeeMatching === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getCurrentCompanyMatchingStore.loading ||
      getCurrentCompanyMatchingStore.currentCompanyMatching === null);

  const shouldShowLoading =
    !isInitialized ||
    userLoading ||
    isLoadingForEmployee ||
    isLoadingForCompany;

  if (shouldShowLoading) {
    return (
      <div className="w-full flex flex-col px-5 mt-3">
        <MatchingBannerSkeleton />
        <div className="flex flex-col items-start gap-3 p-3">
          {[...Array(3)].map((_, index) =>
            isEmployee ? (
              <MatchingCompanyCardSkeleton key={index} />
            ) : (
              <MatchingEmployeeCardSkeleton key={index} />
            )
          )}
        </div>
      </div>
    );
  }

  const handleChatNow = async (otherUserId: string) => {
    await queryOneEmployee(otherUserId);

    if(currentUser) {
        const chatId = await createOrGetChat({
            id: (currentUser.employee?.id || currentUser.company?.id) ?? '',
            name: (currentUser.employee?.username || currentUser.company?.name) ?? '',
            profile: (currentUser.employee?.avatar || currentUser.company?.avatar) ?? '',
          },
          {
            id: employeeData?.id ?? "",
            name: employeeData?.username ?? "",
            profile: employeeData?.avatar ?? "",
          });
        router.push(`/message?chatId=${chatId}`);
    }
  };

  return (
    <div className="w-full flex flex-col px-5">
      {getCurrentCompanyMatchingStore.loading ||
      getCurrentEmployeeMatchingStore.loading ? (
        <MatchingBannerSkeleton />
      ) : (
        <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
          <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center tablet-xl:mt-5 px-5">
            <TypographyH2 className="leading-relaxed tablet-xl:text-center">
              Ready to find your match? Let’s make it happen.
            </TypographyH2>
            <TypographyH4 className="leading-relaxed tablet-xl:text-center">
              Find Your Perfect Match & Start a Conversation
            </TypographyH4>
            <TypographyH4 className="leading-relaxed tablet-xl:text-center">
              Start chatting, connect instantly, and build your future together.
            </TypographyH4>
            <TypographyMuted className="leading-relaxed tablet-xl:text-center">
              When companies and talents like each other — it’s a match.
            </TypographyMuted> 
          </div>
          <Image
            src={matchingSvgImage}
            alt="matching"
            height={250}
            width={350}
            className="tablet-xl:!w-full"
          />
        </div>
      )}
      <div className="flex flex-col items-start gap-3">
        {getCurrentEmployeeMatchingStore.currentEmployeeMatching &&
        getCurrentEmployeeMatchingStore.currentEmployeeMatching.length > 0 ? (
          getCurrentEmployeeMatchingStore.currentEmployeeMatching.map((cmp) => (
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
              onChatNowClick={() => handleChatNow(cmp.id)}
            />
          ))
        ) : getCurrentCompanyMatchingStore.currentCompanyMatching &&
          getCurrentCompanyMatchingStore.currentCompanyMatching.length > 0 ? (
          getCurrentCompanyMatchingStore.currentCompanyMatching.map((emp) => (
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
              onChatNowClick={() => handleChatNow(emp.id)}
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image
              src={emptySvgImage}
              alt="empty"
              height={200}
              width={200}
            />
            <TypographyP className="!m-0">No matched available</TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
