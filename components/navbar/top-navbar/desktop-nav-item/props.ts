import type { LucideIcon } from "lucide-react";

export interface IDesktopNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  /** Screen-reader phrasing for the badge — see getBadgeLabel in TopNavbar. */
  badgeLabel: string;
  active: boolean;
}
