import { cn } from "@/lib/utils";
import Link from "next/link";
import BadgePill from "../badge-pill";
import { IMoreSheetItemProps } from "./props";

export default function MoreSheetItem(props: IMoreSheetItemProps) {
  /* --------------------------------- Props --------------------------------- */
  const { href, icon: Icon, label, count, active, onClick } = props;

  /* ------------------------------- Render UI -------------------------------- */
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-20 items-center gap-3 border p-3 transition-[background-color,border-color,color,transform]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-foreground/35 hover:bg-muted/60 active:translate-y-px",
      )}
    >
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center border",
          active
            ? "border-background/25 bg-background/10"
            : "border-border bg-muted/60",
        )}
      >
        {/* Icon Section */}
        <Icon
          className={cn(
            /* One --pixel-unit sideways, not half a step up: hover motion in
               this UI is horizontal. */
            "ease-[cubic-bezier(0.4,0,0.2,1)] size-[18px] transition-transform duration-300 group-hover:translate-x-1",
            active ? "text-background" : "text-foreground/80",
          )}
          strokeWidth={active ? 2.3 : 1.7}
        />

        {/* Badge Pill Section */}
        <BadgePill count={count} />
      </span>

      {/* Label Section */}
      <span
        className={cn(
          "min-w-0 text-left text-xs font-medium leading-snug",
          active ? "text-background" : "text-foreground/80",
        )}
      >
        {label}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "ml-auto text-sm transition-transform duration-200 group-hover:translate-x-0.5",
          active ? "text-background/70" : "text-muted-foreground",
        )}
      >
        →
      </span>
    </Link>
  );
}
