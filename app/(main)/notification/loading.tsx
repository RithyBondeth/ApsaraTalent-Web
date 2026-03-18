import { NotificationCardSkeleton } from "@/components/notification/notification-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationLoading() {
  return (
    <div className="w-full flex flex-col gap-3 p-5">
      <Skeleton className="h-8 w-48" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <NotificationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
