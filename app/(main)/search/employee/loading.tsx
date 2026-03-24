import { Skeleton } from "@/components/ui/skeleton";

export default function SearchEmployeeLoading() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
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
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
