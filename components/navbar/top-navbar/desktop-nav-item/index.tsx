import { cn } from "@/lib/utils";
import Link from "next/link";
import BadgePill from "../badge-pill";
import { IDesktopNavItemProps } from "./props";

export default function DesktopNavItem(props: IDesktopNavItemProps) {
  /* --------------------------------- Props --------------------------------- */
  const { href, icon: Icon, label, count, active } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Link
      href={href}
      prefetch={true}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "group relative flex h-10 items-center gap-2 rounded-xl px-2 xl:px-3",
        "text-xs font-semibold transition-all duration-200",
        active
          ? "animate-navbar-active-in bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
      )}
    >
      {/* Icon Section */}
      <span className="relative">
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-all duration-200 group-hover:scale-105",
            active && "text-primary-foreground",
          )}
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>

      <span className="hidden whitespace-nowrap xl:inline">{label}</span>

      {/* Hover Tooltip Section */}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-foreground/90 px-2.5 py-1 text-[11px] font-medium text-background opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 xl:hidden">
        {label}
      </span>
    </Link>
  );
}
