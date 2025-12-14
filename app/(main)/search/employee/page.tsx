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
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { TAvailability } from "@/utils/types/availability.type";
import { debounce } from "lodash";

export default function SearchPage() {
  const { error, loading, jobs, querySearchJobs } = useSearchJobStore();
  const { user } = useGetCurrentUserStore(); 
  const [scopeNames, setScopeNames] = useState<string[]>([]);

  const { register, control, setValue, handleSubmit, watch } =
    useForm<TEmployeeSearchSchema>({
      resolver: zodResolver(employeeSearchSchema),
      defaultValues: {
        keyword: "",
        location: "all",
        jobType: "all",
        companySize: { min: undefined, max: undefined },
        date: { from: undefined, to: undefined },
        salaryRange: { min: undefined, max: undefined },
        educationLevel: "all",
        experienceLevel: { min: undefined, max: undefined },
        sortBy: "title",
        orderBy: "desc",
      },
    });

  // Watch form values for debounced submission
  const watchAllFields = watch();

  const onSubmit = useCallback((data: TEmployeeSearchSchema) => {  
    const normalizedJobType = data.jobType === "all" ? undefined : data.jobType;
    const normalizedLocation = data.location === "all" ? undefined : data.location;
    const normalizedEducation = data.educationLevel === "all" ? undefined : data.educationLevel;
    const normalizedExperience =
      data.experienceLevel?.min === undefined && data.experienceLevel?.max === undefined
        ? undefined
        : data.experienceLevel;
  
    const queryParams = {
      careerScopes: scopeNames,
      keyword: data.keyword,
      location: normalizedLocation,
      jobType: normalizedJobType,
      companySizeMin: data.companySize?.min,
      companySizeMax: data.companySize?.max,
      postedDateFrom: data.date?.from?.toISOString(),
      postedDateTo: data.date?.to?.toISOString(),
      salaryMin: data.salaryRange?.min,
      salaryMax: data.salaryRange?.max,
      educationRequired: normalizedEducation,
      experienceRequiredMin: normalizedExperience?.min,
      experienceRequiredMax: normalizedExperience?.max,
      sortBy: data.sortBy,
      sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
    };
  
    querySearchJobs(queryParams);
  }, [querySearchJobs, scopeNames]);

  // Debounced form submission
  const debouncedSubmit = useMemo(
    () => debounce(onSubmit, 400),
    [onSubmit]
  );

  // Initial data fetch
  useEffect(() => {
    if (user) {
      const scopes =
        user?.role === "company"
          ? user?.company?.careerScopes
          : user?.employee?.careerScopes;
      const names = scopes?.map((cs) => cs.name) ?? [];
      setScopeNames(names);
      
      // Initial search with user's career scopes
      querySearchJobs({
        careerScopes: names,
        sortBy: "title",
        sortOrder: "DESC",
      });
    }
  }, [user, querySearchJobs]);

  // Trigger search when filters change
  useEffect(() => {
    const subscription = watch((value) => {
      debouncedSubmit(value as TEmployeeSearchSchema);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSubmit]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  // Handler for radio group changes
  const handleRadioChange = (fieldName: keyof TEmployeeSearchSchema, value: any) => {
    setValue(fieldName, value, { shouldDirty: true });
    // No need to call handleSubmit here - the watch effect will handle it
  };

  return (
    <form
      className="w-full flex flex-col items-start gap-5 px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2 className="leading-relaxed">
            Find Opportunities, Anywhere.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            Search top careers and connect instantly.
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            Search careers, review company, and reach out directly — instantly.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            Your great opportunity is just a click away.
          </TypographyMuted>
          <SearchBar
            isEmployee={true}
            register={register}
            setValue={setValue}
            initialLocation={watchAllFields.location as TLocations}
            initialJobType={watchAllFields.jobType as TAvailability}
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
          
          {/* Date Posted */}
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
                if (!from && !to) selectedValue = "all";
                else if (from && to) {
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
                      let updated: {
                        from: Date | undefined;
                        to: Date | undefined;
                      } = { from: undefined, to: undefined };
                      if (val !== "all") {
                        const now = new Date();
                        const from = new Date();
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
                        updated = { from, to: new Date() };
                      }
                      handleRadioChange("date", updated);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="date-all"
                      value="all"
                      htmlFor="date-all"
                    >
                      All Dates Posted
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="last-24"
                      value="last 24 hours"
                      htmlFor="last-24"
                    >
                      Last 24 Hours
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

          {/* Company Size */}
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
                    : "all";

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
                        case "all":
                        default:
                          updated = { min: undefined, max: undefined };
                      }
                      handleRadioChange("companySize", updated);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="company-all"
                      value="all"
                      htmlFor="company-all"
                    >
                      All Sizes
                    </RadioGroupItemWithLabel>
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

          {/* Salary Range */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideCircleDollarSign strokeWidth={"1.5px"} />
              Salary Range
            </TypographyP>
            <Controller
              name="salaryRange"
              control={control}
              render={({ field }) => {
                const { min, max } = field.value ?? {};
                const selectedValue =
                  min === undefined && max === undefined
                    ? "all"
                    : min === 0 && max === 300
                    ? "0-300"
                    : min === 300 && max === 600
                    ? "300-600"
                    : min === 600 && max === 1000
                    ? "600-1000"
                    : min === 1000 && max === undefined
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
                        case "all":
                        default:
                          updated = { min: undefined, max: undefined };
                          break;
                      }
                      handleRadioChange("salaryRange", updated);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="salary-all"
                      value="all"
                      htmlFor="salary-all"
                    >
                      All Salaries
                    </RadioGroupItemWithLabel>
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
                      1000$+
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>

          {/* Education Level */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideGraduationCap strokeWidth={"1.5px"} />
              Education Level
            </TypographyP>
            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => {
                const education = field.value ?? "all";
                return (
                  <RadioGroup
                    value={education}
                    onValueChange={(val) => {
                      const value = val === "all" ? undefined : val;
                      handleRadioChange("educationLevel", value);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="edu-all"
                      value="all"
                      htmlFor="edu-all"
                    >
                      All Levels
                    </RadioGroupItemWithLabel>
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
                );
              }}
            />
          </div>

          {/* Experience Level */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
              Experience Level
            </TypographyP>
            <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => {
                const { min, max } = field.value ?? {};
                const selectedValue =
                  min === 0 && max === 1
                    ? "<1"
                    : min === 1 && max === 2
                    ? "1-2"
                    : min === 2 && max === 3
                    ? "2-3"
                    : min === 3 && max === undefined
                    ? ">3"
                    : "all";

                return (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={(val) => {
                      let updated;
                      switch (val) {
                        case "<1":
                          updated = { min: 0, max: 1 };
                          break;
                        case "1-2":
                          updated = { min: 1, max: 2 };
                          break;
                        case "2-3":
                          updated = { min: 2, max: 3 };
                          break;
                        case ">3":
                          updated = { min: 3, max: undefined };
                          break;
                        case "all":
                        default:
                          updated = { min: undefined, max: undefined };
                      }
                      handleRadioChange("experienceLevel", updated);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="exp-all"
                      value="all"
                      htmlFor="exp-all"
                    >
                      All Levels
                    </RadioGroupItemWithLabel>
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

        {/* Results Section */}
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">
              {loading ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <span className="text-destructive">0 Job is listing</span>
              ) : jobs && jobs.length > 0 ? (
                `${jobs.length} Job${jobs.length === 1 ? '' : 's'} listed`
              ) : (
                <Skeleton className="h-6 w-40 bg-muted" />
              )}
            </TypographyH4>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {error ? (
              <div className="w-full mb-3">
                <SearchErrorCard
                  error={error}
                  errorDescription="Try adjusting your filters or search terms and try again."
                />
              </div>
            ) : jobs && jobs.length > 0 ? (
              jobs.map((item, index) => (
                <SearchCompanyCard
                  key={item.id || index}
                  id={item.company.id}
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
                  }}
                />
              ))
            ) : (
              <div className="w-full mb-3">
                {Array(3).fill(0).map((_, index) => <SearchEmployeeCardSkeleton key={index}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}