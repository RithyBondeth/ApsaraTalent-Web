import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_CURRENT_EMPLOYEE_LIKED_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get Current Employee Liked API Response ────────────────────────
type TGetCurrentEmployeeLikedResponse = ICompany[];

// ── Get Current Employee Liked State ───────────────────────────────
type TGetCurrentEmployeeLikedState = {
  currentEmployeeLiked: TGetCurrentEmployeeLikedResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentEmployeeLiked: (employeeID: string) => Promise<void>;
  /** Optimistically add a company to the liked list so the card disappears instantly */
  optimisticAddLiked: (company: ICompany) => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetCurrentEmployeeLikedStore =
  create<TGetCurrentEmployeeLikedState>((set, get) => ({
    currentEmployeeLiked: null,
    loading: false,
    error: null,
    optimisticAddLiked: (company: ICompany) => {
      const current = get().currentEmployeeLiked ?? [];
      if (!current.some((c) => c.id === company.id)) {
        set({ currentEmployeeLiked: [...current, company] });
      }
    },

    queryCurrentEmployeeLiked: async (employeeID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentEmployeeLikedResponse>(
          API_GET_CURRENT_EMPLOYEE_LIKED_URL(employeeID),
        );

        set({
          currentEmployeeLiked: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to get current employee liked",
          ),
          loading: false,
          currentEmployeeLiked: null,
        });
      }
    },
  }));
