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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { emptySvg } from "@/utils/constants/asset.constant";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useSearchEmployeeStore } from "@/stores/apis/employee/search-emp.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { SEARCH_DEBOUNCE_MS } from "@/utils/constants/search.constant";
import { yearOfExperienceConstant } from "@/utils/constants/ui.constant";
import { TAvailability } from "@/utils/types/user/availability.type";
import { TLocations } from "@/utils/types/user/location.type";
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
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { companySearchSchema, TCompanySearchSchema } from "./validation";
import { companySearchBannerSvg } from "@/utils/constants/asset.constant";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { SearchEmployeeCardSkeleton } from "@/components/search/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function CompanySearchPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("searchCompany");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    error,
    loading,
    employees,
    querySearchEmployee,
    resetSearch,
    isUsingFallback,
  } = useSearchEmployeeStore();
  const { user } = useGetCurrentUserStore();
  const { currentCompanyLiked, queryCurrentCompanyLiked } =
    useGetCurrentCompanyLikedStore();

  /* -------------------------------- All States ------------------------------ */
  const didInitRef = useRef<boolean>(false);
  // Holds the user's career scope names, written synchronously in the init effect.
  const scopeNamesRef = useRef<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  /* ----------------------- React Hook Form: Search Form ---------------------- */
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

  // Active filter count for the mobile filter badge
  const allValues = watch();
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (allValues.keyword) count++;
    if (allValues.location && allValues.location !== "all") count++;
    if (allValues.jobType && allValues.jobType !== "all") count++;
    if (allValues.educationLevel && allValues.educationLevel.length > 0)
      count++;
    if (allValues.experienceLevel !== undefined) count++;
    return count;
  }, [allValues]);

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

      querySearchEmployee(
        {
          careerScopes:
            scopeNamesRef.current.length > 0
              ? scopeNamesRef.current
              : undefined,
          keyword: data.keyword || undefined,
          location: normalizedLocation as TLocations | undefined,
          jobType: normalizedJobType as TAvailability | undefined,
          experienceLevel: data.experienceLevel,
          education: normalizedEducation,
          sortBy: data.sortBy,
          sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
        },
        { scopeFallback: true },
      );
    },
    [querySearchEmployee],
  );

  // ── Stable Debounced Function ───────────────────────────────────────
  // runSearch is stable so debouncedRunSearch is also created exactly once per mount.
  const debouncedRunSearch = useMemo(
    () => debounce(runSearch, SEARCH_DEBOUNCE_MS),
    [runSearch],
  );

  /* --------------------------------- Effects --------------------------------- */
  // Initial Search Effect (Once per mount / Per user ready)
  useEffect(() => {
    if (!user) return;
    if (didInitRef.current) return;

    // Clear any stale results left from a previous visit before firing a
    // fresh search — prevents old data flashing on re-navigation.
    resetSearch();

    const scopes =
      user.role === USER_ROLE.COMPANY
        ? user.company?.careerScopes
        : user.employee?.careerScopes;

    scopeNamesRef.current = scopes?.map((cs) => cs.name) ?? [];

    const userLocation =
      user.role === USER_ROLE.COMPANY
        ? user.company?.location
        : user.employee?.location;

    if (userLocation && userLocation !== "all") {
      setValue("location", userLocation);
    }

    querySearchEmployee(
      {
        careerScopes:
          scopeNamesRef.current.length > 0 ? scopeNamesRef.current : undefined,
        location:
          userLocation && userLocation !== "all"
            ? (userLocation as TLocations)
            : undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
      },
      { scopeFallback: true },
    );

    didInitRef.current = true;
  }, [user, querySearchEmployee, resetSearch, setValue]);

  // Auto-Search on any form change (Debounced)
  // watch dep is stable; debouncedRunSearch is now stable too — this effect
  // runs exactly once and never re-subscribes, eliminating the spurious
  // immediate-fire that caused a second concurrent request.
  useEffect(() => {
    const subscription = watch((value) => {
      if (!didInitRef.current) return;
      debouncedRunSearch(value as TCompanySearchSchema);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedRunSearch]);

  // Cleanup Debounce Timer Effect
  useEffect(() => {
    return () => debouncedRunSearch.cancel();
  }, [debouncedRunSearch]);

  // Fetch Liked Employees (So We Can Filter Them Out of Results)
  useEffect(() => {
    if (!user?.company?.id) return;
    if (currentCompanyLiked !== null) return;
    queryCurrentCompanyLiked(user.company.id);
  }, [user?.company?.id, currentCompanyLiked, queryCurrentCompanyLiked]);

  // Filter Out Employees The Company Has Already Liked
  const filteredEmployees = useMemo(() => {
    if (!employees) return null;
    if (!currentCompanyLiked || currentCompanyLiked.length === 0)
      return employees;
    const likedEmployeeIds = new Set(currentCompanyLiked.map((e) => e.id));
    return employees.filter((emp) => !likedEmployeeIds.has(emp.id));
  }, [employees, currentCompanyLiked]);

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
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="w-full flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {t("bannerTitle")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle1")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle2")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {t("bannerMuted")}
          </TypographyMuted>
          <SearchBar
            isEmployee={false}
            register={register}
            setValue={setValue}
            initialLocation={location as TLocations}
            initialJobType={jobType as TAvailability}
          />
        </div>
        <Image
          src={companySearchBannerSvg}
          alt="company-search"
          height={300}
          width={400}
          className="h-auto max-w-[340px] shrink-0"
          priority
        />
      </div>

      {/* Tablet Banner Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5">
        <div className="flex flex-col gap-2">
          <TypographyH3 className="!leading-snug">
            {t("bannerTitle")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle1")}
          </TypographyMuted>
        </div>
        <SearchBar
          isEmployee={false}
          register={register}
          setValue={setValue}
          initialLocation={location as TLocations}
          initialJobType={jobType as TAvailability}
        />
      </div>

      {/* Mobile Banner Section ≤650px */}
      <div className="hidden tablet-md:flex w-full flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-4">
        <p className="font-bold text-sm leading-snug text-foreground">
          {t("bannerTitle")}
        </p>
        <SearchBar
          isEmployee={false}
          register={register}
          setValue={setValue}
          initialLocation={location as TLocations}
          initialJobType={jobType as TAvailability}
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
            <div className="relative">
              <LucideSlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                  {activeFilterCount > 9 ? "9+" : activeFilterCount}
                </span>
              )}
            </div>
            <TypographySmall>{t("refineResults")}</TypographySmall>
          </div>
          {mobileFiltersOpen ? (
            <LucideX className="h-4 w-4" />
          ) : (
            <TypographySmall className="text-xs text-muted-foreground">
              {t("open")}
            </TypographySmall>
          )}
        </Button>
      </div>

      <div className="w-full flex items-start gap-6 tablet-xl:flex-col">
        {/* Left Side: Filters Section */}
        <div
          className={`w-72 xl:w-80 shrink-0 sticky top-5 self-start flex flex-col bg-card rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] tablet-xl:w-full tablet-xl:static ${
            mobileFiltersOpen ? "tablet-xl:flex" : "tablet-xl:hidden"
          }`}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
            <TypographyH4 className="font-semibold">
              {t("refineResult")}
            </TypographyH4>
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
              {t("clearFilters")}
            </Button>
          </div>

          {/* Filter Body Section */}
          <div className="flex flex-col gap-5 p-5">
            {/* Filter Panel Skeleton Section */}
            {employees === null ? (
              <div className="w-full flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded ml-3" />
                    <Skeleton className="h-3 w-28 rounded ml-3" />
                    <Skeleton className="h-3 w-20 rounded ml-3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Education Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideGraduationCap strokeWidth={"1.5px"} />
                    {t("educationLevel")}
                  </TypographyP>

                  <Controller
                    name="educationLevel"
                    control={control}
                    render={({ field }) => {
                      const selected = field.value || [];
                      const options = [
                        {
                          id: "edu-undergrad",
                          label: t("underGraduate"),
                          value: "Under Graduate",
                        },
                        {
                          id: "edu-bachelor",
                          label: t("bachelor"),
                          value: "Bachelor",
                        },
                        {
                          id: "edu-master",
                          label: t("master"),
                          value: "Master",
                        },
                        { id: "edu-phd", label: t("phd"), value: "PhD" },
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

                <Separator />

                {/* Experience Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
                    {t("experienceLevel")}
                  </TypographyP>

                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => {
                      const expLabels: Record<string, string> = {
                        "No Experience": t("expNoExperience"),
                        "Less than 1 year": t("expLessThan1Year"),
                        "1 - 2 years": t("exp1To2Years"),
                        "3 - 5 years": t("exp3To5Years"),
                        "6 - 10 years": t("exp6To10Years"),
                        "10+ years": t("exp10PlusYears"),
                      };
                      return (
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
                              {expLabels[option.value] ?? option.label}
                            </RadioGroupItemWithLabel>
                          ))}
                        </RadioGroup>
                      );
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Results Section */}
        <div className="flex-1 min-w-0 tablet-xl:w-full flex flex-col items-start gap-3">
          {/* Results Header Section */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-col gap-1">
              <TypographyH4 className="text-lg">
                {loading || filteredEmployees === null ? (
                  <Skeleton className="h-6 w-40 bg-muted" />
                ) : error ? (
                  <TypographySmall className="text-destructive">
                    {t("zeroEmployeesFound")}
                  </TypographySmall>
                ) : filteredEmployees.length > 0 ? (
                  t("employeesFound", { count: filteredEmployees.length })
                ) : (
                  t("noEmployeesFound")
                )}
              </TypographyH4>
              {!loading &&
                isUsingFallback &&
                filteredEmployees &&
                filteredEmployees.length > 0 && (
                  <TypographyMuted className="text-xs">
                    {t("fallbackResults")}
                  </TypographyMuted>
                )}
            </div>

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
                          <SelectValue placeholder={t("sortBy")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt-desc">
                            {t("newestFirst")}
                          </SelectItem>
                          <SelectItem value="createdAt-asc">
                            {t("oldestFirst")}
                          </SelectItem>
                          <SelectItem value="yearsOfExperience-desc">
                            {t("experienceHighToLow")}
                          </SelectItem>
                          <SelectItem value="yearsOfExperience-asc">
                            {t("experienceLowToHigh")}
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
            {error && !loading ? (
              <div className="w-full">
                <SearchErrorCard
                  title={error}
                  description={t("errorDescription")}
                />
              </div>
            ) : loading || filteredEmployees === null ? (
              /* Loading State Section */
              <div className="w-full flex flex-col gap-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <SearchEmployeeCardSkeleton key={i} />
                  ))}
              </div>
            ) : filteredEmployees.length > 0 ? (
              /* Employee Search Card Section */
              filteredEmployees.map((item) => (
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
              <div className="w-full flex flex-col items-center justify-center py-10 gap-3">
                <Image
                  src={emptySvg}
                  alt="empty"
                  height={160}
                  width={160}
                  className="animate-float"
                />
                <TypographyP className="text-muted-foreground">
                  {t("emptyList")}
                </TypographyP>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("keyword", "");
                      setValue("location", "all");
                      setValue("jobType", "all");
                      setValue("educationLevel", []);
                      setValue("experienceLevel", undefined);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
                  >
                    {t("clearFilters")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
