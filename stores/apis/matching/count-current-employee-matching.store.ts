import { API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

const STORAGE_KEY = (id: string) => `matching-seen:emp:${id}`;

const readSeen = (employeeId: string): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY(employeeId)) ?? "0", 10);
};

/* ---------------------------------- States --------------------------------- */
// ── Count Current Employee Matching API Response ─────────────────
type TCountCurrentEmployeeMatchingResponse = {
  count: number;
};

// ── Count Current Employee Matching State ────────────────────────
type TCountCurrentEmployeeMatchingState = {
  totalEmpMatching: number | null;
  seenEmpMatching: number;
  loading: boolean;
  error: string | null;
  countCurrentEmpMatching: (employeeID: string) => Promise<void>;
  markAsSeen: (employeeId: string) => void;
  /** Bump total by 1 when a new match arrives via socket. */
  incrementCount: () => void;
  /** Reduce total by 1 when an unmatch is confirmed. */
  decrementCount: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentEmployeeMatchingStore =
  create<TCountCurrentEmployeeMatchingState>((set, get) => ({
    totalEmpMatching: null,
    seenEmpMatching: 0,
    loading: false,
    error: null,

    incrementCount: () => {
      set((s) => ({ totalEmpMatching: (s.totalEmpMatching ?? 0) + 1 }));
    },

    decrementCount: () => {
      set((s) => ({
        totalEmpMatching: Math.max(0, (s.totalEmpMatching ?? 0) - 1),
        seenEmpMatching: Math.max(0, s.seenEmpMatching - 1),
      }));
    },

    markAsSeen: (employeeId: string) => {
      const count = get().totalEmpMatching ?? 0;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY(employeeId), String(count));
      }
      set({ seenEmpMatching: count });
    },

    countCurrentEmpMatching: async (employeeID: string) => {
      const seen = readSeen(employeeID);
      set({ seenEmpMatching: seen, loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeID),
        );

        set({
          totalEmpMatching: response.data.count,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count current employee matching",
          ),
          loading: false,
          totalEmpMatching: null,
        });
      }
    },
  }));
