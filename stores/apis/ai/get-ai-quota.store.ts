import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_AI_QUOTA_URL } from "@/utils/constants/apis/ai.api.constant";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
// ── AI Quota Response ─────────────────────────────────────────
export type TAiQuota = {
  daily: {
    used: number;
    limit: number;
    remaining: number;
  };
  /** ISO timestamp (UTC) when the daily quota resets. */
  resetsAt: string;
};

// ── AI Quota State ────────────────────────────────────────────
type TAiQuotaState = {
  loading: boolean;
  error: string | null;
  data: TAiQuota | null;
  /** Fetch the current user's AI usage for today. */
  fetchQuota: () => Promise<void>;
};

/* --------------------------------- Store ---------------------------------- */
export const useAiQuotaStore = create<TAiQuotaState>((set) => ({
  loading: false,
  error: null,
  data: null,

  fetchQuota: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get<TAiQuota>(API_AI_QUOTA_URL);
      set({ data, loading: false });
    } catch (error) {
      set({ error: extractApiErrorMessage(error), loading: false });
    }
  },
}));
