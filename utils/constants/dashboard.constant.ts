import { TAnalyticsResponse } from "@/stores/apis/matching/analytics.store";
import {
  Bookmark,
  Handshake,
  Heart,
  HeartHandshake,
  LucideIcon,
} from "lucide-react";

/* ---------------------------------- Types --------------------------------- */
type TStatisticCardConfig = {
  key: Extract<
    keyof TAnalyticsResponse,
    "totalLikesGiven" | "totalLikesReceived" | "totalMatches" | "totalFavorites"
  >;
  translationKey: string;
  icon: LucideIcon;
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
    icon: Heart,
    color: "text-category-magenta-accent",
    bgColor: "bg-category-magenta-subtle",
  },
  {
    key: "totalLikesReceived",
    translationKey: "likesReceived",
    icon: HeartHandshake,
    color: "text-category-violet-accent",
    bgColor: "bg-category-violet-subtle",
  },
  {
    key: "totalMatches",
    translationKey: "totalMatches",
    icon: Handshake,
    color: "text-category-teal-accent",
    bgColor: "bg-category-teal-subtle",
  },
  {
    key: "totalFavorites",
    translationKey: "savedFavorites",
    icon: Bookmark,
    color: "text-category-orange-accent",
    bgColor: "bg-category-orange-subtle",
  },
];
