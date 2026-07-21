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
export const statisticCardConstants: TStatisticCardConfig[] = [
  {
    key: "totalLikesGiven",
    translationKey: "likesGiven",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "totalLikesReceived",
    translationKey: "likesReceived",
    icon: HeartHandshake,
    color: "text-primary/70",
    bgColor: "bg-primary/[0.07]",
  },
  {
    key: "totalMatches",
    translationKey: "totalMatches",
    icon: Handshake,
    color: "text-[hsl(var(--teal))]",
    bgColor: "bg-[hsl(var(--teal)/0.1)]",
  },
  {
    key: "totalFavorites",
    translationKey: "savedFavorites",
    icon: Bookmark,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];
