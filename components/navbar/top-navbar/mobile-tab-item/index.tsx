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
      className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
    >
      <span className="relative">
        {/* Icon Section */}
        <Icon
          className={cn(
            "size-5 transition-colors duration-200",
            active
              ? "animate-nav-tab-bounce text-primary"
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
          "text-[10px] font-medium leading-none transition-colors duration-200",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
