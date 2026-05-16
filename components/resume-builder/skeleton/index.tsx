import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Resume Builder Loading Skeleton ------------------------------- */
export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl border border-border/50 px-6 py-8 sm:px-8">
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
          <Skeleton className="h-9 w-96 tablet-xl:w-80" />
          <Skeleton className="h-6 w-72 tablet-xl:w-64" />
          <Skeleton className="h-6 w-80 tablet-xl:w-72" />
          <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        </div>
        <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[340px] rounded-xl tablet-xl:!w-full" />
      </div>

      {/* Header Section */}
      <div className="w-full flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0 bg-card border border-border/70 rounded-full px-3 py-1.5 shadow-[0_1px_4px_hsl(var(--foreground)/0.06)]">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Template Grid Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <TemplateCardSkeleton key={index} />
        ))}
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
      <div className="flex flex-col gap-2 border-b border-border/60 bg-card px-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <div className="flex flex-col gap-1 ml-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-9 w-full sm:w-36 rounded-lg" />
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Form Panel Section */}
        <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-border/60 p-4 space-y-4 bg-card/50">
          <Skeleton className="h-8 w-full rounded-lg" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Right Preview Section */}
        <div className="flex-1 p-5 overflow-hidden bg-muted/30">
          <div className="h-full w-full border border-border/60 rounded-2xl bg-card p-5 space-y-4">
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
  );
}
