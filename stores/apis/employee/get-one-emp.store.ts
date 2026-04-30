import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ONE_EMP_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get One Employee State ───────────────────────────────────
type TGetOneEmployeeState = {
  employeeData: IEmployee | null;
  loading: boolean;
  error: string | null;
  queryOneEmployee: (employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetOneEmployeeStore = create<TGetOneEmployeeState>((set) => ({
  employeeData: null,
  loading: false,
  error: null,
  queryOneEmployee: async (employeeID: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IEmployee>(
        API_GET_ONE_EMP_URL(employeeID),
      );
      set({ loading: false, error: null, employeeData: response.data });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(
          error,
          "An error occurred while fetching one employee.",
        ),
      });
    }
  },
}));
