import { TAnalyticsResponse } from "@/stores/apis/matching/analytics.store";
import type { TPixelGlyph } from "@/components/utils/brand/pixel-icon/glyphs";

/* ---------------------------------- Types --------------------------------- */
type TStatisticCardConfig = {
  key: Extract<
    keyof TAnalyticsResponse,
    "totalLikesGiven" | "totalLikesReceived" | "totalMatches" | "totalFavorites"
  >;
  translationKey: string;
  icon: TPixelGlyph;
  color: string;
  bgColor: string;
  suffix?: string;
};

/* -------------------------------- Constants ------------------------------- */
// Four metrics, four categorical hues. Previously rose and pink sat side by
// side — near-identical for two different metrics — and a raw amber swatch on its
// own tint came to ~2:1, so the icon was barely visible.
export const statisticCardConstants: TStatisticCardConfig[] = [
  {
    key: "totalLikesGiven",
    translationKey: "likesGiven",
    icon: "heart",
    color: "text-category-magenta-accent",
    bgColor: "bg-category-magenta-subtle",
  },
  {
    key: "totalLikesReceived",
    translationKey: "likesReceived",
    icon: "match",
    color: "text-category-violet-accent",
    bgColor: "bg-category-violet-subtle",
  },
  {
    key: "totalMatches",
    translationKey: "totalMatches",
    icon: "users",
    color: "text-category-teal-accent",
    bgColor: "bg-category-teal-subtle",
  },
  {
    key: "totalFavorites",
    translationKey: "savedFavorites",
    icon: "bookmark",
    color: "text-category-orange-accent",
    bgColor: "bg-category-orange-subtle",
  },
];
