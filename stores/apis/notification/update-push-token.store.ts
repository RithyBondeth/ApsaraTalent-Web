import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPDATE_PUSH_TOKEN_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { create } from "zustand";

/* ---------------------------------- State --------------------------------- */
type TUpdatePushTokenState = {
  loading: boolean;
  error: string | null;
  updatePushToken: (token: string) => Promise<void>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useUpdatePushTokenStore = create<TUpdatePushTokenState>((set) => ({
  loading: false,
  error: null,
  updatePushToken: async (token) => {
    set({ loading: true, error: null });
    try {
      await axios.post(API_UPDATE_PUSH_TOKEN_URL, { token });
      set({ loading: false, error: null });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to update push token",
      );
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
