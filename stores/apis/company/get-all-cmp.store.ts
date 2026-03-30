import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ALL_CMP_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get All Company Response ───────────────────────────────────
type TGetAllCompanyResponse = ICompany[];

// ── Get All Company State ──────────────────────────────────────
type TGetAllCompanyState = {
  companyData: TGetAllCompanyResponse | null;
  loading: boolean;
  error: string | null;
  queryCompany: () => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetAllCompanyStore = create<TGetAllCompanyState>((set) => ({
  companyData: null,
  loading: false,
  error: null,
  queryCompany: async () => {
    set({ loading: true, error: null });

    try {
      const response =
        await axios.get<TGetAllCompanyResponse>(API_GET_ALL_CMP_URL);
      set({ loading: false, error: null, companyData: response.data });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(
          error,
          "An error occurred while fetching all companies",
        ),
      });
    }
  },
}));
