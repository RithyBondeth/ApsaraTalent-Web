import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_MY_PRIVACY_URL,
  API_MY_PROFILE_ANALYTICS_URL,
} from "@/utils/constants/apis/user-api/user.api.constant";
import {
  IProfileAnalytics,
  IUpdatePrivacyPayload,
} from "@/utils/interfaces/profile-analytics/profile-analytics.interface";
import { create } from "zustand";

/*
  One slice for the "who viewed your profile" summary and the sole privacy
  toggle that goes with it. Kept together because the browsePrivately flag
  is returned by the analytics read, so a fresh read reflects the flip
  without a second round trip.
*/

type TProfileAnalyticsState = {
  data: IProfileAnalytics | null;
  loading: boolean;
  loaded: boolean;
  savingPrivacy: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  updatePrivacy: (payload: IUpdatePrivacyPayload) => Promise<boolean>;
  reset: () => void;
};

export const useProfileAnalyticsStore = create<TProfileAnalyticsState>(
  (set) => ({
    data: null,
    loading: false,
    loaded: false,
    savingPrivacy: false,
    error: null,

    reset: () =>
      set({
        data: null,
        loading: false,
        loaded: false,
        savingPrivacy: false,
        error: null,
      }),

    fetch: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get<IProfileAnalytics>(
          API_MY_PROFILE_ANALYTICS_URL,
        );
        set({ data: response.data, loading: false, loaded: true });
      } catch (error) {
        set({
          loading: false,
          loaded: true,
          error: extractApiErrorMessage(
            error,
            "Failed to load profile analytics",
          ),
        });
      }
    },

    updatePrivacy: async (payload) => {
      set({ savingPrivacy: true, error: null });
      try {
        const response = await axios.patch<{ browsePrivately: boolean }>(
          API_MY_PRIVACY_URL,
          payload,
        );
        set((state) => ({
          savingPrivacy: false,
          data: state.data
            ? { ...state.data, browsePrivately: response.data.browsePrivately }
            : state.data,
        }));
        return true;
      } catch (error) {
        set({
          savingPrivacy: false,
          error: extractApiErrorMessage(error, "Failed to update privacy"),
        });
        return false;
      }
    },
  }),
);
