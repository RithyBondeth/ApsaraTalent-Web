import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BadgePill from "../badge-pill";
import { IDesktopNavItemProps } from "./props";

export default function DesktopNavItem(props: IDesktopNavItemProps) {
  /* --------------------------------- Props --------------------------------- */
  const { href, icon: Icon, label, count, active } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("sidebar");
  const badgeLabel = t("badgeUnread", { count });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Link
      href={href}
      prefetch={true}
      aria-current={active ? "page" : undefined}
      /*
        The count has to live in the accessible name: aria-label overrides all
        inner content, so BadgePill's number was invisible to screen readers —
        the nav read as plain "Message" whether or not anything was waiting.
      */
      aria-label={count > 0 ? `${label}, ${badgeLabel}` : label}
      className={cn(
        "group relative flex h-11 min-w-11 items-center justify-center gap-2 border border-transparent px-2.5",
        "text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200",
        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "animate-navbar-active-in border-primary bg-primary text-primary-foreground shadow-hard-primary"
          : "text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground active:translate-y-px",
      )}
    >
      {/* Icon Section */}
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5",
            active && "text-background",
          )}
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>

      {/* Label Section */}
      <span className="hidden whitespace-nowrap 2xl:inline">{label}</span>

      {/* Compact-Mode Tooltip Section */}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-foreground bg-foreground px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-background opacity-0 shadow-hard-sm transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 2xl:hidden">
        {label}
      </span>

      {/* Active Edge Section */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[11px] left-1/2 h-[3px] -translate-x-1/2 bg-primary transition-[width,opacity] duration-200",
          active ? "w-6 opacity-100" : "w-0 opacity-0",
        )}
      />
    </Link>
  );
}
