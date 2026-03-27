import {
  TRecentMatch,
  TWeeklyActivity,
} from "@/stores/apis/matching/analytics.store";
import { ElementType } from "react";

export interface IStatisticCardProps {
  icon: ElementType;
  value: number | TWeeklyActivity[] | TRecentMatch[];
  label: string;
  suffix?: string;
  color: string;
  bgColor: string;
}
