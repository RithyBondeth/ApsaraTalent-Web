import { Skeleton } from "@/components/ui/skeleton";

/* ----------------------------------------- Search Bar Skeleton ----------------------------------------- */
function SearchBarSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2 p-2.5 sm:p-3 shadow-md rounded-md">
      {/* Keyword Input Section */}
      <Skeleton className="h-10 sm:h-11 w-full rounded-md" />
      {/* Location + JobType Section */}
      <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <Skeleton className="h-10 sm:h-12 w-full rounded-md" />
        <Skeleton className="h-10 sm:h-12 w-full rounded-md" />
      </div>
    </div>
  );
}

/* --------------------------------------- Search Banner Skeleton ----------------------------------------- */
function SearchBannerSkeleton() {
  return (
    <>
      {/* Desktop Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="w-full flex flex-col items-start gap-3">
          <Skeleton className="h-9 w-96" />
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-4 w-64" />
          <div className="w-full mt-1">
            <SearchBarSkeleton />
          </div>
        </div>
        <Skeleton className="h-[250px] w-[340px] rounded-xl shrink-0" />
      </div>

      {/* Tablet Banner Section */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full flex-col gap-4 rounded-2xl border border-border/50 px-5 py-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-5 w-56" />
        </div>
        <SearchBarSkeleton />
      </div>

      {/* Mobile Banner Section */}
      <div className="hidden tablet-md:flex w-full flex-col gap-3 rounded-2xl border border-border/50 px-4 py-4">
        <Skeleton className="h-5 w-52" />
        <SearchBarSkeleton />
      </div>
    </>
  );
}

/* ----------------------------------- Search Filter Sidebar Skeleton ------------------------------------ */
function SearchFilterSidebarSkeleton({ filterCount }: { filterCount: number }) {
  return (
    <div className="w-72 xl:w-80 shrink-0 flex flex-col bg-card rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] tablet-xl:hidden">
      {/* Sidebar Header Section */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      {/* Sidebar Filter Body Section */}
      <div className="flex flex-col gap-6 p-5">
        {Array.from({ length: filterCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32 rounded" />
            <div className="ml-3 flex flex-col gap-2.5">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------ Search Results Header Skeleton ----------------------------------- */
function SearchResultsHeaderSkeleton() {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-40" />
      </div>
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
      <div className="w-full flex items-start gap-6 tablet-xl:flex-col">
        {/* Filter Sidebar Section */}
        <SearchFilterSidebarSkeleton filterCount={5} />

        {/* Results Section */}
        <div className="flex-1 min-w-0 tablet-xl:w-full flex flex-col items-start gap-3">
          <SearchResultsHeaderSkeleton />
          <div className="w-full flex flex-col items-start gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SearchCompanyCardSkeleton key={i} />
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
      <div className="w-full flex items-start gap-6 tablet-xl:flex-col">
        {/* Filter Sidebar Section */}
        <SearchFilterSidebarSkeleton filterCount={2} />

        {/* Results Section */}
        <div className="flex-1 min-w-0 tablet-xl:w-full flex flex-col items-start gap-3">
          <SearchResultsHeaderSkeleton />
          <div className="w-full flex flex-col items-start gap-2">
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
export function SearchCompanyCardSkeleton() {
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
        {/* Meta Chips Row 1 Section — Company size, Location, Job type */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-7 w-28 rounded-full" />
          ))}
        </div>
        {/* Meta Chips Row 2 Section — Education + Experience Requirements */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
        </div>
        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
      {/* Action Bar Section — salary, posted date + view button */}
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

/* -------------------------------- Search Employee Card Skeleton (Profile — Used in Company search page) -------------------------------- */
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
        {/* Meta Chips Section — Experience, Location, Availability, Education */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-7 w-24 rounded-full" />
          ))}
        </div>
        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
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
