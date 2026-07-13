import { cn } from "@/lib/utils";
import Link from "next/link";
import BadgePill from "../badge-pill";
import { IMobileTabItemProps } from "./props";

export default function MobileTabItem(props: IMobileTabItemProps) {
  /* --------------------------------- Props --------------------------------- */
  const { href, icon: Icon, label, count, active, onClick } = props;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
    >
      {/* Capsule Pill Section */}
      <span className="relative flex flex-col items-center gap-0.5">
        <span
          className={cn(
            "relative flex items-center justify-center rounded-2xl transition-all duration-300",
            active
              ? "h-7 w-14 bg-gradient-to-b from-primary/20 to-primary/8 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
              : "h-7 w-7",
          )}
        >
          {/* Icon Section */}
          <Icon
            className={cn(
              "size-5 transition-all duration-200",
              active
                ? "animate-nav-tab-bounce text-primary [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.4))]"
                : "text-muted-foreground",
            )}
            strokeWidth={active ? 2.3 : 1.7}
          />

          {/* Badge Pill Section */}
          <BadgePill count={count} />
        </span>

        {/* Label Section */}
        <span
          className={cn(
            "text-[10px] leading-none transition-all duration-200",
            active
              ? "font-semibold text-primary"
              : "font-medium text-muted-foreground",
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
