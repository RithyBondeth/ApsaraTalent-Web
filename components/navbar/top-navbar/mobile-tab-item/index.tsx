import { cn } from "@/lib/utils";
import Link from "next/link";
import BadgePill from "../badge-pill";
import { IMobileTabItemProps } from "./props";

export default function MobileTabItem(props: IMobileTabItemProps) {
  /* --------------------------------- Props --------------------------------- */
  const { href, icon: Icon, label, count, badgeLabel, active, onClick } = props;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      /*
        The count has to live in the accessible name: aria-label overrides all
        inner content, so BadgePill's number was invisible to screen readers —
        the nav read as plain "Message" whether or not anything was waiting.
      */
      aria-label={count > 0 ? `${label}, ${badgeLabel}` : label}
      className={cn(
        "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {/* Active Edge Section */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-0 h-[3px] -translate-x-1/2 bg-primary transition-[width,opacity] duration-200",
          active ? "w-8 opacity-100" : "w-0 opacity-0",
        )}
      />

      {/* Icon Section */}
      <span className="relative flex flex-col items-center gap-1">
        <span
          className={cn(
            "relative flex h-8 w-9 items-center justify-center border transition-[background-color,border-color,color,transform] duration-200",
            active
              ? "border-primary bg-primary text-primary-foreground shadow-hard-primary-xs"
              : "border-transparent group-hover:border-border group-hover:bg-muted/60 group-active:translate-y-px",
          )}
        >
          <Icon
            className={cn(
              "size-[18px] transition-transform duration-200",
              active ? "animate-nav-tab-bounce text-background" : "",
            )}
            strokeWidth={active ? 2.3 : 1.7}
          />

          {/* Badge Pill Section */}
          <BadgePill count={count} />
        </span>

        {/* Label Section */}
        <span
          className={cn(
            "max-w-[4.5rem] truncate text-[10px] leading-none transition-colors duration-200",
            active
              ? "font-bold text-foreground"
              : "font-medium text-muted-foreground",
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
