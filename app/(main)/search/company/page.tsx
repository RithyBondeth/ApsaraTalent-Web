"use client";

import SearchBar from "@/components/search/search-bar";
import SearchEmployeeCard from "@/components/search/search-employee-card";
import SearchPageHero from "@/components/search/search-page-hero";
import { SearchErrorCard } from "@/components/search/search-error-card";
import { PageState } from "@/components/utils/feedback/page-state";
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
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useSearchEmployeeStore } from "@/stores/apis/employee/search-emp.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useModerationStore } from "@/stores/apis/moderation/moderation.store";
import { SEARCH_DEBOUNCE_MS } from "@/utils/constants/search.constant";
import { yearOfExperienceConstant } from "@/utils/constants/ui.constant";
import { TAvailability } from "@/utils/types/user/availability.type";
import { TLocations } from "@/utils/types/user/location.type";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import {
  LucideBriefcaseBusiness,
  LucideGraduationCap,
  LucideSearchX,
  LucideSlidersHorizontal,
  LucideUsers,
  LucideX,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { companySearchSchema, TCompanySearchSchema } from "./validation";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { SearchEmployeeCardSkeleton } from "@/components/search/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function CompanySearchPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("searchCompany");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Capture whether the URL already had params on the FIRST render (before any
  // router.replace calls update searchParams and re-render this component).
  const hasUrlFiltersRef = useRef(searchParams.toString() !== "");

  // Parse URL params for form initialisation (evaluated once at first render)
  const urlPage = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const urlSortRaw = searchParams.get("sort") ?? "createdAt-desc";
  const [urlSortBy, urlOrderBy] = urlSortRaw.split("-");
  const urlEdu = searchParams.get("edu");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    error,
    loading,
    loadingMore,
    employees,
    total,
    page: storePage,
    querySearchEmployee,
    loadMoreEmployees,
    resetSearch,
    isUsingFallback,
  } = useSearchEmployeeStore();
  const { user } = useGetCurrentUserStore();
  const { currentCompanyLiked, queryCurrentCompanyLiked } =
    useGetCurrentCompanyLikedStore();
  const { blockedUsers, blockedLoaded, getBlockedUsers } = useModerationStore();

  /* -------------------------------- All States ------------------------------ */
  const didInitRef = useRef<boolean>(false);
  // Holds the user's career scope names, written synchronously in the init effect.
  const scopeNamesRef = useRef<string[]>([]);
  // Holds liked employee IDs for server-side exclusion (avoids dep-array churn)
  const likedEmployeeIdsRef = useRef<string[]>([]);
  // Holds blocked employees' profile IDs so they never appear in the feed.
  const blockedEmployeeIdsRef = useRef<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Merge liked + blocked exclusions into the single list the search accepts.
  const buildExcludeEmployeeIds = (): string[] | undefined => {
    const merged = Array.from(
      new Set([
        ...likedEmployeeIdsRef.current,
        ...blockedEmployeeIdsRef.current,
      ]),
    );
    return merged.length > 0 ? merged : undefined;
  };

  /* ----------------------- React Hook Form: Search Form ---------------------- */
  // defaultValues are seeded from the URL so a page refresh / shared link
  // restores the exact filter state that was active when the URL was captured.
  const { register, setValue, getValues, control, handleSubmit, watch } =
    useForm<TCompanySearchSchema>({
      resolver: zodResolver(companySearchSchema),
      defaultValues: {
        keyword: searchParams.get("q") ?? "",
        location: searchParams.get("loc") ?? "all",
        jobType: searchParams.get("type") ?? "all",
        educationLevel: urlEdu ? urlEdu.split(",") : [],
        experienceLevel: searchParams.get("exp") ?? undefined,
        sortBy: urlSortBy ?? "createdAt",
        orderBy: urlOrderBy ?? "desc",
      },
    });

  // Watch Only What SearchBar Needs  (Prevent full page rerender on every key)
  const location = watch("location");
  const jobType = watch("jobType");

  /* --------------------------------- Memos --------------------------------- */
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
  // ── Sync Filter State to URL (immediate, no debounce) ─────────────────────
  // Uses router.replace so each keystroke does NOT push a new history entry —
  // the user's back button still exits the search page cleanly.
  // Note: filter changes always reset to page 1, so no page param is written here.
  const syncToUrl = useCallback(
    (values: TCompanySearchSchema) => {
      const params = new URLSearchParams();
      if (values.keyword) params.set("q", values.keyword);
      if (values.location && values.location !== "all")
        params.set("loc", values.location);
      if (values.jobType && values.jobType !== "all")
        params.set("type", values.jobType);
      const sortStr = `${values.sortBy ?? "createdAt"}-${values.orderBy ?? "desc"}`;
      if (sortStr !== "createdAt-desc") params.set("sort", sortStr);
      if (values.educationLevel && values.educationLevel.length > 0)
        params.set("edu", values.educationLevel.join(","));
      if (values.experienceLevel) params.set("exp", values.experienceLevel);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  // ── Sync page number to URL after load-more ───────────────────────
  const syncPageToUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(window.location.search);
      if (page > 1) {
        params.set("page", String(page));
      } else {
        params.delete("page");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  // ── Real Search Function ─────────────────────────────────────────
  const runSearch = useCallback(
    (data: TCompanySearchSchema, restorePage?: number) => {
      const normalizedJobType =
        data.jobType === "all" ? undefined : data.jobType;
      const normalizedLocation =
        data.location === "all" ? undefined : data.location;
      const normalizedEducation =
        data.educationLevel === undefined || data.educationLevel.length === 0
          ? undefined
          : data.educationLevel;

      querySearchEmployee({
        careerScopes:
          scopeNamesRef.current.length > 0 ? scopeNamesRef.current : undefined,
        // Only send keyword when it satisfies the server's @MinLength(2);
        // a 1-char keyword is treated as no keyword to avoid a 400.
        keyword:
          data.keyword && data.keyword.trim().length >= 2
            ? data.keyword.trim()
            : undefined,
        location: normalizedLocation as TLocations | undefined,
        jobType: normalizedJobType as TAvailability | undefined,
        experienceLevel: data.experienceLevel,
        education: normalizedEducation,
        sortBy: data.sortBy,
        sortOrder: data.orderBy.toUpperCase() as "ASC" | "DESC",
        excludeEmployeeIds: buildExcludeEmployeeIds(),
        restorePage: restorePage && restorePage > 1 ? restorePage : undefined,
      });
    },
    [querySearchEmployee],
  );

  // ── Stable Debounced Function ───────────────────────────────────────
  // runSearch is stable so debouncedRunSearch is also created exactly once per mount.
  const debouncedRunSearch = useMemo(
    () => debounce(runSearch, SEARCH_DEBOUNCE_MS),
    [runSearch],
  );

  // ── Clear All Filters ───────────────────────────────────────────────
  const clearAllFilters = useCallback(() => {
    setValue("keyword", "");
    setValue("location", "all");
    setValue("jobType", "all");
    setValue("educationLevel", []);
    setValue("experienceLevel", undefined);
  }, [setValue]);

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

    if (hasUrlFiltersRef.current) {
      // URL already has filter params (page refresh / shared link) — run the
      // search immediately using the values already seeded into the form.
      // Pass urlPage so we restore all pages loaded before the refresh.
      runSearch(getValues(), urlPage > 1 ? urlPage : undefined);
    } else {
      // No URL params — seed location from the user's profile so the initial
      // results are relevant to where the user is based.
      const userLocation =
        user.role === USER_ROLE.COMPANY
          ? user.company?.location
          : user.employee?.location;

      if (userLocation && userLocation !== "all") {
        // Set the form value BEFORE didInitRef = true so the watch subscription
        // ignores this programmatic change and doesn't fire a second search.
        setValue("location", userLocation);
      }

      querySearchEmployee({
        careerScopes:
          scopeNamesRef.current.length > 0 ? scopeNamesRef.current : undefined,
        location:
          userLocation && userLocation !== "all"
            ? (userLocation as TLocations)
            : undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
        excludeEmployeeIds: buildExcludeEmployeeIds(),
      });
    }

    didInitRef.current = true;
  }, [
    user,
    querySearchEmployee,
    resetSearch,
    setValue,
    runSearch,
    getValues,
    urlPage,
  ]);

  /* 
    Auto-Search on any form change (Debounced)
    watch dep is stable; debouncedRunSearch is now stable too — this effect
    runs exactly once and never re-subscribes, eliminating the spurious
    immediate-fire that caused a second concurrent request.
  */
  useEffect(() => {
    const subscription = watch((value) => {
      if (!didInitRef.current) return;
      debouncedRunSearch(value as TCompanySearchSchema);
      // Sync immediately so URL reflects the filter before the debounce fires
      syncToUrl(value as TCompanySearchSchema);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedRunSearch, syncToUrl]);

  // Cleanup Debounce Timer Effect
  useEffect(() => {
    return () => debouncedRunSearch.cancel();
  }, [debouncedRunSearch]);

  // Fetch liked employees, sync ref, and re-search once data is available
  useEffect(() => {
    if (!user?.company?.id) return;
    if (currentCompanyLiked !== null) {
      const ids = currentCompanyLiked.map((e) => e.id!).filter(Boolean);
      likedEmployeeIdsRef.current = ids;
      // Re-run search if initial search already fired (fixes first-load exclusion)
      if (didInitRef.current) {
        runSearch(getValues());
      }
      return;
    }
    queryCurrentCompanyLiked(user.company.id);
  }, [
    user?.company?.id,
    currentCompanyLiked,
    queryCurrentCompanyLiked,
    runSearch,
    getValues,
  ]);

  // Fetch blocked users, sync ref, and re-search so blocked employees are
  // hidden from the feed (they reappear only after being unblocked).
  useEffect(() => {
    if (!blockedLoaded) {
      getBlockedUsers();
      return;
    }
    blockedEmployeeIdsRef.current = blockedUsers
      .filter((u) => u.role === "employee" && u.employeeId)
      .map((u) => u.employeeId as string);
    if (didInitRef.current) {
      runSearch(getValues());
    }
  }, [blockedLoaded, blockedUsers, getBlockedUsers, runSearch, getValues]);

  const filteredEmployees = employees;

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
      className="search-editorial animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-6 px-3 sm:px-4 lg:px-5"
      onSubmit={handleSubmit((data) => runSearch(data))}
    >
      {/* Responsive Search Hero Section */}
      <SearchPageHero
        eyebrow={t("bannerEyebrow")}
        title={t("bannerTitle")}
        subtitle={t("bannerSubtitle1")}
        supportingText={t("bannerSubtitle2")}
        stats={
          loading
            ? undefined
            : [{ icon: LucideUsers, label: t("statTalent"), value: total }]
        }
      >
        <SearchBar
          isEmployee={false}
          register={register}
          setValue={setValue}
          initialLocation={location as TLocations}
          initialJobType={jobType as TAvailability}
        />
      </SearchPageHero>

      {/* Mobile/Tablet Filter Toggle Section */}
      <div className="hidden w-full tablet-xl:flex">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-between rounded-none border-border"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <LucideSlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-none bg-foreground text-[9px] font-bold leading-none text-background">
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

      <div className="flex w-full items-start gap-5 tablet-xl:flex-col">
        {/* Left Side: Filters Section */}
        <div
          className={`search-filter-panel flex w-72 shrink-0 flex-col self-start rounded-none border border-border bg-card shadow-hard tablet-xl:w-full xl:w-80 ${
            mobileFiltersOpen ? "tablet-xl:flex" : "tablet-xl:hidden"
          }`}
        >
          {/* Header Section */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-5">
            <TypographyH4 className="font-semibold">
              {t("refineResult")}
            </TypographyH4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 rounded-none px-2 text-xs"
            >
              {t("clearFilters")}
            </Button>
          </div>

          {/* Filter Body Section */}
          <div className="flex flex-col gap-5 p-4 sm:p-5">
            {/* Filter Panel Skeleton Section */}
            {employees === null ? (
              <div className="flex w-full flex-col gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-32 rounded-none" />
                    <Skeleton className="ml-3 h-3 w-24 rounded-none" />
                    <Skeleton className="ml-3 h-3 w-28 rounded-none" />
                    <Skeleton className="ml-3 h-3 w-20 rounded-none" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Education Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="flex items-center gap-1 text-sm font-bold">
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
                                className="rounded-none"
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
                                className="cursor-pointer text-sm font-medium leading-none"
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
                  <TypographyP className="flex items-center gap-1 text-sm font-medium">
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
                          className="ml-1.5 flex flex-col gap-3 sm:ml-3 [&>div>button]:rounded-none"
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
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 tablet-xl:w-full">
          {/* Results Header Section */}
          <div className="flex w-full flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-fit shrink-0 flex-col gap-1">
              <TypographyH4 className="whitespace-nowrap text-lg">
                {loading || filteredEmployees === null ? (
                  <Skeleton className="h-6 w-40 rounded-none bg-muted" />
                ) : error ? (
                  <TypographySmall className="text-destructive">
                    {t("zeroEmployeesFound")}
                  </TypographySmall>
                ) : filteredEmployees.length > 0 ? (
                  t("employeesFound", { count: total })
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
                        <SelectTrigger
                          aria-label={t("sortBy")}
                          className="h-10 w-full rounded-none text-sm sm:w-[220px]"
                        >
                          <SelectValue placeholder={t("sortBy")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border shadow-hard [&_[role=option]]:rounded-none">
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
          <div className="flex w-full flex-col items-start gap-3">
            {error && !loading ? (
              <div className="w-full">
                <SearchErrorCard
                  title={error}
                  description={t("errorDescription")}
                  retryLabel={t("retry")}
                  onRetry={() => runSearch(getValues())}
                />
              </div>
            ) : loading || filteredEmployees === null ? (
              /* Loading State Section */
              <div className="mb-3 flex w-full flex-col gap-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <SearchEmployeeCardSkeleton key={i} />
                  ))}
              </div>
            ) : filteredEmployees.length > 0 ? (
              /* Employee Search Card Section */
              <>
                {filteredEmployees.map((item) => (
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
                ))}
                {employees && employees.length < total && (
                  <div className="flex w-full justify-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loadingMore}
                      onClick={async () => {
                        await loadMoreEmployees({
                          careerScopes:
                            scopeNamesRef.current.length > 0
                              ? scopeNamesRef.current
                              : undefined,
                          keyword:
                            getValues("keyword") &&
                            getValues("keyword")!.trim().length >= 2
                              ? getValues("keyword")!.trim()
                              : undefined,
                          location:
                            getValues("location") === "all"
                              ? undefined
                              : (getValues("location") as TLocations),
                          jobType:
                            getValues("jobType") === "all"
                              ? undefined
                              : (getValues("jobType") as TAvailability),
                          experienceLevel: getValues("experienceLevel"),
                          education: getValues("educationLevel")?.length
                            ? getValues("educationLevel")
                            : undefined,
                          sortBy: getValues("sortBy"),
                          sortOrder: getValues("orderBy")?.toUpperCase() as
                            "ASC" | "DESC",
                          excludeEmployeeIds: buildExcludeEmployeeIds(),
                        });
                        syncPageToUrl(storePage + 1);
                      }}
                      className="h-10 rounded-none px-6 text-sm"
                    >
                      {loadingMore ? t("loading") : t("loadMore")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty List Section */
              <PageState
                variant="empty"
                title={t("emptyList")}
                description={t("emptyListDescription")}
                icon={LucideSearchX}
                compact
                action={
                  activeFilterCount > 0
                    ? { label: t("clearFilters"), onClick: clearAllFilters }
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
