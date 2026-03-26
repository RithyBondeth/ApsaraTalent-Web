import { API_GET_ANALYTICS_URL } from "@/utils/constants/apis/matching_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { create } from "zustand";

export type TWeeklyActivity = {
  day: string;
  likes: number;
  received: number;
  matches: number;
};

export type TRecentMatch = {
  id: string;
  name: string;
  avatar: string | null;
  matchedAt: string;
};

export type TAnalyticsData = {
  totalLikesGiven: number;
  totalLikesReceived: number;
  totalMatches: number;
  matchRate: number;
  totalFavorites: number;
  weeklyActivity: TWeeklyActivity[];
  recentMatches: TRecentMatch[];
};

type TAnalyticsState = {
  data: TAnalyticsData | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: (id: string, role: string) => Promise<void>;
};

export const useAnalyticsStore = create<TAnalyticsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchAnalytics: async (id: string, role: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<TAnalyticsData>(
        API_GET_ANALYTICS_URL(id, role),
      );

      set({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to fetch analytics"),
        loading: false,
        data: null,
      });
    }
  },
}));
