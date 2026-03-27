"use client";

import SearchBar from "@/components/search/search-bar";
import SearchCompanyCard from "@/components/search/search-company-card";
import SearchEmployeeCardSkeleton from "@/components/search/search-company-card/skeleton";
import { SearchErrorCard } from "@/components/search/search-error-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useSearchJobStore } from "@/stores/apis/job/search-job.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { SEARCH_DEBOUNCE_MS } from "@/utils/constants/search.constant";
import { yearOfExperienceConstant } from "@/utils/constants/ui.constant";
import { TAvailability } from "@/utils/types/availability.type";
import { TLocations } from "@/utils/types/location.type";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import {
  LucideBriefcaseBusiness,
  LucideCalendarDays,
  LucideCircleDollarSign,
  LucideGraduationCap,
  LucideSlidersHorizontal,
  LucideUsers,
  LucideX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { employeeSearchSchema, TEmployeeSearchSchema } from "./validation";
import { EmployeeSearchSvg } from "@/utils/constants/asset.constant";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function EmployeeSearchPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const isFirstWatchRenderRef = useRef<boolean>(true);
  const isInitialSearchDoneRef = useRef<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  const { error, loading, jobs, querySearchJobs } = useSearchJobStore();
  const { user } = useGetCurrentUserStore();

  /* -------------------------------- All States ------------------------------ */
  // Employee Search for Company Helper
  const [scopeNames, setScopeNames] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  /* ------------------------------- Search Form ------------------------------ */
  // React Hook Form: Employee Search Form
  const { register, control, setValue, handleSubmit, watch } =
    useForm<TEmployeeSearchSchema>({
      resolver: zodResolver(employeeSearchSchema),
      defaultValues: {
        keyword: "",
        location: "all",
        jobType: "all",
        companySize: {},
        date: {},
        salaryRange: {},
        educationLevel: [],
        experienceLevel: undefined,
        sortBy: "createdAt",
        orderBy: "desc",
      },
    });

  // Watch Only What SearchBar Needs (prevents full page rerender on every key)
  const location = watch("location");
  const jobType = watch("jobType");

  /* --------------------------------- Methods --------------------------------- */
  // ── Real Search Function ────────────────────────────────────────
  const runSearch = useCallback(
    (data: TEmployeeSearchSchema) => {
      querySearchJobs({
        careerScopes: scopeNames,
        keyword: data.keyword || undefined,
        location: data.location === "all" ? undefined : data.location,
        jobType: data.jobType === "all" ? undefined : data.jobType,
        companySizeMin: data.companySize?.min,
        companySizeMax: data.companySize?.max,
        postedDateFrom: data.date?.from?.toISOString(),
        postedDateTo: data.date?.to?.toISOString(),
        salaryMin: data.salaryRange?.min,
        salaryMax: data.salaryRange?.max,
        educationRequired:
          data.educationLevel === undefined || data.educationLevel.length === 0
            ? undefined
            : data.educationLevel,
        experienceLevel: data.experienceLevel,
        sortBy: data.sortBy,
        sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
      });
    },
    [querySearchJobs, scopeNames],
  );

  // ── Stable Debounced Function ─────────────────────────────────────
  const debouncedRunSearch = useMemo(
    () => debounce(runSearch, SEARCH_DEBOUNCE_MS),
    [runSearch],
  );

  /* --------------------------------- Effects --------------------------------- */
  // Initial Search Effect (Once per mount / Per user ready)
  useEffect(() => {
    if (!user) return;
    if (isInitialSearchDoneRef.current) return;

    const scopes =
      user.role === "company"
        ? user.company?.careerScopes
        : user.employee?.careerScopes;

    const names = scopes?.map((cs) => cs.name) ?? [];
    setScopeNames(names);

    querySearchJobs({
      careerScopes: names,
      sortBy: "title",
      sortOrder: "DESC",
    });

    isInitialSearchDoneRef.current = true;
  }, [user, querySearchJobs]);

  // Auto Search As User Types / Changes filters Effect
  useEffect(() => {
    // Skip first render so it doesn’t duplicate initial search
    if (isFirstWatchRenderRef.current) {
      isFirstWatchRenderRef.current = false;
      return;
    }

    const subscription = watch((value) => {
      // Only run after scopes are ready (prevents empty search when page first loads)
      if (!isInitialSearchDoneRef.current) return;
      debouncedRunSearch(value as TEmployeeSearchSchema);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedRunSearch]);

  // Cleanup Debounce Timer Effect
  useEffect(() => {
    return () => debouncedRunSearch.cancel();
  }, [debouncedRunSearch]);

  /* ----------------------------- Event Handlers ---------------------------- */
  // ── Handle Radio Change ─────────────────────────────────────────
  const handleRadioChange = (
    fieldName: keyof TEmployeeSearchSchema,
    value: TEmployeeSearchSchema[keyof TEmployeeSearchSchema],
  ) => {
    setValue(fieldName, value, { shouldDirty: true });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <form
      className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8 animate-page-in"
      onSubmit={handleSubmit(runSearch)}
    >
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 laptop-sm:flex-col laptop-sm:items-center">
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

          {/* Search Bar Section */}
          <SearchBar
            isEmployee={true}
            register={register}
            setValue={setValue}
            initialLocation={location as TLocations}
            initialJobType={jobType as TAvailability}
          />
        </div>

        {/* Employee Seach Banner Section */}
        <Image
          src={EmployeeSearchSvg}
          alt="employee-search"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>

      {/* Mobile/Tablet Filter Toggle Section */}
      <div className="hidden w-full tablet-xl:flex">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <LucideSlidersHorizontal className="h-4 w-4" />
            <TypographySmall>Refine Results</TypographySmall>
          </div>
          {mobileFiltersOpen ? (
            <LucideX className="h-4 w-4" />
          ) : (
            <TypographySmall>Open</TypographySmall>
          )}
        </Button>
      </div>

      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        {/* Left Side: Filter Section */}
        <div
          className={`w-1/4 flex flex-col items-start gap-6 p-4 sm:p-5 shadow-md rounded-md tablet-xl:w-full ${
            mobileFiltersOpen ? "tablet-xl:flex" : "tablet-xl:hidden"
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <TypographyH4 className="text-lg">Refine Result</TypographyH4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setValue("keyword", "");
                setValue("location", "all");
                setValue("jobType", "all");
                setValue("date", {});
                setValue("companySize", { min: undefined, max: undefined });
                setValue("salaryRange", { min: undefined, max: undefined });
                setValue("educationLevel", []);
                setValue("experienceLevel", undefined);
              }}
              className="text-xs h-8 px-2"
            >
              Clear Filters
            </Button>
          </div>

          {/* Date Posted Section */}
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

                let selectedValue: string = "all";
                if (!from && !to) selectedValue = "all";
                else if (from && to) {
                  const diffHours = (to.getTime() - from.getTime()) / 36e5;
                  // NOTE: your original code used 2 hours for "last 24 hours"
                  if (diffHours <= 24) selectedValue = "last 24 hours";
                  else if (diffHours <= 72) selectedValue = "last 3 days";
                  else if (diffHours <= 168) selectedValue = "last week";
                }

                return (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={(val) => {
                      let updated: { from?: Date; to?: Date } = {};
                      if (val !== "all") {
                        const now = new Date();
                        const fromDate = new Date(now);

                        switch (val) {
                          case "last 24 hours":
                            fromDate.setHours(now.getHours() - 24);
                            break;
                          case "last 3 days":
                            fromDate.setDate(now.getDate() - 3);
                            break;
                          case "last week":
                            fromDate.setDate(now.getDate() - 7);
                            break;
                        }

                        updated = { from: fromDate, to: new Date() };
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

          {/* Company Size Section */}
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
                return (
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={min ?? ""}
                      min={0}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val ? parseInt(val) : undefined;
                        handleRadioChange("companySize", {
                          min: numVal,
                          max,
                        });
                      }}
                      className="h-9 w-[88px] shrink-0"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={max ?? ""}
                      min={0}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val ? parseInt(val) : undefined;
                        handleRadioChange("companySize", {
                          min,
                          max: numVal,
                        });
                      }}
                      className="h-9 w-[88px] shrink-0"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Employees
                    </span>
                  </div>
                );
              }}
            />
          </div>

          {/* Salary Range Section */}
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
                return (
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={min ?? ""}
                      min={0}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val ? parseInt(val) : undefined;
                        handleRadioChange("salaryRange", {
                          min: numVal,
                          max,
                        });
                      }}
                      className="h-9 w-[88px] shrink-0"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={max ?? ""}
                      min={0}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val ? parseInt(val) : undefined;
                        handleRadioChange("salaryRange", {
                          min,
                          max: numVal,
                        });
                      }}
                      className="h-9 w-[88px] shrink-0"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      $
                    </span>
                  </div>
                );
              }}
            />
          </div>

          {/* Education Level Section */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideGraduationCap strokeWidth={"1.5px"} />
              Education Level
            </TypographyP>

            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => {
                const educations = [
                  "Under Graduate",
                  "Bachelor",
                  "Master",
                  "PhD",
                ];
                const selectedEdu = field.value ?? [];

                return (
                  <div className="ml-1.5 flex flex-col gap-3 sm:ml-3">
                    {educations.map((edu) => (
                      <div key={edu} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edu-${edu}`}
                          checked={selectedEdu.includes(edu)}
                          onCheckedChange={(checked) => {
                            let updated = [...selectedEdu];
                            if (checked) {
                              updated.push(edu);
                            } else {
                              updated = updated.filter((item) => item !== edu);
                            }
                            handleRadioChange("educationLevel", updated);
                          }}
                        />
                        <label
                          htmlFor={`edu-${edu}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {edu}
                        </label>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>

          {/* Experience Level Section */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
              Experience Level
            </TypographyP>

            <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) =>
                    handleRadioChange("experienceLevel", value)
                  }
                  value={field.value ?? ""}
                  className="ml-1.5 flex flex-col gap-3 sm:ml-3"
                >
                  {yearOfExperienceConstant.map((option) => (
                    <RadioGroupItemWithLabel
                      key={option.id}
                      value={option.value}
                      id={`exp-${option.id}`}
                      htmlFor={`exp-${option.id}`}
                    >
                      {option.label}
                    </RadioGroupItemWithLabel>
                  ))}
                </RadioGroup>
              )}
            />
          </div>
        </div>

        {/* Right Side: Results Section */}
        <div className="w-3/4 flex flex-col items-start gap-3 tablet-xl:w-full">
          {/* Results Header Section */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
            <TypographyH4 className="text-lg">
              {loading ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <TypographySmall className="text-destructive">
                  0 Job is listing
                </TypographySmall>
              ) : jobs && jobs.length > 0 ? (
                `${jobs.length} Job${jobs.length === 1 ? "" : "s"} listed`
              ) : (
                "No jobs found"
              )}
            </TypographyH4>

            <Controller
              name="sortBy"
              control={control}
              render={({ field: sortByField }) => (
                <Controller
                  name="orderBy"
                  control={control}
                  render={({ field: orderByField }) => {
                    const sortValue = `${sortByField.value}-${orderByField.value}`;

                    return (
                      <Select
                        value={sortValue}
                        onValueChange={(val) => {
                          const [newSortBy, newOrderBy] = val.split("-");
                          setValue("sortBy", newSortBy, { shouldDirty: true });
                          setValue("orderBy", newOrderBy, {
                            shouldDirty: true,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt-desc">
                            Newest First
                          </SelectItem>
                          <SelectItem value="createdAt-asc">
                            Oldest First
                          </SelectItem>
                          <SelectItem value="companySize-desc">
                            Company Size: High to Low
                          </SelectItem>
                          <SelectItem value="companySize-asc">
                            Company Size: Low to High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              )}
            />
          </div>

          {/* Results List Section */}
          <div className="w-full flex flex-col items-start gap-2">
            {loading ? (
              /* Loading Skeleton Section */
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
            ) : jobs && jobs.length > 0 ? (
              /* Search Company Card Section */
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
              /* Empty List Section */
              <div className="w-full text-center py-10">
                <TypographyP className="text-muted-foreground">
                  No jobs match your search criteria. Try adjusting your
                  filters.
                </TypographyP>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
