import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer pointer-events-none select-none rounded-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
