import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UNMATCH_URL } from "@/utils/constants/apis/matching.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Unmatch API Response ──────────────────────────────────────────────────
type TUnmatchResponse = {
  message: string | null;
};
// ── Unmatch State ──────────────────────────────────────────────────────────
type TUnmatchState = TUnmatchResponse & {
  unmatchLoading: boolean;
  unmatchingId: string | null;
  unmatchError: string | null;
  unmatch: (
    employeeId: string,
    companyId: string,
    isEmployee: boolean,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useUnmatchStore = create<TUnmatchState>((set) => ({
  unmatchingId: null,
  message: null,
  unmatchError: null,
  unmatchLoading: false,
  unmatch: async (
    employeeId: string,
    companyId: string,
    isEmployee: boolean,
  ) => {
    const otherId = isEmployee ? companyId : employeeId;
    set({ unmatchingId: otherId, unmatchError: null, unmatchLoading: true });

    try {
      const response = await axios.delete<TUnmatchResponse>(
        API_UNMATCH_URL(employeeId, companyId),
      );
      set({
        unmatchingId: null,
        message: response.data.message,
        unmatchLoading: false,
      });
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err, "Failed to unmatch");
      set({
        unmatchingId: null,
        unmatchError: errorMessage,
        message: errorMessage,
        unmatchLoading: false,
      });
    }
  },
}));
