import { Skeleton } from "@/components/ui/skeleton";

export default function SearchCompanyLoading() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-muted rounded-md">
          <Skeleton className="size-14 rounded-md shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}
