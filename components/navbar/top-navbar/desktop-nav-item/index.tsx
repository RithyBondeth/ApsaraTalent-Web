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
      className={cn(
        "group relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2",
        "text-xs font-medium transition-colors duration-150",
        active
          ? "animate-navbar-active-in bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <span className="relative">
        <Icon
          className="size-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>

      {/* Hover Tooltip Section */}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
        {label}
      </span>

      {/* Active Indicator Section */}
      {active && (
        <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-foreground/70 animate-nav-indicator-in" />
      )}
    </Link>
  );
}
