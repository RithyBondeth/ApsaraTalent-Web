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
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl p-4 transition-all",
        active ? "bg-accent shadow-sm" : "bg-muted/50 hover:bg-muted",
      )}
    >
      <span className="relative">
        {/* Icon Section */}
        <Icon
          className={cn(
            "size-6",
            active ? "text-primary" : "text-foreground/80",
          )}
          strokeWidth={active ? 2.3 : 1.7}
        />

        {/* Badge Pill Section */}
        <BadgePill count={count} />
      </span>

      {/* Label Section */}
      <span
        className={cn(
          "text-center text-xs font-medium",
          active ? "text-primary" : "text-foreground/80",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
