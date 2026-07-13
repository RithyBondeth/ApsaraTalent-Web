import type { LucideIcon } from "lucide-react";

export interface IMobileTabItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick?: () => void;
}
