import { Skeleton } from "@/components/ui/skeleton";

/* --------------------------------------- Search Banner Skeleton ----------------------------------------- */
function SearchBannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl border border-border/50 px-6 py-8 sm:px-8 animate-shimmer">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Title Section */}
        <Skeleton className="h-9 w-96 tablet-xl:w-80" />
        {/* Subtitle Section */}
        <Skeleton className="h-6 w-72 tablet-xl:w-64" />
        {/* Description Section */}
        <Skeleton className="h-6 w-80 tablet-xl:w-72" />
        {/* Description Section */}
        <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        {/* Search Bar Row Section */}
        <div className="flex items-center gap-2 mt-1 w-full max-w-xl">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      {/* Image Section */}
      <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[340px] rounded-xl tablet-xl:hidden" />
    </div>
  );
}

/* ----------------------------------- Search Filter Sidebar Skeleton ------------------------------------ */
function SearchFilterSidebarSkeleton() {
  return (
    <div className="w-1/4 flex flex-col gap-6 p-4 sm:p-5 bg-card rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] tablet-xl:hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      {/* Filter Section */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <div className="ml-3 flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-32 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------ Search Results Header Skeleton ----------------------------------- */
function SearchResultsHeaderSkeleton() {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-9 w-full sm:w-[200px] rounded-lg" />
    </div>
  );
}

/* -------------------------------- Search Employee Page Loading Skeleton -------------------------------- */
export function SearchEmployeeLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8">
      {/* Banner Section */}
      <SearchBannerSkeleton />

      {/* Mobile Filter Toggle Section */}
      <Skeleton className="hidden tablet-xl:flex h-10 w-full rounded-lg" />

      {/* Two-Column Layout Section */}
      <div className="w-full flex items-start gap-5">
        {/* Filter Sidebar Section */}
        <SearchFilterSidebarSkeleton />

        {/* Results Section */}
        <div className="w-3/4 flex flex-col items-start gap-3 tablet-xl:w-full">
          <SearchResultsHeaderSkeleton />
          <div className="w-full flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SearchCompanyPageCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Search Company Page Loading Skeleton -------------------------------- */
export function SearchCompanyLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8">
      {/* Banner Section */}
      <SearchBannerSkeleton />

      {/* Mobile Filter Toggle Section */}
      <Skeleton className="hidden tablet-xl:flex h-10 w-full rounded-lg" />

      {/* Two-Column Layout Section */}
      <div className="w-full flex items-start gap-5">
        {/* Filter Sidebar Section */}
        <SearchFilterSidebarSkeleton />

        {/* Results Section */}
        <div className="w-3/4 flex flex-col items-start gap-3 tablet-xl:w-full">
          <SearchResultsHeaderSkeleton />
          <div className="w-full flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SearchEmployeePageCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Search Company Card Skeleton (job listing — used in employee search page) -------------------------------- */
function SearchCompanyPageCardSkeleton() {
  return (
    <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-28 mt-1.5" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>
        {/* Meta Chips Row 1 Section*/}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-7 w-28 rounded-full" />
          ))}
        </div>
        {/* Meta Chips Row 2 Section (education + experience) */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
        </div>
        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

/* -------------------------------- Search Employee Card Skeleton (Employee Profile — Used in Company Search Page) -------------------------------- */
function SearchEmployeePageCardSkeleton() {
  return (
    <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-24 mt-1.5" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>
        {/* Meta Chips Section (4 chips: exp, location, availability, education) */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-7 w-24 rounded-full" />
          ))}
        </div>
        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/* -------------------------------- Search Employee Card Skeleton (inline loading — used in both pages) -------------------------------- */
export function SearchEmployeeCardSkeleton() {
  return (
    <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-24 mt-1.5" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Meta Chips Section */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>

        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
