import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------------------------- Helpers -------------------------------------------- */
/** Numbered step header placeholder matching the builder page's StepHeader */
function StepHeaderSkeleton() {
  return (
    <div className="w-full flex items-center gap-3">
      <Skeleton className="size-7 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-40 rounded" />
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

/* -------------------------------- Resume Builder Loading Skeleton ------------------------------- */
export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-6 px-2.5 pb-4 sm:px-5 lg:px-8">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/[0.04] via-transparent to-muted/20 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-start gap-3 flex-1">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-6 w-3/5 rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="hidden sm:block h-3 w-2/5 rounded" />
        </div>
        <Skeleton className="hidden md:block h-36 w-[220px] lg:w-[300px] shrink-0 rounded-xl" />
      </div>

      {/* Step 1: Template Grid Section */}
      <div className="w-full flex flex-col gap-3">
        <StepHeaderSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Step 2: Information Source Section */}
      <div className="w-full flex flex-col gap-3">
        <StepHeaderSkeleton />
        <div className="w-full rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-52 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </div>

      {/* Sticky Generate Bar Section */}
      <div className="sticky bottom-3 z-30 w-full">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-[0_8px_30px_hsl(var(--foreground)/0.1)] backdrop-blur-lg">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="size-9 rounded-xl shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 max-w-64">
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="hidden sm:block h-3 w-full rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="hidden md:block h-6 w-32 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- Template Card Skeleton ------------------------------------ */
export function TemplateCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col rounded-2xl border border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] overflow-hidden">
      {/* Preview Area Section: Mirrors the live TemplateMiniPreview structure */}
      <div className="w-full h-52 relative bg-muted/30 flex flex-col">
        {/* Mini Header Band Section */}
        <div className="w-full px-4 py-4 bg-muted/50 flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-20 rounded" />
            <Skeleton className="h-1.5 w-14 rounded" />
          </div>
        </div>
        {/* Mini Body Section */}
        <div className="flex-1 grid grid-cols-[1fr_38%] gap-3 px-4 py-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-1.5 w-12 rounded" />
            <Skeleton className="h-1 w-full rounded" />
            <Skeleton className="h-1 w-4/5 rounded" />
            <Skeleton className="h-1.5 w-12 rounded mt-2" />
            <Skeleton className="h-1 w-full rounded" />
            <Skeleton className="h-1 w-3/4 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-1.5 w-10 rounded" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-2 w-8 rounded-full" />
              <Skeleton className="h-2 w-10 rounded-full" />
              <Skeleton className="h-2 w-7 rounded-full" />
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
