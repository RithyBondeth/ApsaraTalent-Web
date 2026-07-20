import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_AI_QUOTA_URL } from "@/utils/constants/apis/ai.api.constant";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
// ── AI Quota Bucket ───────────────────────────────────────────
export type TAiQuotaBucket = {
  used: number;
  limit: number;
  remaining: number;
};

/** AI actions that carry their own daily cap on top of the global quota. */
export type TAiQuotaAction = "cvGeneration";

// ── AI Quota Response ─────────────────────────────────────────
export type TAiQuota = {
  daily: TAiQuotaBucket;
  actions: Record<TAiQuotaAction, TAiQuotaBucket>;
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
  /**
   * Re-sync after an AI call finished (or was rejected). Kept separate from
   * `fetchQuota` so it can refresh silently — no loading flash on a badge the
   * user is already looking at.
   */
  refreshAfterUse: () => Promise<void>;
};

/* --------------------------------- Store ---------------------------------- */
export const useAiQuotaStore = create<TAiQuotaState>((set, get) => ({
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

  refreshAfterUse: async () => {
    // Never surface an error here: a failed refresh should leave the last known
    // figure on screen rather than blanking the badge mid-flow.
    if (get().loading) return;
    try {
      const { data } = await axios.get<TAiQuota>(API_AI_QUOTA_URL);
      set({ data });
    } catch {
      // keep the previous snapshot
    }
  },
}));
