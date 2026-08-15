import {
  IRecentMatch,
  IWeeklyActivity,
} from "@/utils/interfaces/analytics/analytics.interface";
import type { TPixelGlyph } from "@/components/utils/brand/pixel-icon/glyphs";

export interface IStatisticCardProps {
  icon: TPixelGlyph;
  value: number | IWeeklyActivity[] | IRecentMatch[];
  label: string;
  suffix?: string;
  color: string;
  bgColor: string;
}
