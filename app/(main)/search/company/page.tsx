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
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TLocations } from "@/utils/types/location.type";
import { TAvailability } from "@/utils/types/availability.type";
import SearchEmployeeCardSkeleton from "@/components/search/search-company-card/skeleton";
import { debounce } from "lodash";

export default function CompanySearchPage() {
  const { error, loading, employees, querySearchEmployee } =
    useSearchEmployeeStore();
  const user = useGetCurrentUserStore((state) => state.user);

  const [scopeNames, setScopeNames] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { register, setValue, control, handleSubmit, watch } =
    useForm<TCompanySearchSchema>({
      resolver: zodResolver(companySearchSchema),
      defaultValues: {
        keyword: "",
        location: "all",
        jobType: "all",
        experienceLevel: { min: undefined, max: undefined },
        educationLevel: "all",
        sortBy: "firstname",
        orderBy: "desc",
      },
    });

  // Watch form values for debounced submission
  const watchAllFields = watch();

  const onSubmit = useCallback(
    (data: TCompanySearchSchema) => {
      const normalizedJobType =
        data.jobType === "all" ? undefined : data.jobType;
      const normalizedLocation =
        data.location === "all" ? undefined : data.location;
      const normalizedEducation =
        data.educationLevel === "all" ? undefined : data.educationLevel;
      const normalizedExperience =
        data.experienceLevel?.min === undefined &&
        data.experienceLevel?.max === undefined
          ? undefined
          : data.experienceLevel;

      const queryParams = {
        careerScopes: scopeNames,
        keyword: data.keyword,
        location: normalizedLocation as TLocations,
        jobType: normalizedJobType as TAvailability,
        experienceMin: normalizedExperience?.min,
        experienceMax: normalizedExperience?.max,
        education: normalizedEducation,
        sortBy: data.sortBy,
        sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
      };

      querySearchEmployee(queryParams);
      setIsInitialLoad(false);
    },
    [querySearchEmployee, scopeNames]
  );

  // Debounced form submission
  const debouncedSubmit = useMemo(() => debounce(onSubmit, 400), [onSubmit]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      const scopes =
        user?.role === "company"
          ? user?.company?.careerScopes
          : user?.employee?.careerScopes;
      const names = scopes?.map((cs) => cs.name) ?? [];
      setScopeNames(names);

      // Set user's location as default if available
      const userLocation =
        user?.role === "company"
          ? user?.company?.location
          : user?.employee?.location;
      if (userLocation && userLocation !== "all") {
        setValue("location", userLocation);
      }

      // Initial search
      console.log("🎯 Making initial search with career scopes:", names);
      querySearchEmployee({
        careerScopes: names,
        sortBy: "firstname",
        sortOrder: "DESC",
      });
      setIsInitialLoad(false);
    }
  }, [user, querySearchEmployee, setValue]);

  // Trigger search when filters change (debounced)
  useEffect(() => {
    // Don't trigger on initial load
    if (isInitialLoad) return;

    const subscription = watch((value) => {
      debouncedSubmit(value as TCompanySearchSchema);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSubmit, isInitialLoad]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  // Handler for radio group changes
  const handleRadioChange = (
    fieldName: keyof TCompanySearchSchema,
    value: any
  ) => {
    setValue(fieldName, value, { shouldDirty: true });
  };

  return (
    <form
      className="w-full flex flex-col items-start gap-5 px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2>Hire Smarter, Anywhere.</TypographyH2>
          <TypographyH4>Search top talent and connect instantly.</TypographyH4>
          <TypographyH4>
            Search profiles, review resumes, and reach out directly — instantly.
          </TypographyH4>
          <TypographyMuted>
            Your next great hire is just a click away.
          </TypographyMuted>
          <SearchBar
            isEmployee={false}
            register={register}
            setValue={setValue}
            initialLocation={watchAllFields.location as TLocations}
            initialJobType={watchAllFields.jobType as TAvailability}
          />
        </div>
        <Image
          src={CompanySearchSvg}
          alt="company-search"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
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
                      All
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="edu-undergrad"
                      value="Under Graduate"
                      htmlFor="edu-undergrad"
                    >
                      Under Graduate
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="edu-bachelor"
                      value="Bachelor"
                      htmlFor="edu-bachelor"
                    >
                      Bachelor
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="edu-master"
                      value="Master"
                      htmlFor="edu-master"
                    >
                      Master
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="edu-phd"
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
                    ? "0-1"
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
                      console.log("Experience level changed to:", val);
                      let updated;
                      switch (val) {
                        case "0-1":
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

                      handleRadioChange("experienceLevel", updated);
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="exp-all"
                      value="all"
                      htmlFor="exp-all"
                    >
                      All
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-less-1"
                      value="0-1"
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
                      id="exp-3-4"
                      value="3-4"
                      htmlFor="exp-3-4"
                    >
                      3 - 4 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-more-4"
                      value=">4"
                      htmlFor="exp-more-4"
                    >
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
              {loading && employees?.length === 0 ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <span className="text-destructive">0 Employee Found</span>
              ) : employees && employees.length > 0 ? (
                `${employees.length} Employee${
                  employees.length > 1 ? "s" : ""
                } Found`
              ) : !loading && employees?.length === 0 ? (
                "No employees found"
              ) : (
                <Skeleton className="h-6 w-40 bg-muted" />
              )}
            </TypographyH4>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {loading && employees?.length === 0 ? (
              <div className="w-full mb-3">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <SearchEmployeeCardSkeleton key={index} />
                  ))}
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
                  key={item.id || index}
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
                  skills={
                    Array.isArray(item.skills)
                      ? item.skills.map((s) => s.name)
                      : []
                  }
                  education={
                    Array.isArray(item.educations)
                      ? item.educations.map((edu) => edu.degree).join(", ")
                      : ""
                  }
                />
              ))
            ) : !loading && employees?.length === 0 ? (
              <div className="w-full text-center py-10">
                <TypographyP className="text-muted-foreground">
                  No employees match your search criteria. Try adjusting your
                  filters.
                </TypographyP>
              </div>
            ) : (
              <div className="w-full mb-3">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <SearchEmployeeCardSkeleton key={index} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
