import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_AI_MATCH_EXPLANATION_URL } from "@/utils/constants/apis/matching.api.constant";
import { IAiMatchExplanationResponse } from "@/utils/interfaces/resume";
import { create } from "zustand";

/* ---------------------------------- State --------------------------------- */
type TAiMatchExplanationState = {
  loading: boolean;
  error: string | null;
  data: IAiMatchExplanationResponse | null;
  fetchMatchExplanation: (
    eid: string,
    cid: string,
  ) => Promise<IAiMatchExplanationResponse>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useAiMatchExplanationStore = create<TAiMatchExplanationState>(
  (set) => ({
    loading: false,
    error: null,
    data: null,
    fetchMatchExplanation: async (eid, cid) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get<IAiMatchExplanationResponse>(
          API_AI_MATCH_EXPLANATION_URL(eid, cid),
        );
        set({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "Failed to fetch match explanation",
        );
        set({ loading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }),
);
