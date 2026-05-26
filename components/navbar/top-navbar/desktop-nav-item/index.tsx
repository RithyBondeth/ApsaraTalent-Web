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
        "group relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2",
        "text-xs font-medium transition-all duration-200",
        active
          ? "animate-navbar-active-in bg-gradient-to-b from-primary/15 to-primary/5 text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_2px_8px_hsl(var(--primary)/0.08)]"
          : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
      )}
    >
      {/* Icon Section */}
      <span className="relative">
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:scale-110",
            active && "[filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.5))]",
          )}
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>

      {/* Hover Tooltip Section */}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-foreground/90 px-2.5 py-1 text-[11px] font-medium text-background opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}
