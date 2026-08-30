import {
  API_COUNT_CURRENT_COMPANY_MATCHING_URL,
  API_MARK_COMPANY_MATCHING_SEEN_URL,
} from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Company Matching API Response ─────────────────
type TCountCurrentCompanyMatchingResponse = {
  count: number;
  unseenCount: number;
};

// ── Count Current Company Matching State ────────────────────────
type TCountCurrentCompanyMatchingState = {
  totalCmpMatching: number | null;
  /**
   * Matches this company has not opened yet — the badge number, as reported by
   * the server.
   *
   * This replaced a `matching-seen:cmp:<id>` high-water mark in localStorage
   * that the badge was derived from by subtraction. That mark only ever grew,
   * so every unmatch left it above the real total and pinned the badge to zero
   * for good, and it never followed the user to another device.
   */
  unseenCmpMatching: number;
  loading: boolean;
  error: string | null;
  countCurrentCmpMatching: (companyID: string) => Promise<void>;
  /** Re-read the counts after a realtime signal. Safe to call repeatedly. */
  refreshCmpMatchingCount: (companyID: string) => Promise<void>;
  /** Stamp every match seen server-side; the response carries the new counts. */
  markAsSeen: (companyId: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentCompanyMatchingStore =
  create<TCountCurrentCompanyMatchingState>((set) => ({
    totalCmpMatching: null,
    unseenCmpMatching: 0,
    loading: false,
    error: null,

    markAsSeen: async (companyId: string) => {
      try {
        const response = await axios.post<TCountCurrentCompanyMatchingResponse>(
          API_MARK_COMPANY_MATCHING_SEEN_URL(companyId),
        );
        set({
          totalCmpMatching: response.data.count,
          unseenCmpMatching: response.data.unseenCount,
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

    refreshCmpMatchingCount: async (companyID: string) => {
      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyID),
        );
        set({
          totalCmpMatching: response.data.count,
          unseenCmpMatching: response.data.unseenCount,
        });
      } catch {
        // A background refresh must never clobber a good number with an error.
      }
    },

    countCurrentCmpMatching: async (companyID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyID),
        );

        set({
          totalCmpMatching: response.data.count,
          unseenCmpMatching: response.data.unseenCount,
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
          unseenCmpMatching: 0,
        });
      }
    },
  }));
