"use client";

import SearchBar from "@/components/search/search-bar";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { companySearchSchema, TCompanySearchSchema } from "./validation";
import CompanySearchSvg from "@/assets/svg/company-search.svg";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideBriefcaseBusiness, LucideGraduationCap } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchErrorCard } from "@/components/search/search-error-card";
import SearchEmployeeCard from "@/components/search/search-employee-card";
import { useSearchEmployeeStore } from "@/stores/apis/employee/search-emp.store";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect, useMemo, useState } from "react";
import { TLocations } from "@/utils/types/location.type";
import { TAvailability } from "@/utils/types/availability.type";
import SearchEmployeeCardSkeleton from "@/components/search/search-company-card/skeleton";
import { debounce } from "lodash";

export default function CompanySearchPage() {
  const { error, loading, employees, querySearchEmployee } =
  useSearchEmployeeStore();
const accessToken = useLoginStore((state) => state.accessToken);
const getCurrentUser = useGetCurrentUserStore((state) => state.getCurrentUser);
const user = useGetCurrentUserStore((state) => state.user);

const [scopeNames, setScopeNames] = useState<string[]>();

const { register, setValue, control, handleSubmit, watch } =
  useForm<TCompanySearchSchema>({
    resolver: zodResolver(companySearchSchema),
    defaultValues: {
      keyword: "",
      location: "all",
      jobType: "all",
      experienceLevel: { min: undefined, max: undefined },
      educationLevel: "All",
      sortBy: "firstname",
      orderBy: "desc",
    },
  });

const onSubmit = (data: TCompanySearchSchema) => {
  if (!accessToken) return;

  const normalizedJobType = data.jobType === "all" ? undefined : data.jobType;
  const normalizedLocation = data.location === "all" ? undefined : data.location;
  const normalizedEducation = data.educationLevel === "All" ? undefined : data.educationLevel;
  const normalizedExperience =
    data.experienceLevel?.min === undefined && data.experienceLevel?.max === undefined
      ? { min: undefined, max: undefined }
      : data.experienceLevel;

  querySearchEmployee(
    {
      careerScopes: scopeNames,
      keyword: data.keyword,
      location: normalizedLocation as TLocations,
      jobType: normalizedJobType as TAvailability,
      experienceMin: normalizedExperience.min,
      experienceMax: normalizedExperience.max,
      education: normalizedEducation,
      sortBy: data.sortBy,
      sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
    },
    accessToken
  );
};

const debouncedSubmit = useMemo(() => debounce(handleSubmit(onSubmit), 300), [handleSubmit]);

useEffect(() => {
  if (!accessToken) return;
  (async () => {
    await getCurrentUser(accessToken);

    const scopes = user?.role === "company" ? user?.company?.careerScopes : user?.employee?.careerScopes;
    const names = scopes?.map((cs) => cs.name) ?? [];
    setScopeNames(names);

    const userLocation = user?.role === "company" ? user?.company?.location : user?.employee?.location;
    if (userLocation) setValue("location", userLocation);

    querySearchEmployee(
      {
        careerScopes: names,
        sortBy: "firstname",
        sortOrder: "DESC",
      },
      accessToken
    );
  })();
}, [accessToken]);

useEffect(() => {
  return () => {
    debouncedSubmit.cancel();
  };
}, [debouncedSubmit]);

  return (
    <form className="w-full flex flex-col items-start gap-5 px-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2>Hire Smarter, Anywhere.</TypographyH2>
          <TypographyH4>Search top talent and connect instantly.</TypographyH4>
          <TypographyH4>Search profiles, review resumes, and reach out directly — instantly.</TypographyH4>
          <TypographyMuted>Your next great hire is just a click away.</TypographyMuted>
          <SearchBar
            isEmployee={false}
            register={register}
            setValue={setValue}
            initialLocation={control._formValues.location as TLocations}
            initialJobType={control._formValues.jobType as TAvailability}
          />
        </div>
        <Image src={CompanySearchSvg} alt="company-search" height={300} width={400} className="laptop-sm:hidden" />
      </div>

      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        <div className="w-1/4 flex flex-col items-start gap-8 p-5 shadow-md rounded-md">
          <TypographyH4 className="text-lg">Refine Result</TypographyH4>

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
                const education = field.value ?? "All";
                return (
                  <RadioGroup
                    value={education}
                    onValueChange={(val) => {
                      const value = val === "All" ? undefined : val;
                      field.onChange(value);
                      setValue("educationLevel", value);
                      setTimeout(() => {
                        handleSubmit(onSubmit)();
                      }, 0);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel id="edu-all" value="All" htmlFor="edu-all">
                      All
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="edu-undergrad" value="Under Graduate" htmlFor="edu-undergrad">
                      Under Graduate
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="edu-bachelor" value="Bachelor" htmlFor="edu-bachelor">
                      Bachelor
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="edu-master" value="Master" htmlFor="edu-master">
                      Master
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="edu-phd" value="PHD" htmlFor="edu-phd">
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
                    : min === 3 && max === 4
                    ? "3-4"
                    : min === 4 && max === undefined
                    ? ">4"
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
                        case "3-4":
                          updated = { min: 3, max: 4 };
                          break;
                        case ">4":
                          updated = { min: 4, max: undefined };
                          break;
                        case "all":
                        default:
                          updated = { min: undefined, max: undefined };
                      }
                      field.onChange(updated);
                      setValue("experienceLevel", updated);
                      setTimeout(() => {
                        handleSubmit(onSubmit)();
                      }, 0);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel id="exp-all" value="all" htmlFor="exp-all">
                      All
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="exp-less-1" value="<1" htmlFor="exp-less-1">
                      Less than 1 year
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="exp-1-2" value="1-2" htmlFor="exp-1-2">
                      1 - 2 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="exp-2-3" value="2-3" htmlFor="exp-2-3">
                      2 - 3 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="exp-3-4" value="3-4" htmlFor="exp-3-4">
                      3 - 4 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel id="exp-more-4" value=">4" htmlFor="exp-more-4">
                      More than 4 years
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
        </div>

        {/* Right side: Results */}
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">
              {loading ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <span className="text-destructive">0 Employee Found</span>
              ) : employees && employees.length > 0 ? (
                `${employees.length} Employee${employees.length > 1 ? "s" : ""} Found`
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
            ) : employees && employees.length > 0 ? (
              employees.map((item, index) => (
                <SearchEmployeeCard
                  id={item.id}
                  firstname={item.firstname ?? ""}
                  lastname={item.lastname ?? ""}
                  username={item.username ?? ""}
                  avatar={item.avatar ?? ""}
                  job={item.job}
                  yearOfExperience={item.yearsOfExperience}
                  availability={item.availability as TAvailability}
                  description={item.description}
                  location={item.location as TLocations}
                  skills={Array.isArray(item.skills) ? item.skills.map((s) => s.name) : []}
                  education={
                    Array.isArray(item.educations)
                      ? item.educations.map((edu) => edu.degree).join(", ")
                      : ""
                  }
                  key={index}
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