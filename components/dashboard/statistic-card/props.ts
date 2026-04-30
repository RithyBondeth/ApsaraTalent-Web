import {
  IRecentMatch,
  IWeeklyActivity,
} from "@/utils/interfaces/analytics/analytics.interface";
import { LucideIcon } from "lucide-react";

export interface IStatisticCardProps {
  icon: LucideIcon;
  value: number | IWeeklyActivity[] | IRecentMatch[];
  label: string;
  suffix?: string;
  color: string;
  bgColor: string;
}
