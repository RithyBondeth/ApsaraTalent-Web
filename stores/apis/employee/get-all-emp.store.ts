import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ALL_EMP_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get All Employee Response ───────────────────────────────────
type TGetAllEmployeeResponse = IEmployee[];

// ── Get All Employee State ──────────────────────────────────────
type TGetAllEmployeeState = {
  employeesData: TGetAllEmployeeResponse | null;
  loading: boolean;
  error: string | null;
  queryEmployee: () => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetAllEmployeeStore = create<TGetAllEmployeeState>((set) => ({
  employeesData: null,
  loading: false,
  error: null,
  queryEmployee: async () => {
    set({ loading: true, error: null });

    try {
      const response =
        await axios.get<TGetAllEmployeeResponse>(API_GET_ALL_EMP_URL);
      set({ loading: false, error: null, employeesData: response.data });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(
          error,
          "An error occurred while fetching all employees.",
        ),
      });
    }
  },
}));
