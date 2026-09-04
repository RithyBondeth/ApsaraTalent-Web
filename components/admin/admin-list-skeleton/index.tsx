import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IAdminListSkeletonProps } from "./props";

/**
 * The loading shape shared by every admin list page — users, jobs, reports,
 * problem reports, audit.
 *
 * Every list page used to build this inline with `Array.from(...).map(...)`
 * and a bespoke height, which drifted: five pages used four different row
 * counts (4, 6, 6, 4, 8) with heights an admin never actually sees rendered.
 * A single component means the visual promise is one thing that can be
 * changed in one place. The rest of the loading shape — banner, error, empty
 * — is handled by the caller, since those decisions are per-page.
 */
export function AdminListSkeleton(props: IAdminListSkeletonProps) {
  /* --------------------------------- Props ---------------------------------- */
  const { count = 5, rowClassName = "h-24" } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cn(rowClassName, "w-full")} />
      ))}
    </div>
  );
}
