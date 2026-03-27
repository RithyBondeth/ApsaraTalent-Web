import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeBuilderLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
      {Array.from({ length: 12 }, (_, index) => (
        <TemplateCardSkeleton key={index} />
      ))}
    </div>
  );
}

function TemplateCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col rounded-lg shadow-sm border border-muted overflow-hidden">
      {/* Preview area — matches the real card's h-48 */}
      <div className="w-full h-48 relative bg-muted/40">
        {/* Free/Premium badge top-left */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        {/* Style badge top-right */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Mini resume skeleton centered */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-28 h-36 rounded border border-muted bg-background/60 p-2 flex flex-col gap-1.5">
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

      {/* Card body — matches real card's p-3 body */}
      <div className="w-full p-3 flex flex-col gap-2">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ResumeEditorLoadingSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* ── Top Action Bar Skeleton ───────────────────────── */}
      <div className="flex flex-col gap-2 border-b px-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-8 w-[80px]" /> {/* Back button */}
          <Skeleton className="h-8 w-[100px]" /> {/* Toggle button */}
          <div className="flex flex-col gap-1 ml-2">
            <Skeleton className="h-4 w-[140px]" /> {/* Title */}
            <Skeleton className="h-3 w-[120px]" /> {/* Template */}
          </div>
        </div>
        {/* Right */}
        <Skeleton className="h-9 w-full sm:w-[140px]" /> {/* Download */}
      </div>

      {/* ── Split Layout ───────────────────────── */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel Skeleton */}
        <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r p-4 space-y-4">
          <Skeleton className="h-3 w-[80%]" />

          {/* Simulate form fields */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-[40%]" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>

        {/* Right Preview Skeleton */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full w-full border rounded-md p-4 space-y-4">
            {/* Header */}
            <Skeleton className="h-6 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />

            {/* Sections */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[30%]" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[90%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
