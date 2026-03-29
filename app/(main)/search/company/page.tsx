"use client";

import SearchBar from "@/components/search/search-bar";
import SearchEmployeeCard from "@/components/search/search-employee-card";
import { SearchErrorCard } from "@/components/search/search-error-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSearchEmployeeStore } from "@/stores/apis/employee/search-emp.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { SEARCH_DEBOUNCE_MS } from "@/utils/constants/search.constant";
import { yearOfExperienceConstant } from "@/utils/constants/ui.constant";
import { TAvailability } from "@/utils/types/availability.type";
import { TLocations } from "@/utils/types/location.type";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import {
  LucideBriefcaseBusiness,
  LucideGraduationCap,
  LucideSlidersHorizontal,
  LucideX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { companySearchSchema, TCompanySearchSchema } from "./validation";
import { CompanySearchSvg } from "@/utils/constants/asset.constant";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { SearchEmployeeCardSkeleton } from "@/components/search/skeleton";

export default function CompanySearchPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const didInitRef = useRef<boolean>(false);
  const skipFirstWatchRef = useRef<boolean>(true);

  /* ----------------------------- API Integration ---------------------------- */
  const { error, loading, employees, querySearchEmployee } =
    useSearchEmployeeStore();
  const { user } = useGetCurrentUserStore();

  /* -------------------------------- All States ------------------------------ */
  // Company Search For Employee Helper
  const [scopeNames, setScopeNames] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  /* ------------------------------- Search Form ------------------------------ */
  // React Hook Form: Company Search Form
  const { register, setValue, control, handleSubmit, watch } =
    useForm<TCompanySearchSchema>({
      resolver: zodResolver(companySearchSchema),
      defaultValues: {
        keyword: "",
        location: "all",
        jobType: "all",
        experienceLevel: undefined,
        educationLevel: [],
        sortBy: "createdAt",
        orderBy: "desc",
      },
    });

  // Watch Only What SearchBar Needs  (Prevent full page rerender on every key)
  const location = watch("location");
  const jobType = watch("jobType");

  /* --------------------------------- Methods --------------------------------- */
  // ── Real Search Function ─────────────────────────────────────────
  const runSearch = useCallback(
    (data: TCompanySearchSchema) => {
      const normalizedJobType =
        data.jobType === "all" ? undefined : data.jobType;
      const normalizedLocation =
        data.location === "all" ? undefined : data.location;
      const normalizedEducation =
        data.educationLevel === undefined || data.educationLevel.length === 0
          ? undefined
          : data.educationLevel;

      querySearchEmployee({
        careerScopes: scopeNames,
        keyword: data.keyword || undefined,
        location: normalizedLocation as TLocations | undefined,
        jobType: normalizedJobType as TAvailability | undefined,
        experienceLevel: data.experienceLevel,
        education: normalizedEducation,
        sortBy: data.sortBy,
        sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
      });
    },
    [querySearchEmployee, scopeNames],
  );

  // ── Stable Debounced Function ───────────────────────────────────────
  const debouncedRunSearch = useMemo(
    () => debounce(runSearch, SEARCH_DEBOUNCE_MS),
    [runSearch],
  );

  /* --------------------------------- Effects --------------------------------- */
  // Initial Search Effect (Once per mount / Per user ready)
  useEffect(() => {
    if (!user) return;
    if (didInitRef.current) return;

    const scopes =
      user.role === "company"
        ? user.company?.careerScopes
        : user.employee?.careerScopes;

    const names = scopes?.map((cs) => cs.name) ?? [];
    setScopeNames(names);

    const userLocation =
      user.role === "company"
        ? user.company?.location
        : user.employee?.location;

    if (userLocation && userLocation !== "all") {
      setValue("location", userLocation);
    }

    querySearchEmployee({
      careerScopes: names,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

    didInitRef.current = true;
  }, [user, querySearchEmployee, setValue]);

  // Auto-Search on any form change (Debounced)
  useEffect(() => {
    const subscription = watch((value) => {
      if (!didInitRef.current) return;

      // Skip first watch event (happens when form initializes / setValue runs)
      if (skipFirstWatchRef.current) {
        skipFirstWatchRef.current = false;
        return;
      }

      debouncedRunSearch(value as TCompanySearchSchema);
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
    fieldName: keyof TCompanySearchSchema,
    value: TCompanySearchSchema[keyof TCompanySearchSchema],
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
          <TypographyH2>Hire Smarter, Anywhere.</TypographyH2>
          <TypographyH4>Search top talent and connect instantly.</TypographyH4>
          <TypographyH4>
            Search profiles, review resumes, and reach out directly — instantly.
          </TypographyH4>
          <TypographyMuted>
            Your next great hire is just a click away.
          </TypographyMuted>

          {/* Search Bar Section */}
          <SearchBar
            isEmployee={false}
            register={register}
            setValue={setValue}
            initialLocation={location as TLocations}
            initialJobType={jobType as TAvailability}
          />
        </div>

        {/* Company Search Banner Section */}
        <Image
          src={CompanySearchSvg}
          alt="company-search"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>

      {/* Mobile/Tablet Filter Toogle Section */}
      <div className="hidden w-full tablet-xl:flex">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <TypographySmall className="flex items-center gap-2 text-sm">
            <LucideSlidersHorizontal className="h-4 w-4" />
            Refine Results
          </TypographySmall>
          {mobileFiltersOpen ? (
            <LucideX className="h-4 w-4" />
          ) : (
            <TypographySmall className="text-xs text-muted-foreground">
              Open
            </TypographySmall>
          )}
        </Button>
      </div>

      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        {/* Left Side: Filters Section */}
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
                setValue("educationLevel", []);
                setValue("experienceLevel", undefined);
              }}
              className="text-xs h-8 px-2"
            >
              Clear Filters
            </Button>
          </div>

          {/* Education Section */}
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideGraduationCap strokeWidth={"1.5px"} />
              Education Level
            </TypographyP>

            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => {
                const selected = field.value || [];
                const options = [
                  {
                    id: "edu-undergrad",
                    label: "Under Graduate",
                    value: "Under Graduate",
                  },
                  { id: "edu-bachelor", label: "Bachelor", value: "Bachelor" },
                  { id: "edu-master", label: "Master", value: "Master" },
                  { id: "edu-phd", label: "PhD", value: "PHD" },
                ];

                return (
                  <div className="ml-1.5 flex flex-col gap-3 sm:ml-3">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.id}
                          checked={selected.includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleRadioChange("educationLevel", [
                                ...selected,
                                option.value,
                              ]);
                            } else {
                              handleRadioChange(
                                "educationLevel",
                                selected.filter(
                                  (v: string) => v !== option.value,
                                ),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>

          {/* Experience Section */}
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
                  0 Employee Found
                </TypographySmall>
              ) : employees && employees.length > 0 ? (
                `${employees.length} Employee${employees.length > 1 ? "s" : ""} Found`
              ) : (
                "No employees found"
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
                          <SelectItem value="yearsOfExperience-desc">
                            Experience: High to Low
                          </SelectItem>
                          <SelectItem value="yearsOfExperience-asc">
                            Experience: Low to High
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
              /* Loading State Section */
              <div className="w-full mb-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <SearchEmployeeCardSkeleton key={i} />
                  ))}
              </div>
            ) : error ? (
              /* Error State Section */
              <div className="w-full mb-3">
                <SearchErrorCard
                  title={error}
                  description="Try adjusting your filters or search terms and try again."
                />
              </div>
            ) : employees && employees.length > 0 ? (
              /* Employee Search Card Section */
              employees.map((item) => (
                <SearchEmployeeCard
                  key={item.id}
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
            ) : (
              /* Empty List Section */
              <div className="w-full text-center py-10">
                <TypographyP className="text-muted-foreground">
                  No employees match your search criteria. Try adjusting your
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
