import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-9 w-[160px] rounded-lg" />
      </div>

      {/* Interview Cards Section */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[140px]" />
            </div>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-[80px] rounded-md" />
            <Skeleton className="h-8 w-[80px] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
