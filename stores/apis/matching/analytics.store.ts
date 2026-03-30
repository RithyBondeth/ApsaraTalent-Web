import { API_GET_ANALYTICS_URL } from "@/utils/constants/apis/matching_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";
import {
  IRecentMatch,
  IWeeklyActivity,
} from "@/utils/interfaces/analytics/analytics.interface";

/* ---------------------------------- States --------------------------------- */
// ── Analytics API Response ──────────────────────────────────
export type TAnalyticsResponse = {
  totalLikesGiven: number;
  totalLikesReceived: number;
  totalMatches: number;
  matchRate: number;
  totalFavorites: number;
  weeklyActivity: IWeeklyActivity[];
  recentMatches: IRecentMatch[];
};

// ── Analytics State ────────────────────────────────────────
type TAnalyticsState = {
  data: TAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  queryAnalytics: (id: string, role: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useAnalyticsStore = create<TAnalyticsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  queryAnalytics: async (id: string, role: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<TAnalyticsResponse>(
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
