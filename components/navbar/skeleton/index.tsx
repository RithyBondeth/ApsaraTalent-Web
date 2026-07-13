import { Skeleton } from "@/components/ui/skeleton";

export function NavbarUserMenuSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-2 py-1.5">
      <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-20 rounded sm:w-28" />
        <Skeleton className="h-2.5 w-12 rounded sm:w-16" />
      </div>
      <Skeleton className="h-3 w-3 shrink-0 rounded" />
    </div>
  );
}
