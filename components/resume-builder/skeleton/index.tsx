import { Skeleton } from "@/components/ui/skeleton";
import { FeaturePageHeaderSkeleton } from "@/components/feed/skeleton";

/* ------------------------------------------- Helpers -------------------------------------------- */
/** Numbered step header placeholder matching the builder page's StepHeader */
function StepHeaderSkeleton() {
  return (
    <div className="flex w-full items-center gap-3">
      <Skeleton className="h-7 w-9 shrink-0 rounded-lg" />
      <Skeleton className="h-4 w-40 rounded" />
      <div className="h-px flex-1 bg-border/70" />
    </div>
  );
}

/* -------------------------------- Resume Builder Loading Skeleton ------------------------------- */
export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-7 px-2.5 pb-5 sm:px-5 lg:px-8">
      {/* Header Skeleton Section */}
      <FeaturePageHeaderSkeleton />

      {/* Step 1: Template Grid Section */}
      <div className="flex w-full flex-col gap-4">
        <StepHeaderSkeleton />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Step 2: Information Source Section */}
      <div className="flex w-full flex-col gap-4">
        <StepHeaderSkeleton />
        <div className="flex w-full flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] sm:p-6">
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
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-[0_12px_36px_hsl(var(--foreground)/0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="size-9 rounded-xl shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 max-w-64">
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="hidden sm:block h-3 w-full rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="hidden md:block h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- Template Card Skeleton ------------------------------------ */
export function TemplateCardSkeleton() {
  return (
    <div className="flex h-fit w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)]">
      {/* Preview Area Section: Mirrors the live TemplateMiniPreview structure */}
      <div className="relative flex h-60 w-full items-center justify-center border-b border-border/60 bg-[hsl(var(--illustration-surface))] p-4">
        <div className="flex h-full w-[172px] flex-col bg-white shadow-[0_8px_24px_rgba(38,35,30,0.1)]">
          {/* Mini Header Band Section */}
          <div className="flex w-full items-center gap-2.5 bg-muted/50 px-4 py-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-20 rounded" />
              <Skeleton className="h-1.5 w-14 rounded" />
            </div>
          </div>
          {/* Mini Body Section */}
          <div className="grid flex-1 grid-cols-[1fr_38%] gap-3 px-4 py-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-1.5 w-12 rounded" />
              <Skeleton className="h-1 w-full rounded" />
              <Skeleton className="h-1 w-4/5 rounded" />
              <Skeleton className="mt-2 h-1.5 w-12 rounded" />
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
      </div>

      {/* Card Body Section */}
      <div className="w-full p-4 bg-card flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}

/* -------------------------------- Resume Editor Loading Skeleton ------------------------------- */
export function ResumeEditorLoadingSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-background">
      {/* Top Action Bar Section */}
      <div className="flex flex-col gap-2.5 border-b border-border/80 bg-card/95 px-3 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Back Button */}
          <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
          <div className="h-7 w-px bg-border" />
          {/* File Icon + Title + Template label Section */}
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 shrink-0 rounded-xl" />
            <div className="hidden flex-col gap-1 sm:flex">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <Skeleton className="h-9 w-[154px] rounded-xl sm:w-[184px]" />
        </div>
        {/* Editing + Export Actions Section */}
        <div className="flex w-full items-center gap-2 lg:w-auto">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-10 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl sm:w-36 sm:flex-none" />
        </div>
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[hsl(var(--illustration-surface))] lg:flex-row">
        {/* Left Form Panel Section */}
        <div className="flex max-h-[62vh] w-full shrink-0 flex-col overflow-hidden border-b border-border/70 bg-card lg:max-h-none lg:w-[400px] lg:border-b-0 lg:border-r">
          {/* Hint Text Header Section */}
          <div className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
          {/* Tabs Section */}
          <div className="px-3 pb-2 sm:px-4">
            <Skeleton className="h-10 w-full rounded-xl" />
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
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-12 items-center justify-between border-b border-border/70 bg-card/80 px-4">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
          <div className="h-full w-full overflow-hidden p-5">
            <div className="mx-auto h-full max-w-3xl space-y-4 overflow-hidden bg-white p-6 shadow-[0_18px_50px_rgba(38,35,30,0.12)]">
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
