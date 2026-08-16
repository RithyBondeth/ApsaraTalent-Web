import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* ------------------------------------------- Helpers -------------------------------------------- */
/** Numbered step header placeholder matching the builder page's StepHeader */
/* -------------------------------- Step Header Skeleton -------------------------------- */
function StepHeaderSkeleton() {
  return (
    <div className="flex w-full items-center gap-3">
      <Skeleton className="size-8 shrink-0" />
      <Skeleton className="h-3 w-40" />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* -------------------------------- Resume Builder Loading Skeleton ------------------------------- */
export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="resume-builder-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton />

      {/* Builder Workspace Section */}
      <div className="pixel-ruled w-full items-start border-x-0 border-b-0 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Template Selection Section */}
        <div className="flex min-w-0 flex-col gap-4 p-6 sm:p-8">
          <StepHeaderSkeleton />
          <div className="resume-template-strip grid auto-cols-[82vw] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-2 min-[1400px]:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <TemplateCardSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* Information and Generate Rail Section */}
        <div className="flex min-w-0 flex-col gap-4 p-6 sm:p-8 xl:self-start">
          <StepHeaderSkeleton />

          {/* Source Input Skeleton Section */}
          <div className="flex w-full flex-col gap-5 border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="size-9 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-56 w-full" />
            <div className="space-y-2 border-t border-border pt-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Generate Action Skeleton Section */}
          <div className="w-full border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Skeleton className="size-10 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- Template Card Skeleton ------------------------------------ */
export function TemplateCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-border bg-card">
      {/* Preview Area Section: Mirrors the live TemplateMiniPreview structure */}
      <div className="relative flex h-52 w-full flex-col border-b border-border bg-muted/30">
        {/* Mini Header Band Section */}
        <div className="flex w-full items-center gap-2.5 bg-muted/50 px-4 py-4">
          <Skeleton className="size-9 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-1.5 w-14" />
          </div>
        </div>
        {/* Mini Body Section */}
        <div className="grid flex-1 grid-cols-[1fr_38%] gap-3 px-4 py-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-1.5 w-12" />
            <Skeleton className="h-1 w-full" />
            <Skeleton className="h-1 w-4/5" />
            <Skeleton className="mt-2 h-1.5 w-12" />
            <Skeleton className="h-1 w-full" />
            <Skeleton className="h-1 w-3/4" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-1.5 w-10" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-2 w-8" />
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-2 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Card Body Section */}
      <div className="flex min-h-[156px] w-full flex-col justify-between gap-4 bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

/* -------------------------------- Resume Editor Loading Skeleton ------------------------------- */
export function ResumeEditorLoadingSkeleton() {
  return (
    <div
      className="resume-editor-shell flex h-[calc(100dvh-4rem)] flex-col overflow-hidden"
      aria-busy="true"
    >
      {/* Top Action Bar Section */}
      <div className="resume-editor-controls flex flex-col gap-2 border-b border-border bg-card px-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          {/* Back Button */}
          <Skeleton className="h-8 w-20 shrink-0" />
          {/* File Icon + Title + Template label Section */}
          <div className="hidden items-center gap-2 border-l-2 border-foreground pl-3 sm:flex">
            <Skeleton className="h-4 w-4 shrink-0" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-[150px] sm:w-[180px]" />
        </div>
        {/* Editor Actions Section */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Skeleton className="hidden h-3 w-28 sm:block" />
          <Skeleton className="size-8 shrink-0" />
          <Skeleton className="h-8 flex-1 sm:w-32 sm:flex-none" />
        </div>
      </div>

      {/* Mobile Workspace Switcher Section */}
      <div className="grid shrink-0 grid-cols-2 border-b border-border bg-card p-2 md:hidden">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/20 md:flex-row">
        {/* Left Form Panel Section */}
        <div className="resume-editor-controls flex w-full flex-1 flex-col overflow-hidden border-b border-border bg-card md:w-[380px] md:flex-none md:border-b-0 md:border-r lg:w-[420px] xl:w-[440px]">
          {/* Panel Header Section */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3 py-3 sm:px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-36" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="hidden size-8 md:block" />
            </div>
          </div>

          {/* Form Editor Section */}
          <div className="flex-1 overflow-hidden px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
            <Skeleton className="h-11 w-full" />
            <div className="mt-3 border-l-2 border-foreground px-3 py-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-1.5 h-2.5 w-52 max-w-full" />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border border-border bg-muted/25 px-3 py-3"
                >
                  <Skeleton className="size-8 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-40 max-w-full" />
                  </div>
                  <Skeleton className="size-4 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Section */}
        <div className="hidden flex-1 flex-col overflow-hidden md:flex">
          {/* Preview Toolbar Skeleton Section */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-2.5 py-2 sm:px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-3 w-36" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-7" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="size-7" />
            </div>
          </div>

          {/* Resume Canvas Skeleton Section */}
          <div className="resume-canvas-workspace flex h-full w-full justify-center overflow-hidden p-6">
            <div className="h-full w-full max-w-[720px] space-y-4 overflow-hidden border border-border bg-white p-6 dark:bg-card">
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
              <div className="space-y-4 border-t border-border/40 pt-4">
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
