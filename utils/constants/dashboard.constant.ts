import { TAnalyticsData } from "@/stores/apis/matching/analytics.store";
import { Bookmark, Handshake, Heart, HeartHandshake } from "lucide-react";

type TStatisticCardConfig = {
  key: keyof TAnalyticsData;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
};

export const statisticCardConstants: TStatisticCardConfig[] = [
  {
    key: "totalLikesGiven",
    label: "Likes Given",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    key: "totalLikesReceived",
    label: "Likes Received",
    icon: HeartHandshake,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    key: "totalMatches",
    label: "Total Matches",
    icon: Handshake,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    key: "totalFavorites",
    label: "Saved Favorites",
    icon: Bookmark,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];
