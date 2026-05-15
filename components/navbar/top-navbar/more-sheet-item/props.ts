import type { LucideIcon } from "lucide-react";

export interface IMoreSheetItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}
