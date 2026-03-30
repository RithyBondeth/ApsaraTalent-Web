import { TAnalyticsResponse } from "@/stores/apis/matching/analytics.store";
import { Bookmark, Handshake, Heart, HeartHandshake } from "lucide-react";

type TStatisticCardConfig = {
  key: Extract<
    keyof TAnalyticsResponse,
    "totalLikesGiven" | "totalLikesReceived" | "totalMatches" | "totalFavorites"
  >;
  translationKey: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
};

export const statisticCardConstants: TStatisticCardConfig[] = [
  {
    key: "totalLikesGiven",
    translationKey: "likesGiven",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    key: "totalLikesReceived",
    translationKey: "likesReceived",
    icon: HeartHandshake,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    key: "totalMatches",
    translationKey: "totalMatches",
    icon: Handshake,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    key: "totalFavorites",
    translationKey: "savedFavorites",
    icon: Bookmark,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];
