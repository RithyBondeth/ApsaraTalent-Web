"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import EmployeeSearchSvg from "@/assets/svg/employee-search.svg";
import SearchBar from "@/components/search/search-bar";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { useSearchJobStore } from "@/stores/apis/job/search-job.store";
import { useEffect, useState } from "react";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import SearchEmployeeCardSkeleton from "@/components/search/search-company-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideBriefcaseBusiness,
  LucideCalendarDays,
  LucideCircleDollarSign,
  LucideGraduationCap,
  LucideUsers,
} from "lucide-react";
import SearchCompanyCard from "@/components/search/search-company-card";
import { Controller, useForm } from "react-hook-form";
import { employeeSearchSchema, TEmployeeSearchSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TLocations } from "@/utils/types/location.type";
import { SearchErrorCard } from "@/components/search/search-error-card";

export default function SearchPage() {
  const { error, loading, jobs, querySearchJobs } = useSearchJobStore();
  const accessToken = useLoginStore((state) => state.accessToken);
  const getCurrentUser = useGetCurrentUserStore(
    (state) => state.getCurrentUser
  );
  const [scopeNames, setScopeNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      if (!accessToken) return;

      await getCurrentUser(accessToken);
      const user = useGetCurrentUserStore.getState().user;

      const scopes =
        user?.role === "company"
          ? user?.company?.careerScopes
          : user?.employee?.careerScopes;

      const names = scopes?.map((cs) => cs.name) ?? [];
      setScopeNames(names);

      const userLocation =
        user?.role === "company"
          ? user.company?.location
          : user?.employee?.location;

      if (userLocation) {
        setValue("location", userLocation);
      }

      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      querySearchJobs(
        {
          careerScopes: names,
          companySizeMin: 51,
          companySizeMax: 500,
          postedDateFrom: threeDaysAgo.toISOString(),
          postedDateTo: now.toISOString(),
          sortBy: "title",
          sortOrder: "DESC",
        },
        accessToken
      );
    };

    fetchUserAndJobs();
  }, [accessToken]);

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const { register, control, setValue, handleSubmit } =
    useForm<TEmployeeSearchSchema>({
      resolver: zodResolver(employeeSearchSchema),
      defaultValues: {
        keyword: "",
        location: undefined,
        companySize: {
          min: 51,
          max: 500,
        },
        date: {
          from: threeDaysAgo,
          to: now,
        },
        salaryRange: {
          min: 0,
          max: 300,
        },
        educationLevel: "Bachelor",
        experienceLevel: {
          min: 0,
          max: 1,
        },
        sortBy: "title",
        orderBy: "desc",
      },
    });

  const onSubmit = (data: TEmployeeSearchSchema) => {
    if (!accessToken) return;

    querySearchJobs(
      {
        careerScopes: scopeNames,
        keyword: data.keyword,
        location: data.location,
        companySizeMin: data.companySize?.min,
        companySizeMax: data.companySize?.max,
        postedDateFrom: data.date?.from?.toISOString(),
        postedDateTo: data.date?.to?.toISOString(),
        sortBy: data.sortBy,
        sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
      },
      accessToken
    );
  };

  return (
    <form
      className="w-full flex flex-col items-start gap-5 px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
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
          <SearchBar
            isEmployee={true}
            register={register}
            setValue={setValue}
            initialLocation={control._formValues.location as TLocations}
          />
        </div>
        <Image
          src={EmployeeSearchSvg}
          alt="employee-search"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>
      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        <div className="w-1/4 flex flex-col items-start gap-8 p-5 shadow-md rounded-md">
          <TypographyH4 className="text-lg">Refine Result</TypographyH4>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideCalendarDays strokeWidth={"1.5px"} />
              Date Posted
            </TypographyP>
            <Controller
              name="date"
              control={control}
              render={({ field }) => {
                const from = field.value?.from;
                const to = field.value?.to;

                let selectedValue: string | undefined;

                if (from && to) {
                  const diffHours =
                    (to.getTime() - from.getTime()) / 1000 / 60 / 60;
                  if (diffHours <= 2) selectedValue = "last 24 hours";
                  else if (diffHours <= 72) selectedValue = "last 3 days";
                  else if (diffHours <= 168) selectedValue = "last week";
                }

                return (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={(val) => {
                      const now = new Date();
                      let from = new Date();

                      switch (val) {
                        case "last 24 hours":
                          from.setHours(now.getHours() - 2);
                          break;
                        case "last 3 days":
                          from.setDate(now.getDate() - 3);
                          break;
                        case "last week":
                          from.setDate(now.getDate() - 7);
                          break;
                      }

                      const updated = { from, to: now };
                      field.onChange(updated);
                      setValue("date", updated);
                      handleSubmit(onSubmit)();
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="last-24"
                      value="last 24 hours"
                      htmlFor="last-24"
                    >
                      Last 2 Hours
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="last-3-days"
                      value="last 3 days"
                      htmlFor="last-3-days"
                    >
                      Last 3 Days
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="last-week"
                      value="last week"
                      htmlFor="last-week"
                    >
                      Last Week
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideUsers strokeWidth={"1.5px"} />
              Company Size
            </TypographyP>
            <Controller
              name="companySize"
              control={control}
              render={({ field }) => {
                const { min, max } = field.value ?? {};
                const selectedValue =
                  min === 1 && max === 50
                    ? "startup"
                    : min === 51 && max === 500
                    ? "medium"
                    : min === 501 && max === undefined
                    ? "large"
                    : undefined;

                return (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={(val) => {
                      let updated;

                      switch (val) {
                        case "startup":
                          updated = { min: 1, max: 50 };
                          break;
                        case "medium":
                          updated = { min: 51, max: 500 };
                          break;
                        case "large":
                          updated = { min: 501, max: undefined };
                          break;
                      }

                      field.onChange(updated);
                      setValue("companySize", updated);
                      handleSubmit(onSubmit)();
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="startup"
                      value="startup"
                      htmlFor="startup"
                    >
                      Start up (1–50)
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="medium"
                      value="medium"
                      htmlFor="medium"
                    >
                      Medium (51–500)
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="large"
                      value="large"
                      htmlFor="large"
                    >
                      Large (500+)
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideCircleDollarSign strokeWidth={"1.5px"} />
              Salary Range
            </TypographyP>
            <Controller
              name="salaryRange"
              control={control}
              render={({ field }) => {
                const selectedValue =
                  field.value?.min === 0 && field.value?.max === 300
                    ? "0-300"
                    : field.value?.min === 300 && field.value?.max === 600
                    ? "300-600"
                    : field.value?.min === 600 && field.value?.max === 1000
                    ? "600-1000"
                    : field.value?.min === 1000 && !field.value?.max
                    ? "1000+"
                    : undefined;

                return (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={(val) => {
                      let updated;
                      switch (val) {
                        case "0-300":
                          updated = { min: 0, max: 300 };
                          break;
                        case "300-600":
                          updated = { min: 300, max: 600 };
                          break;
                        case "600-1000":
                          updated = { min: 600, max: 1000 };
                          break;
                        case "1000+":
                          updated = { min: 1000, max: undefined };
                          break;
                      }
                      field.onChange(updated);
                      setValue("salaryRange", updated);
                      handleSubmit(onSubmit)();
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="salary-0-300"
                      value="0-300"
                      htmlFor="salary-0-300"
                    >
                      0$ - 300$
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="salary-300-600"
                      value="300-600"
                      htmlFor="salary-300-600"
                    >
                      300$ - 600$
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="salary-600-1000"
                      value="600-1000"
                      htmlFor="salary-600-1000"
                    >
                      600$ - 1000$
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="salary-1000-up"
                      value="1000+"
                      htmlFor="salary-1000-up"
                    >
                      Up to 1000$
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideGraduationCap strokeWidth={"1.5px"} />
              Education Level
            </TypographyP>
            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("educationLevel", val);
                    handleSubmit(onSubmit)();
                  }}
                  className="ml-3"
                >
                  <RadioGroupItemWithLabel
                    id="Under Graduate"
                    value="Under Graduate"
                    htmlFor="edu-undergrad"
                  >
                    Under Graduate
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="Bachelor"
                    value="Bachelor"
                    htmlFor="edu-bachelor"
                  >
                    Bachelor
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="Master"
                    value="Master"
                    htmlFor="edu-master"
                  >
                    Master
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="PHD"
                    value="PHD"
                    htmlFor="edu-phd"
                  >
                    PhD
                  </RadioGroupItemWithLabel>
                </RadioGroup>
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
              Experience Level
            </TypographyP>
            <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => {
                const selectedValue =
                  field.value?.min === 0 && field.value?.max === 1
                    ? "<1"
                    : field.value?.min === 1 && field.value?.max === 2
                    ? "1-2"
                    : field.value?.min === 2 && field.value?.max === 3
                    ? "2-3"
                    : field.value?.min === 3 && !field.value?.max
                    ? ">3"
                    : undefined;

                return (
                  <RadioGroup
                  value={selectedValue}
                  onValueChange={(val) => {
                    let min = 0, max: number | undefined = undefined;
                    if (val === "0-300") {
                      min = 0;
                      max = 300;
                    } else if (val === "300-600") {
                      min = 300;
                      max = 600;
                    } else if (val === "600-1000") {
                      min = 600;
                      max = 1000;
                    } else if (val === "1000+") {
                      min = 1000;
                      max = undefined;
                    }
                    const updated = { min, max };
                    field.onChange(updated);
                    setValue("salaryRange", updated);
                    handleSubmit(onSubmit)();
                  }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="exp-less-1"
                      value="<1"
                      htmlFor="exp-less-1"
                    >
                      Less than 1 year
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-1-2"
                      value="1-2"
                      htmlFor="exp-1-2"
                    >
                      1 - 2 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-2-3"
                      value="2-3"
                      htmlFor="exp-2-3"
                    >
                      2 - 3 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-more-3"
                      value=">3"
                      htmlFor="exp-more-3"
                    >
                      More than 3 years
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
        </div>
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">
              {loading ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <span className="text-destructive">0 Job Found</span>
              ) : jobs && jobs.length > 0 ? (
                jobs.length === 1 ? (
                  `${jobs.length} Job Found`
                ) : (
                  `${jobs.length} Jobs Found`
                )
              ) : (
                <Skeleton className="h-6 w-40 bg-muted" />
              )}
            </TypographyH4>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {loading ? (
              <div className="w-full mb-3">
                <SearchEmployeeCardSkeleton />
              </div>
            ) : error ? (
              <div className="w-full mb-3">
                <SearchErrorCard
                  error={error}
                  errorDescription="Try adjusting your filters or search terms and try again."
                />
              </div>
            ) : jobs && jobs.length > 0 ? (
              jobs.map((item, index) => (
                <SearchCompanyCard
                  key={index}
                  title={item.title}
                  description={""}
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
    </form>
  );
}
