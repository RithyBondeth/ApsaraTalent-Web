import {
  API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL,
  API_MARK_EMPLOYEE_MATCHING_SEEN_URL,
} from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Employee Matching API Response ─────────────────
type TCountCurrentEmployeeMatchingResponse = {
  count: number;
  unseenCount: number;
};

// ── Count Current Employee Matching State ────────────────────────
type TCountCurrentEmployeeMatchingState = {
  totalEmpMatching: number | null;
  /**
   * Matches this employee has not opened yet — the badge number, as reported by
   * the server.
   *
   * This replaced a `matching-seen:emp:<id>` high-water mark in localStorage
   * that the badge was derived from by subtraction. That mark only ever grew,
   * so every unmatch left it above the real total and pinned the badge to zero
   * for good, and it never followed the user to another device.
   */
  unseenEmpMatching: number;
  loading: boolean;
  error: string | null;
  countCurrentEmpMatching: (employeeID: string) => Promise<void>;
  /** Re-read the counts after a realtime signal. Safe to call repeatedly. */
  refreshEmpMatchingCount: (employeeID: string) => Promise<void>;
  /** Stamp every match seen server-side; the response carries the new counts. */
  markAsSeen: (employeeId: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentEmployeeMatchingStore =
  create<TCountCurrentEmployeeMatchingState>((set) => ({
    totalEmpMatching: null,
    unseenEmpMatching: 0,
    loading: false,
    error: null,

    markAsSeen: async (employeeId: string) => {
      try {
        const response =
          await axios.post<TCountCurrentEmployeeMatchingResponse>(
            API_MARK_EMPLOYEE_MATCHING_SEEN_URL(employeeId),
          );
        set({
          totalEmpMatching: response.data.count,
          unseenEmpMatching: response.data.unseenCount,
        });
      } catch {
        /*
          Left deliberately quiet. Failing to record "seen" means the badge
          stays up, which is the safe direction to fail in — it will clear on
          the next visit. Surfacing an error here would put a toast in front of
          someone who only navigated to a page.
        */
      }
    },

    refreshEmpMatchingCount: async (employeeID: string) => {
      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeID),
        );
        set({
          totalEmpMatching: response.data.count,
          unseenEmpMatching: response.data.unseenCount,
        });
      } catch {
        // A background refresh must never clobber a good number with an error.
      }
    },

    countCurrentEmpMatching: async (employeeID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeID),
        );

        set({
          totalEmpMatching: response.data.count,
          unseenEmpMatching: response.data.unseenCount,
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
          unseenEmpMatching: 0,
        });
      }
    },
  }));
