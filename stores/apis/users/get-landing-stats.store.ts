import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_LANDING_STATS_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get Landing Stats API Response ───────────────────────────────────────────
type TGetLandingStatsResponse = {
  users: number;
  companies: number;
  employees: number;
};

// ── Get Landing Stats Store State ────────────────────────────────────────────
type TGetLandingStatsStoreState = {
  stats: TGetLandingStatsResponse | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  getLandingStats: () => Promise<void>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useGetLandingStatsStore = create<TGetLandingStatsStoreState>(
  (set) => ({
    stats: null,
    loading: false,
    initialized: false,
    error: null,
    getLandingStats: async () => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetLandingStatsResponse>(
          API_GET_LANDING_STATS_URL,
        );

        set({
          stats: response.data,
          loading: false,
          initialized: true,
          error: null,
        });
      } catch (error) {
        set({
          stats: null,
          loading: false,
          initialized: true,
          error: extractApiErrorMessage(
            error,
            "An error occurred while fetching landing stats",
          ),
        });
      }
    },
  }),
);
