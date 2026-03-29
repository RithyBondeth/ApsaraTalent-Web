import { Skeleton } from "@/components/ui/skeleton";

export default function SettingLoadingSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-5 p-5">
      {/* Setting Loading Skeleton Header Section */}
      <Skeleton className="h-8 w-48" />

      {/* Setting Loading Skeleton Content Section */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
