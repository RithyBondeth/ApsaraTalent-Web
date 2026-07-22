import { Skeleton } from "@/components/ui/skeleton";

export function NavbarUserMenuSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex h-11 items-center gap-2 border border-border bg-card/60 px-2">
      <Skeleton className="h-7 w-7 shrink-0 rounded-none" />
      <div className="hidden flex-col gap-1 sm:flex">
        <Skeleton className="h-3 w-20 rounded-none sm:w-24" />
        <Skeleton className="h-2.5 w-12 rounded-none sm:w-14" />
      </div>
      <Skeleton className="hidden h-3 w-3 shrink-0 rounded-none sm:block" />
    </div>
  );
}
