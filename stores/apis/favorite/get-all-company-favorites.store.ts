import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_FIND_ALL_COMPANY_FAVORITES } from "@/utils/constants/apis/favorite_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get All Company Favorites API Response ────────────────────────────
type TGetAllCompanyFavoritesResponse = {
  id: string;
  createdAt: string;
  userId: string;
  employee: IEmployee;
};

// ── Get All Company Favorites State ───────────────────────────────────
type TGetAllCompanyFavoritesState = {
  employeeData: TGetAllCompanyFavoritesResponse[] | null;
  loading: boolean;
  error: string | null;
  queryAllCompanyFavorites: (companyID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetAllCompanyFavoritesStore =
  create<TGetAllCompanyFavoritesState>((set) => ({
    employeeData: null,
    loading: false,
    error: null,
    queryAllCompanyFavorites: async (companyID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetAllCompanyFavoritesResponse[]>(
          API_FIND_ALL_COMPANY_FAVORITES(companyID),
        );
        set({ loading: false, error: null, employeeData: response.data });

        // Sync the persisted favoriteEmployeeIds Set so isFavorite() is accurate
        // On page load without requiring the user to re-save each item.
        const { useCompanyFavEmployeeStore } =
          await import("@/stores/apis/favorite/company-fav-employee.store");
        useCompanyFavEmployeeStore.setState({
          favoriteEmployeeIds: new Set(response.data.map((f) => f.employee.id)),
        });
      } catch (error) {
        set({
          loading: false,
          error: extractApiErrorMessage(
            error,
            "An error occurred while fetching all company's favorites",
          ),
        });
      }
    },
  }));
