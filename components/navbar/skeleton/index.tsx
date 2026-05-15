import { Skeleton } from "@/components/ui/skeleton";

export function NavbarUserMenuSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-1.5 rounded-xl px-1.5 py-1">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-3 w-3 rounded" />
    </div>
  );
}
