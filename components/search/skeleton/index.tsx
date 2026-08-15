import { Skeleton } from "@/components/ui/skeleton";

/* ---------------------------- Search Bar Skeleton --------------------------- */
function SearchBarSkeleton() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(170px,0.78fr)_minmax(170px,0.78fr)] gap-3 tablet-md:grid-cols-1">
      {/* Keyword Field Section */}
      <Skeleton className="h-12 w-full rounded-none border border-border bg-background" />

      {/* Location Field Section */}
      <Skeleton className="h-12 w-full rounded-none border border-border bg-background" />

      {/* Job Type Field Section */}
      <Skeleton className="h-12 w-full rounded-none border border-border bg-background" />
    </div>
  );
}

/* ---------------------------- Search Hero Skeleton -------------------------- */
function SearchHeroSkeleton() {
  return (
    <div className="flex min-h-[300px] w-full flex-row overflow-hidden border border-border bg-card">
      {/* Hero Copy and Search Section */}
      <div className="flex w-3/5 min-w-0 flex-none flex-col justify-between gap-7 px-6 py-7 tablet-md:gap-4 tablet-md:px-4 tablet-md:py-5 sm:px-8 sm:py-9">
        <div className="flex items-center gap-2">
          <Skeleton className="h-px w-7 rounded-none" />
          <Skeleton className="h-2.5 w-24 rounded-none" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-10 w-5/6 max-w-[560px] rounded-none tablet-md:h-6" />
          <Skeleton className="h-10 w-3/5 max-w-[420px] rounded-none tablet-md:h-6" />
          <Skeleton className="h-4 w-4/5 max-w-[520px] rounded-none" />
        </div>

        <div className="flex items-center gap-3 tablet-md:hidden">
          <Skeleton className="h-9 w-0.5 rounded-none" />
          <Skeleton className="h-3 w-3/5 rounded-none" />
        </div>

        <SearchBarSkeleton />
      </div>

      {/* Hero Visual Section */}
      <div className="relative flex min-h-[300px] w-2/5 min-w-0 shrink-0 items-center justify-center overflow-hidden bg-foreground p-7 tablet-md:p-3">
        <div className="absolute left-4 top-4 flex items-center gap-2 tablet-md:left-2 tablet-md:top-2">
          <Skeleton className="size-7 rounded-none opacity-20" />
          <Skeleton className="h-3 w-28 rounded-none opacity-20 tablet-md:hidden" />
        </div>
        <div className="relative mt-5 h-[206px] w-[84%] max-w-[330px] border border-background/15 p-3 tablet-md:h-[124px] tablet-md:w-[78%] tablet-md:p-1.5">
          <div className="absolute -bottom-2 -right-2 h-full w-full border border-background/10" />
          <Skeleton className="relative h-full w-full rounded-none opacity-20" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Filter Sidebar Skeleton ------------------------- */
function SearchFilterSidebarSkeleton({ filterCount }: { filterCount: number }) {
  return (
    <div className="search-filter-panel flex w-72 shrink-0 flex-col border border-t-[5px] border-border border-t-foreground bg-card tablet-xl:hidden xl:w-80">
      {/* Sidebar Header Section */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
        <Skeleton className="h-5 w-28 rounded-none" />
        <Skeleton className="h-8 w-20 rounded-none" />
      </div>

      {/* Sidebar Filter Body Section */}
      <div className="flex flex-col gap-6 p-5">
        {Array.from({ length: filterCount }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32 rounded-none" />
            <div className="ml-3 flex flex-col gap-2.5">
              <Skeleton className="h-3 w-24 rounded-none" />
              <Skeleton className="h-3 w-28 rounded-none" />
              <Skeleton className="h-3 w-20 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Results Header Skeleton ------------------------ */
function SearchResultsHeaderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Result Count Section */}
      <Skeleton className="h-6 w-40 rounded-none" />

      {/* Sort Control Section */}
      <Skeleton className="h-10 w-full rounded-none sm:w-[220px]" />
    </div>
  );
}

/* -------------------------- Company Result Skeleton ------------------------- */
export function SearchCompanyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden border border-l-[5px] border-border border-l-foreground bg-card">
      {/* Company and Position Content Section */}
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 shrink-0 rounded-none sm:size-16" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-44 rounded-none" />
            <Skeleton className="h-3.5 w-28 rounded-none" />
            <Skeleton className="h-3 w-20 rounded-none" />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-28 rounded-none" />
          <Skeleton className="h-7 w-24 rounded-none" />
          <Skeleton className="h-7 w-20 rounded-none" />
          <Skeleton className="h-7 w-32 rounded-none" />
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded-none" />
          <Skeleton className="h-3.5 w-4/5 rounded-none" />
        </div>

        {/* Skill Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16 rounded-none" />
          ))}
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-none" />
          <Skeleton className="h-7 w-24 rounded-none" />
        </div>
        <Skeleton className="h-8 w-28 rounded-none" />
      </div>
    </div>
  );
}

/* -------------------------- Employee Result Skeleton ------------------------ */
function SearchEmployeePageCardSkeleton() {
  return (
    <div className="w-full overflow-hidden border border-l-[5px] border-border border-l-foreground bg-card">
      {/* Employee Content Section */}
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 shrink-0 rounded-none sm:size-16" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36 rounded-none" />
                <Skeleton className="h-3.5 w-24 rounded-none" />
              </div>
              <Skeleton className="h-6 w-20 shrink-0 rounded-none" />
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-24 rounded-none" />
          ))}
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded-none" />
          <Skeleton className="h-3.5 w-3/4 rounded-none" />
        </div>

        {/* Skill Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16 rounded-none" />
          ))}
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <Skeleton className="h-3 w-24 rounded-none" />
        <Skeleton className="h-8 w-24 rounded-none" />
      </div>
    </div>
  );
}

/* ----------------------- Employee Inline Card Skeleton ---------------------- */
export function SearchEmployeeCardSkeleton() {
  return <SearchEmployeePageCardSkeleton />;
}

/* ---------------------------- Search Page Skeleton -------------------------- */
function SearchPageLoadingSkeleton({
  filterCount,
  resultKind,
}: {
  filterCount: number;
  resultKind: "company" | "employee";
}) {
  return (
    <div className="search-editorial mx-auto flex w-full max-w-[1500px] flex-col items-start gap-6 px-3 sm:px-4 lg:px-5">
      {/* Hero Section */}
      <SearchHeroSkeleton />

      {/* Mobile Filter Toggle Section */}
      <Skeleton className="hidden h-11 w-full rounded-none tablet-xl:flex" />

      {/* Filter and Results Layout Section */}
      <div className="flex w-full items-start gap-5 tablet-xl:flex-col">
        <SearchFilterSidebarSkeleton filterCount={filterCount} />

        {/* Results Section */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 tablet-xl:w-full">
          <SearchResultsHeaderSkeleton />
          <div className="flex w-full flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) =>
              resultKind === "company" ? (
                <SearchCompanyCardSkeleton key={index} />
              ) : (
                <SearchEmployeePageCardSkeleton key={index} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Employee Search Loading -------------------------- */
export function SearchEmployeeLoadingSkeleton() {
  return <SearchPageLoadingSkeleton filterCount={4} resultKind="company" />;
}

/* -------------------------- Company Search Loading -------------------------- */
export function SearchCompanyLoadingSkeleton() {
  return <SearchPageLoadingSkeleton filterCount={2} resultKind="employee" />;
}
