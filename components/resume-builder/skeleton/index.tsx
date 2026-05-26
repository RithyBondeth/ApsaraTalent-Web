import { Skeleton } from "@/components/ui/skeleton";
import { FeedBannerSkeleton } from "@/components/feed/skeleton";

/* -------------------------------- Resume Builder Loading Skeleton ------------------------------- */
export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Template Section Header */}
      <div className="w-full flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0 bg-card border border-border/70 rounded-full px-3 py-1.5 shadow-[0_1px_4px_hsl(var(--foreground)/0.06)]">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Template Grid Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <TemplateCardSkeleton key={index} />
        ))}
      </div>

      {/* Features Section */}
      <div className="w-full flex flex-col items-center gap-8 p-6 sm:p-8 rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]">
        {/* Title */}
        <Skeleton className="h-5 w-48 rounded" />
        {/* 3 Feature Cards Section */}
        <div className="w-full flex justify-between items-center gap-6 tablet-lg:flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1">
              <Skeleton className="h-[3.75rem] w-[3.75rem] rounded-2xl shrink-0" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Generate Section */}
      <div className="w-full bg-foreground/[0.08] flex flex-col items-center justify-center rounded-2xl gap-3 p-8 sm:p-10">
        <Skeleton className="h-5 w-44 rounded" />
        <Skeleton className="h-3 w-64 rounded" />
        <Skeleton className="h-9 w-36 rounded-full mt-1" />
      </div>
    </div>
  );
}

/* ------------------------------------- Template Card Skeleton ------------------------------------ */
export function TemplateCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] overflow-hidden">
      {/* Preview Area Section */}
      <div className="w-full h-52 relative bg-muted/40">
        {/* Free/Premium Badge Section */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        {/* Style Badge Section */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Mini Resume Skeleton Section */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-28 h-36 rounded-lg border border-muted bg-background/60 p-2 flex flex-col gap-1.5">
            <Skeleton className="w-8 h-8 rounded-full mx-auto" />
            <Skeleton className="h-1.5 w-14 mx-auto" />
            <Skeleton className="h-1 w-10 mx-auto" />
            <div className="border-t border-muted mt-1 pt-1 flex flex-col gap-1">
              <Skeleton className="h-1 w-full" />
              <Skeleton className="h-1 w-4/5" />
              <Skeleton className="h-1 w-3/4" />
              <Skeleton className="h-1 w-full mt-0.5" />
              <Skeleton className="h-1 w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Card Body Section */}
      <div className="w-full p-4 bg-card flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
}

/* -------------------------------- Resume Editor Loading Skeleton ------------------------------- */
export function ResumeEditorLoadingSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Top Action Bar Section */}
      <div className="flex flex-col gap-2 border-b bg-background px-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          {/* Back Button */}
          <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
          {/* Toggle Panel Button */}
          <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
          {/* File Icon + Title + Template label Section */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
        </div>
        {/* Download Button Section */}
        <Skeleton className="h-9 w-full sm:w-36 rounded-lg" />
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Form Panel Section */}
        <div className="w-full shrink-0 flex flex-col border-b bg-background overflow-hidden max-h-[56vh] lg:max-h-none lg:w-[420px] lg:border-b-0 lg:border-r border-border/60">
          {/* Hint Text Header Section */}
          <div className="shrink-0 px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
            <Skeleton className="h-3 w-40 rounded" />
          </div>
          {/* Tabs Section */}
          <div className="px-3 pb-2 sm:px-4">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          {/* Form Fields Section */}
          <div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4 space-y-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-2/5 rounded" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Preview Section */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          <div className="h-full w-full p-5 overflow-hidden">
            <div className="h-full w-full border border-border/60 rounded-2xl bg-white dark:bg-card p-6 space-y-4 overflow-hidden">
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
              <div className="border-t border-border/40 pt-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-11/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
