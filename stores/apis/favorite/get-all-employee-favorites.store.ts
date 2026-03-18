import axios from "@/lib/axios";
import { API_FIND_ALL_EMPLOYEE_FAVORITES } from "@/utils/constants/apis/favorite_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { create } from "zustand";

export type TGetAllEmployeeFavoritesResponse = {
  id: string;
  createdAt: string;
  userId: string;
  company: ICompany;
};

export type TGetAllEmployeeFavoritesState = {
  companyData: TGetAllEmployeeFavoritesResponse[] | null;
  loading: boolean;
  error: string | null;
  queryAllEmployeeFavorites: (employeeID: string) => Promise<void>;
};

export const useGetAllEmployeeFavoritesStore =
  create<TGetAllEmployeeFavoritesState>((set) => ({
    companyData: null,
    loading: false,
    error: null,
    queryAllEmployeeFavorites: async (employeeID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetAllEmployeeFavoritesResponse[]>(
          API_FIND_ALL_EMPLOYEE_FAVORITES(employeeID),
        );
        set({ loading: false, error: null, companyData: response.data });

        // Sync the persisted favoriteCompanyIds Set so isFavorite() is accurate
        // on page load without requiring the user to re-save each item.
        const { useEmployeeFavCompanyStore } = await import(
          "@/stores/apis/favorite/employee-fav-company.store"
        );
        useEmployeeFavCompanyStore.setState({
          favoriteCompanyIds: new Set(response.data.map((f) => f.company.id)),
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while fetching all employee's favorites",
          });
        }
      }
    },
  }));
