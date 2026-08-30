import type { LucideIcon } from "lucide-react";

export interface IMoreSheetItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  /** Screen-reader phrasing for the badge — see getBadgeLabel in TopNavbar. */
  badgeLabel: string;
  active: boolean;
  onClick: () => void;
}
