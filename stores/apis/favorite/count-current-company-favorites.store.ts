import { API_COUNT_ALL_COMPANY_FAVORITES } from "@/utils/constants/apis/favorite.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Company Favorites API Response ─────────────────────────
type TCountCurrentCompanyFavoriteResponse = {
  count: number;
};

// ── Count Current Company Favorites State ────────────────────────────────
type TCountCurrentCompanyFavoriteState = {
  totalCmpFavorites: number | null;
  loading: boolean;
  error: string | null;
  countCurrentCmpFavorites: (companyId: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentCompanyFavoritesStore =
  create<TCountCurrentCompanyFavoriteState>((set) => ({
    totalCmpFavorites: null,
    loading: false,
    error: null,
    countCurrentCmpFavorites: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyFavoriteResponse>(
          API_COUNT_ALL_COMPANY_FAVORITES(companyId),
        );

        set({
          totalCmpFavorites: response.data.count,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count all company favorites",
          ),
          loading: false,
          totalCmpFavorites: null,
        });
      }
    },
  }));
