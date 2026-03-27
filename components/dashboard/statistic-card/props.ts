import {
  TRecentMatch,
  TWeeklyActivity,
} from "@/stores/apis/matching/analytics.store";
import { ElementType, JSX } from "react";

export interface IStatisticCardProps {
  icon: ElementType<any, keyof JSX.IntrinsicElements>;
  value: number | TWeeklyActivity[] | TRecentMatch[];
  label: string;
  suffix?: string;
  color: string;
  bgColor: string;
}
