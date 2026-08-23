import { TAnalyticsResponse } from "@/stores/apis/matching/analytics.store";
import {
  LucideBookmark,
  LucideHandshake,
  LucideHeart,
  LucideHeartHandshake,
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
// side — near-identical for two different metrics — and text-amber-500 on its
// own tint came to ~2:1, so the icon was barely visible.
export const statisticCardConstants: TStatisticCardConfig[] = [
  {
    key: "totalLikesGiven",
    translationKey: "likesGiven",
    icon: LucideHeart,
    color: "text-category-pink-accent",
    bgColor: "bg-category-pink-subtle",
  },
  {
    key: "totalLikesReceived",
    translationKey: "likesReceived",
    icon: LucideHeartHandshake,
    color: "text-category-purple-accent",
    bgColor: "bg-category-purple-subtle",
  },
  {
    key: "totalMatches",
    translationKey: "totalMatches",
    icon: LucideHandshake,
    color: "text-category-brown-accent",
    bgColor: "bg-category-brown-subtle",
  },
  {
    key: "totalFavorites",
    translationKey: "savedFavorites",
    icon: LucideBookmark,
    color: "text-category-blue-accent",
    bgColor: "bg-category-blue-subtle",
  },
];
