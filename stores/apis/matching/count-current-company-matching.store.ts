import { API_COUNT_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

const STORAGE_KEY = (id: string) => `matching-seen:cmp:${id}`;

const readSeen = (companyId: string): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY(companyId)) ?? "0", 10);
};

/* ---------------------------------- States --------------------------------- */
// ── Count Current Company Matching API Response ─────────────────
type TCountCurrentCompanyMatchingResponse = {
  count: number;
};

// ── Count Current Company Matching State ────────────────────────
type TCountCurrentCompanyMatchingState = {
  totalCmpMatching: number | null;
  seenCmpMatching: number;
  loading: boolean;
  error: string | null;
  countCurrentCmpMatching: (companyID: string) => Promise<void>;
  markAsSeen: (companyId: string) => void;
  /** Bump total by 1 when a new match arrives via socket. */
  incrementCount: () => void;
  /** Reduce total by 1 when an unmatch is confirmed. */
  decrementCount: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentCompanyMatchingStore =
  create<TCountCurrentCompanyMatchingState>((set, get) => ({
    totalCmpMatching: null,
    seenCmpMatching: 0,
    loading: false,
    error: null,

    incrementCount: () => {
      set((s) => ({ totalCmpMatching: (s.totalCmpMatching ?? 0) + 1 }));
    },

    decrementCount: () => {
      set((s) => ({
        totalCmpMatching: Math.max(0, (s.totalCmpMatching ?? 0) - 1),
        seenCmpMatching: Math.max(0, s.seenCmpMatching - 1),
      }));
    },

    markAsSeen: (companyId: string) => {
      const count = get().totalCmpMatching ?? 0;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY(companyId), String(count));
      }
      set({ seenCmpMatching: count });
    },

    countCurrentCmpMatching: async (companyID: string) => {
      const seen = readSeen(companyID);
      set({ seenCmpMatching: seen, loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyID),
        );

        set({
          totalCmpMatching: response.data.count,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count current company matching",
          ),
          loading: false,
          totalCmpMatching: null,
        });
      }
    },
  }));
