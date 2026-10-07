import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_EMPLOYER_ANALYTICS_URL } from "@/utils/constants/apis/job.api.constant";
import { IEmployerAnalytics } from "@/utils/interfaces/employer-analytics/employer-analytics.interface";
import { create } from "zustand";

/*
  One read-only slice for the employer's dashboard summary. Mirrors the
  profile-analytics store's shape: data | loading | loaded | error, fetch
  on mount, no cache invalidation — the recruiter re-opens the page to
  pull fresh numbers, which is the mental model that matches the rest of
  the dashboard.
*/

type TEmployerAnalyticsState = {
  data: IEmployerAnalytics | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  reset: () => void;
};

export const useEmployerAnalyticsStore = create<TEmployerAnalyticsState>(
  (set) => ({
    data: null,
    loading: false,
    loaded: false,
    error: null,

    reset: () =>
      set({ data: null, loading: false, loaded: false, error: null }),

    fetch: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get<IEmployerAnalytics>(
          API_EMPLOYER_ANALYTICS_URL,
        );
        set({ data: response.data, loading: false, loaded: true });
      } catch (error) {
        set({
          loading: false,
          loaded: true,
          error: extractApiErrorMessage(
            error,
            "Failed to load employer analytics",
          ),
        });
      }
    },
  }),
);
