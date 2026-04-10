import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_REMOVE_CMP_AVATAR_URL } from "@/utils/constants/apis/company.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Remove Cmp Avatar API Response ─────────────────────────────────
type TRemoveCmpAvatarResponse = {
  message: string | null;
};

// ── Remove Cmp Avatar State ────────────────────────────────────────
type TRemoveCmpAvatarStoreState = TRemoveCmpAvatarResponse & {
  loading: boolean;
  error: string | null;
  removeCmpAvatar: (companyID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useRemoveCmpAvatarStore = create<TRemoveCmpAvatarStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeCmpAvatar: async (companyID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveCmpAvatarResponse>(
          API_REMOVE_CMP_AVATAR_URL(companyID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing company's avatar",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
