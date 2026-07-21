import { Skeleton } from "@/components/ui/skeleton";

export function NavbarUserMenuSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-1.5 pr-2 shadow-[0_1px_3px_hsl(var(--foreground)/0.04)]">
      <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
      <div className="flex flex-col gap-1 phone-xl:hidden">
        <Skeleton className="h-3 w-20 rounded sm:w-28" />
        <Skeleton className="h-2.5 w-12 rounded sm:w-16" />
      </div>
      <Skeleton className="h-3 w-3 shrink-0 rounded" />
    </div>
  );
}
