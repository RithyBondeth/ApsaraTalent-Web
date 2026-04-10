import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_REMOVE_ONE_CMP_IMAGE_URL } from "@/utils/constants/apis/company.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Remove One Cmp Image API Response ─────────────────────────────────
type TRemoveOneCmpImageResponse = {
  message: string | null;
};

// ── Remove One Cmp Image State ────────────────────────────────────────
type TRemoveOneCmpImageState = TRemoveOneCmpImageResponse & {
  loading: boolean;
  error: string | null;
  removeOneCmpImage: (companyID: string, imageID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useRemoveOneCmpImageStore = create<TRemoveOneCmpImageState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeOneCmpImage: async (companyID: string, imageID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.delete<TRemoveOneCmpImageResponse>(
          API_REMOVE_ONE_CMP_IMAGE_URL(companyID, imageID),
        );

        set({ message: response.data.message, error: null, loading: false });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing company's image",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
