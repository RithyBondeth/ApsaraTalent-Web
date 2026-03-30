import { API_COUNT_ALL_EMPLOYEE_FAVORITES } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Employee Favorites API Response ─────────────────────────
type TCountCurrentEmployeeFavoriteResponse = {
  totalFavorites: number;
};

// ── Count Current Employee Favorites State ────────────────────────────────
type TCountCurrentEmployeeFavoriteState = {
  totalEmpFavorites: number | null;
  loading: boolean;
  error: string | null;
  countCurrentEmpFavorites: (employeeId: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentEmployeeFavoritesStore =
  create<TCountCurrentEmployeeFavoriteState>((set) => ({
    totalEmpFavorites: null,
    loading: false,
    error: null,
    countCurrentEmpFavorites: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeFavoriteResponse>(
          API_COUNT_ALL_EMPLOYEE_FAVORITES(employeeId),
        );

        set({
          totalEmpFavorites: response.data.totalFavorites,
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
