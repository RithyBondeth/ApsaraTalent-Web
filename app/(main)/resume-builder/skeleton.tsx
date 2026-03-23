import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeBuilderLoadingSkeleton() {
  return Array.from({ length: 12 }, (_, index) => (
    <TemplateCardSkeleton key={index} />
  ));
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
