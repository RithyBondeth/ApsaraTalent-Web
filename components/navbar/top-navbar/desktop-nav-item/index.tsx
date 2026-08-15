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
        "group relative flex h-full min-w-11 items-center justify-center gap-2 border-l border-border px-4",
        "pixel-label transition-[background-color,color] duration-200",
        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "animate-navbar-active-in bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {/* Icon Section */}
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <Icon
          className={cn("size-[18px] shrink-0", active && "text-background")}
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>

      {/* Label Section */}
      <span className="hidden whitespace-nowrap 2xl:inline">{label}</span>

      {/* Compact-Mode Tooltip Section */}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-foreground bg-foreground px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-background opacity-0 shadow-[3px_3px_0_hsl(var(--foreground)/0.12)] transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 2xl:hidden">
        {label}
      </span>
    </Link>
  );
}
