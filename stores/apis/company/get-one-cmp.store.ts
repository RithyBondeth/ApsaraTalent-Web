import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ONE_CMP_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get One Company State ───────────────────────────────────
type TGetOneCompanyState = {
  companyData: ICompany | null;
  loading: boolean;
  error: string | null;
  queryOneCompany: (companyID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetOneCompanyStore = create<TGetOneCompanyState>((set) => ({
  companyData: null,
  loading: false,
  error: null,
  queryOneCompany: async (companyID: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<ICompany>(
        API_GET_ONE_CMP_URL(companyID),
      );
      set({ loading: false, error: null, companyData: response.data });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(
          error,
          "An error occurred while fetching one company",
        ),
      });
    }
  },
}));
