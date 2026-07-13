import type { LucideIcon } from "lucide-react";

export interface IDesktopNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
}
