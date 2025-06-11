"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import EmployeeSearchSvg from "@/assets/svg/employee-search.svg";
import SearchBar from "@/components/search/search-bar";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { RadioGroup } from "@/components/ui/radio-group";
import SearchRelevantDropdown from "@/components/search/search-bar/search-relevant-dropdown";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { useSearchJobStore } from "@/stores/apis/job/search-job.store";
import { useEffect } from "react";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import SearchEmployeeCardSkeleton from "@/components/search/search-company-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideCalendarDays, LucideUsers } from "lucide-react";
import SearchCompanyCard from "@/components/search/search-company-card";

export default function SearchPage() {
  const { jobs, querySearchJobs } = useSearchJobStore();
  const accessToken = useLoginStore((state) => state.accessToken);
  const getCurrentUser = useGetCurrentUserStore(
    (state) => state.getCurrentUser
  );

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      if (!accessToken) return;

      await getCurrentUser(accessToken);
      const user = useGetCurrentUserStore.getState().user;

      const scopes =
        user?.role === "company"
          ? user?.company?.careerScopes
          : user?.employee?.careerScopes;

      const scopeNames = scopes?.map((cs) => cs.name) ?? [];

      querySearchJobs({ careerScopes: scopeNames }, accessToken);
    };

    fetchUserAndJobs();
  }, [accessToken]);

  return (
    <div className="w-full flex flex-col items-start gap-5 px-10">
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2 className="leading-relaxed">
            Hire Smarter, Anywhere.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            Search top talent and connect instantly.
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            Search profiles, review resumes, and reach out directly — instantly.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            Your next great hire is just a click away.
          </TypographyMuted>
          <SearchBar />
        </div>
        <Image
          src={EmployeeSearchSvg}
          alt="feed"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>
      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        <div className="w-1/4 flex flex-col items-start gap-5 p-5 shadow-md rounded-md">
          <TypographyH4 className="text-lg">Refine Result</TypographyH4>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideCalendarDays strokeWidth={'1.5px'}/>
              Date Posted
            </TypographyP>
            <RadioGroup className="ml-3">
              <RadioGroupItemWithLabel
                id="r1"
                value="last 24 hours"
                htmlFor="r1"
              >
                Last 2 Hours
              </RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id="r2" value="last 3 days" htmlFor="r2">
                Last 3 Days
              </RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id="r3" value="last week" htmlFor="r3">
                Last week
              </RadioGroupItemWithLabel>
            </RadioGroup>
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideUsers strokeWidth={'1.5px'}/>
              Company Size
            </TypographyP>
            <RadioGroup className="ml-3">
              <RadioGroupItemWithLabel
                id="r1"
                value="last 24 hours"
                htmlFor="r1"
              >
                Start up (1-50)
              </RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id="r2" value="last 3 days" htmlFor="r2">
                Medium (51-500)
              </RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id="r3" value="last week" htmlFor="r3">
                Large (500+)
              </RadioGroupItemWithLabel>
            </RadioGroup>
          </div>
        </div>
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">
              {jobs && jobs.length > 0 ? (
                jobs.length === 1 ? (
                  `${jobs.length} Job Found`
                ) : (
                  `${jobs.length} Jobs Found`
                )
              ) : (
                <Skeleton className="h-6 w-40 bg-muted" />
              )}
            </TypographyH4>
            <SearchRelevantDropdown />
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {jobs && jobs.length > 0 ? (
              jobs.map((item, index) => (
                <SearchCompanyCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  type={item.type}
                  salary={item.salary}
                  experience={item.experience}
                  education={item.education}
                  skills={item.skills}
                  postedDate={item.postedDate!}
                  company={{
                    id: item.company.id,
                    name: item.company.name,
                    avatar: item.company.avatar,
                    companySize: item.company.companySize,
                    industry: item.company.industry,
                    location: item.company.location,
                    userId: item.company.user.id,
                  }}
                />
              ))
            ) : (
              <div className="w-full mb-3">
                <SearchEmployeeCardSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
