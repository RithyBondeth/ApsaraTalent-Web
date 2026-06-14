"use client";

import SearchBar from "@/components/search/search-bar";
import SearchCompanyCard from "@/components/search/search-company-card";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { emptySvg } from "@/utils/constants/asset.constant";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useSearchJobStore } from "@/stores/apis/job/search-job.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
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
  LucideCalendarDays,
  LucideCircleDollarSign,
  LucideGraduationCap,
  LucideSlidersHorizontal,
  LucideUsers,
  LucideX,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { employeeSearchSchema, TEmployeeSearchSchema } from "./validation";
import { employeeSearchBannerSvg } from "@/utils/constants/asset.constant";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { SearchCompanyCardSkeleton } from "@/components/search/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function EmployeeSearchPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("searchEmployee");
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
  const urlCmin = searchParams.get("cmin");
  const urlCmax = searchParams.get("cmax");
  const urlSmin = searchParams.get("smin");
  const urlSmax = searchParams.get("smax");
  const urlDfrom = searchParams.get("dfrom");
  const urlDto = searchParams.get("dto");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    error,
    loading,
    loadingMore,
    jobs,
    total,
    page: storePage,
    querySearchJobs,
    loadMoreJobs,
    resetSearch,
    isUsingFallback,
  } = useSearchJobStore();
  const { user } = useGetCurrentUserStore();
  const { currentEmployeeLiked, queryCurrentEmployeeLiked } =
    useGetCurrentEmployeeLikedStore();
  const { blockedUsers, blockedLoaded, getBlockedUsers } = useModerationStore();

  /* -------------------------------- All States ------------------------------ */
  const isInitialSearchDoneRef = useRef<boolean>(false);

  // Holds the user's career scope names, written synchronously in the init
  // effect so runSearch always reads the latest value.
  const scopeNamesRef = useRef<string[]>([]);
  // Holds liked company IDs for server-side exclusion (avoids dep-array churn)
  const likedCompanyIdsRef = useRef<string[]>([]);
  // Holds blocked companies' profile IDs so they never appear in the feed.
  const blockedCompanyIdsRef = useRef<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Merge liked + blocked exclusions into the single list the search accepts.
  const buildExcludeCompanyIds = (): string[] | undefined => {
    const merged = Array.from(
      new Set([...likedCompanyIdsRef.current, ...blockedCompanyIdsRef.current]),
    );
    return merged.length > 0 ? merged : undefined;
  };

  /* ------------------------------- Search Form ------------------------------ */
  /* 
    React Hook Form: Employee Search Form
    defaultValues are seeded from the URL so a page refresh / shared link
    restores the exact filter state that was active when the URL was captured.
  */
  const { register, control, setValue, getValues, handleSubmit, watch } =
    useForm<TEmployeeSearchSchema>({
      resolver: zodResolver(employeeSearchSchema),
      defaultValues: {
        keyword: searchParams.get("q") ?? "",
        location: searchParams.get("loc") ?? "all",
        jobType: searchParams.get("type") ?? "all",
        companySize: {
          min: urlCmin ? parseInt(urlCmin) : undefined,
          max: urlCmax ? parseInt(urlCmax) : undefined,
        },
        date: {
          from: urlDfrom ? new Date(urlDfrom) : undefined,
          to: urlDto ? new Date(urlDto) : undefined,
        },
        salaryRange: {
          min: urlSmin ? parseInt(urlSmin) : undefined,
          max: urlSmax ? parseInt(urlSmax) : undefined,
        },
        educationLevel: urlEdu ? urlEdu.split(",") : [],
        experienceLevel: searchParams.get("exp") ?? undefined,
        sortBy: urlSortBy ?? "createdAt",
        orderBy: urlOrderBy ?? "desc",
      },
    });

  // Watch Only What SearchBar Needs (prevents full page rerender on every key)
  const location = watch("location");
  const jobType = watch("jobType");

  // Active filter count for the mobile filter badge
  const allValues = watch();
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (allValues.keyword) count++;
    if (allValues.location && allValues.location !== "all") count++;
    if (allValues.jobType && allValues.jobType !== "all") count++;
    if (
      allValues.companySize?.min !== undefined ||
      allValues.companySize?.max !== undefined
    )
      count++;
    if (allValues.date?.from || allValues.date?.to) count++;
    if (
      allValues.salaryRange?.min !== undefined ||
      allValues.salaryRange?.max !== undefined
    )
      count++;
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
    (values: TEmployeeSearchSchema) => {
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
      if (values.companySize?.min !== undefined)
        params.set("cmin", String(values.companySize.min));
      if (values.companySize?.max !== undefined)
        params.set("cmax", String(values.companySize.max));
      if (values.salaryRange?.min !== undefined)
        params.set("smin", String(values.salaryRange.min));
      if (values.salaryRange?.max !== undefined)
        params.set("smax", String(values.salaryRange.max));
      if (values.date?.from)
        params.set("dfrom", values.date.from.toISOString());
      if (values.date?.to) params.set("dto", values.date.to.toISOString());
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  // ── Sync page number to URL after load-more ─────────────────────
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

  // ── Real Search Function ────────────────────────────────────────
  const runSearch = useCallback(
    (data: TEmployeeSearchSchema, restorePage?: number) => {
      querySearchJobs({
        careerScopes:
          scopeNamesRef.current.length > 0 ? scopeNamesRef.current : undefined,
        // Only send keyword when it satisfies the server's @MinLength(2);
        // a 1-char keyword is treated as no keyword to avoid a 400.
        keyword:
          data.keyword && data.keyword.trim().length >= 2
            ? data.keyword.trim()
            : undefined,
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
        excludeCompanyIds: buildExcludeCompanyIds(),
        restorePage: restorePage && restorePage > 1 ? restorePage : undefined,
      });
    },
    [querySearchJobs],
  );

  // ── Stable Debounced Function ─────────────────────────────────────
  // runSearch is stable so debouncedRunSearch is also created exactly once per mount.
  const debouncedRunSearch = useMemo(
    () => debounce(runSearch, SEARCH_DEBOUNCE_MS),
    [runSearch],
  );

  // ── Clear All Filters ─────────────────────────────────────────────
  const clearAllFilters = useCallback(() => {
    setValue("keyword", "");
    setValue("location", "all");
    setValue("jobType", "all");
    setValue("date", {});
    setValue("companySize", { min: undefined, max: undefined });
    setValue("salaryRange", { min: undefined, max: undefined });
    setValue("educationLevel", []);
    setValue("experienceLevel", undefined);
  }, [setValue]);

  /* --------------------------------- Effects --------------------------------- */
  // Initial Search Effect (Once per mount / Per user ready)
  useEffect(() => {
    if (!user) return;
    if (isInitialSearchDoneRef.current) return;

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
        user.role === USER_ROLE.EMPLOYEE
          ? user.employee?.location
          : user.company?.location;

      if (userLocation && userLocation !== "all") {
        /* 
          Set the form value BEFORE isInitialSearchDoneRef = true so the watch
          subscription ignores this programmatic change and doesn't fire a
          second concurrent search.
        */
        setValue("location", userLocation as string);
      }

      querySearchJobs({
        careerScopes:
          scopeNamesRef.current.length > 0 ? scopeNamesRef.current : undefined,
        location:
          userLocation && userLocation !== "all"
            ? (userLocation as TLocations)
            : undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
        excludeCompanyIds: buildExcludeCompanyIds(),
      });
    }

    isInitialSearchDoneRef.current = true;
  }, [user, querySearchJobs, resetSearch, setValue, runSearch, getValues]);

  /* 
    Auto Search As User Types / Changes Filters Effect
    watch dep is stable; debouncedRunSearch is now stable too — this effect
    runs exactly once and never re-subscribes, eliminating the spurious
    immediate-fire that caused a second concurrent request.
  */
  useEffect(() => {
    const subscription = watch((value) => {
      if (!isInitialSearchDoneRef.current) return;
      debouncedRunSearch(value as TEmployeeSearchSchema);
      // Sync immediately so URL reflects the filter before the debounce fires
      syncToUrl(value as TEmployeeSearchSchema);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedRunSearch, syncToUrl]);

  // Cleanup Debounce Timer Effect
  useEffect(() => {
    return () => debouncedRunSearch.cancel();
  }, [debouncedRunSearch]);

  // Fetch liked companies, sync ref, and re-search once data is available
  useEffect(() => {
    if (!user?.employee?.id) return;
    if (currentEmployeeLiked !== null) {
      const ids = currentEmployeeLiked.map((c) => c.id!).filter(Boolean);
      likedCompanyIdsRef.current = ids;
      // Re-run search if initial search already fired (fixes first-load exclusion)
      if (isInitialSearchDoneRef.current) {
        runSearch(getValues());
      }
      return;
    }
    queryCurrentEmployeeLiked(user.employee.id);
  }, [
    user?.employee?.id,
    currentEmployeeLiked,
    queryCurrentEmployeeLiked,
    runSearch,
    getValues,
  ]);

  // Fetch blocked users, sync ref, and re-search so blocked companies are
  // hidden from the feed (they reappear only after being unblocked).
  useEffect(() => {
    if (!blockedLoaded) {
      getBlockedUsers();
      return;
    }
    blockedCompanyIdsRef.current = blockedUsers
      .filter((u) => u.role === "company" && u.companyId)
      .map((u) => u.companyId as string);
    if (isInitialSearchDoneRef.current) {
      runSearch(getValues());
    }
  }, [blockedLoaded, blockedUsers, getBlockedUsers, runSearch, getValues]);

  const filteredJobs = jobs;

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
      onSubmit={handleSubmit((data) => runSearch(data))}
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
            isEmployee={true}
            register={register}
            setValue={setValue}
            initialLocation={location as TLocations}
            initialJobType={jobType as TAvailability}
          />
        </div>
        <Image
          src={employeeSearchBannerSvg}
          alt="employee-search"
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
          isEmployee={true}
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
          isEmployee={true}
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
            <TypographySmall>{t("open")}</TypographySmall>
          )}
        </Button>
      </div>

      <div className="w-full flex items-start gap-6 tablet-xl:flex-col">
        {/* Left Side: Filter Section */}
        <div
          className={`w-72 xl:w-80 shrink-0 sticky top-5 self-start flex flex-col bg-card rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] tablet-xl:w-full tablet-xl:static ${
            mobileFiltersOpen ? "tablet-xl:flex" : "tablet-xl:hidden"
          }`}
        >
          {/* Header Section: Always visible, never scrolls */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
            <TypographyH4 className="font-semibold">
              {t("refineResult")}
            </TypographyH4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-8 px-2"
            >
              {t("clearFilters")}
            </Button>
          </div>

          {/* Scrollable Filter Body Section */}
          <div className="flex flex-col gap-5 p-5">
            {/* Filter Panel Skeleton Section */}
            {jobs === null ? (
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
                {/* Date Posted Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideCalendarDays strokeWidth={"1.5px"} />
                    {t("datePosted")}
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
                        const diffHours =
                          (to.getTime() - from.getTime()) / 36e5;
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
                            {t("allDatesPosted")}
                          </RadioGroupItemWithLabel>
                          <RadioGroupItemWithLabel
                            id="last-24"
                            value="last 24 hours"
                            htmlFor="last-24"
                          >
                            {t("last24Hours")}
                          </RadioGroupItemWithLabel>
                          <RadioGroupItemWithLabel
                            id="last-3-days"
                            value="last 3 days"
                            htmlFor="last-3-days"
                          >
                            {t("last3Days")}
                          </RadioGroupItemWithLabel>
                          <RadioGroupItemWithLabel
                            id="last-week"
                            value="last week"
                            htmlFor="last-week"
                          >
                            {t("lastWeek")}
                          </RadioGroupItemWithLabel>
                        </RadioGroup>
                      );
                    }}
                  />
                </div>

                <Separator />

                {/* Company Size Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideUsers strokeWidth={"1.5px"} />
                    {t("companySize")}
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
                            placeholder={t("min")}
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
                            placeholder={t("max")}
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
                            {t("employees")}
                          </span>
                        </div>
                      );
                    }}
                  />
                </div>

                <Separator />

                {/* Salary Range Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideCircleDollarSign strokeWidth={"1.5px"} />
                    {t("salaryRange")}
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
                            placeholder={t("min")}
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
                            placeholder={t("max")}
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

                <Separator />

                {/* Education Level Section */}
                <div className="flex flex-col items-start gap-3">
                  <TypographyP className="text-sm font-medium flex items-center gap-1">
                    <LucideGraduationCap strokeWidth={"1.5px"} />
                    {t("educationLevel")}
                  </TypographyP>

                  <Controller
                    name="educationLevel"
                    control={control}
                    render={({ field }) => {
                      const educations = [
                        { value: "Under Graduate", label: t("underGraduate") },
                        { value: "Bachelor", label: t("bachelor") },
                        { value: "Master", label: t("master") },
                        { value: "PhD", label: t("phd") },
                      ];
                      const selectedEdu = field.value ?? [];

                      return (
                        <div className="ml-1.5 flex flex-col gap-3 sm:ml-3">
                          {educations.map((edu) => (
                            <div
                              key={edu.value}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`edu-${edu.value}`}
                                checked={selectedEdu.includes(edu.value)}
                                onCheckedChange={(checked) => {
                                  let updated = [...selectedEdu];
                                  if (checked) {
                                    updated.push(edu.value);
                                  } else {
                                    updated = updated.filter(
                                      (item) => item !== edu.value,
                                    );
                                  }
                                  handleRadioChange("educationLevel", updated);
                                }}
                              />
                              <label
                                htmlFor={`edu-${edu.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {edu.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </div>

                <Separator />

                {/* Experience Level Section */}
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
                {loading || filteredJobs === null ? (
                  <Skeleton className="h-6 w-40 bg-muted" />
                ) : error ? (
                  <TypographySmall className="text-destructive">
                    {t("zeroJobsListing")}
                  </TypographySmall>
                ) : filteredJobs.length > 0 ? (
                  t("jobsListed", { count: total })
                ) : (
                  t("noJobsFound")
                )}
              </TypographyH4>
              {!loading &&
                isUsingFallback &&
                filteredJobs &&
                filteredJobs.length > 0 && (
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
                          <SelectItem value="companySize-desc">
                            {t("companySizeHighToLow")}
                          </SelectItem>
                          <SelectItem value="companySize-asc">
                            {t("companySizeLowToHigh")}
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
              <div className="w-full mb-3">
                <SearchErrorCard
                  title={error}
                  description={t("errorDescription")}
                />
              </div>
            ) : loading || filteredJobs === null ? (
              /* Loading Skeleton Section */
              <div className="w-full mb-3">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <SearchCompanyCardSkeleton key={index} />
                  ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              /* Search Company Card Section */
              <>
                {filteredJobs.map((item, index) => (
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
                    company={item.company}
                  />
                ))}
                {jobs && jobs.length < total && (
                  <div className="w-full flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loadingMore}
                      onClick={async () => {
                        await loadMoreJobs({
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
                              : getValues("location"),
                          jobType:
                            getValues("jobType") === "all"
                              ? undefined
                              : getValues("jobType"),
                          companySizeMin: getValues("companySize")?.min,
                          companySizeMax: getValues("companySize")?.max,
                          postedDateFrom:
                            getValues("date")?.from?.toISOString(),
                          postedDateTo: getValues("date")?.to?.toISOString(),
                          salaryMin: getValues("salaryRange")?.min,
                          salaryMax: getValues("salaryRange")?.max,
                          educationRequired: getValues("educationLevel")?.length
                            ? getValues("educationLevel")
                            : undefined,
                          experienceLevel: getValues("experienceLevel"),
                          sortBy: getValues("sortBy"),
                          sortOrder: getValues("orderBy")?.toUpperCase() as
                            | "ASC"
                            | "DESC",
                          excludeCompanyIds: buildExcludeCompanyIds(),
                        });
                        syncPageToUrl(storePage + 1);
                      }}
                      className="h-9 px-6 text-sm"
                    >
                      {loadingMore ? t("loading") : t("loadMore")}
                    </Button>
                  </div>
                )}
              </>
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
                    onClick={clearAllFilters}
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
