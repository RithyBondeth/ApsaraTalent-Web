import { API_COUNT_ALL_EMPLOYEE_FAVORITES } from "@/utils/constants/apis/favorite.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Employee Favorites API Response ─────────────────────────
type TCountCurrentEmployeeFavoriteResponse = {
  count: number;
};

// ── Count Current Employee Favorites State ────────────────────────────────
type TCountCurrentEmployeeFavoriteState = {
  totalEmpFavorites: number | null;
  loading: boolean;
  error: string | null;
  countCurrentEmpFavorites: (employeeId: string) => Promise<void>;
  /** Instantly +1 when the user saves a new favorite (avoids a re-fetch race). */
  incrementCount: () => void;
  /** Instantly -1 when a favorite is removed/auto-removed on like. */
  decrementCount: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentEmployeeFavoritesStore =
  create<TCountCurrentEmployeeFavoriteState>((set) => ({
    totalEmpFavorites: null,
    loading: false,
    error: null,
    incrementCount: () => {
      set((s) => ({ totalEmpFavorites: (s.totalEmpFavorites ?? 0) + 1 }));
    },

    decrementCount: () => {
      set((s) => ({
        totalEmpFavorites: Math.max(0, (s.totalEmpFavorites ?? 0) - 1),
      }));
    },

    countCurrentEmpFavorites: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeFavoriteResponse>(
          API_COUNT_ALL_EMPLOYEE_FAVORITES(employeeId),
        );

        set({
          totalEmpFavorites: response.data.count,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count all employee favorites",
          ),
          loading: false,
          totalEmpFavorites: null,
        });
      }
    },
  }));
