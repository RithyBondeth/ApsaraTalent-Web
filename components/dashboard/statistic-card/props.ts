import {
  IRecentMatch,
  IWeeklyActivity,
} from "@/utils/interfaces/analytics.interface";
import { ElementType } from "react";

export interface IStatisticCardProps {
  icon: ElementType;
  value: number | IWeeklyActivity[] | IRecentMatch[];
  label: string;
  suffix?: string;
  color: string;
  bgColor: string;
}
