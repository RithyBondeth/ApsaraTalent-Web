import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { API_GET_ALL_EMP_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { create } from "zustand";

type TGetAllEmployeeState = {
  employeesData: IEmployee[] | null;
  loading: boolean;
  error: string | null;
  queryEmployee: () => Promise<void>;
};

export const useGetAllEmployeeStore = create<TGetAllEmployeeState>((set) => ({
  employeesData: null,
  loading: false,
  error: null,
  queryEmployee: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IEmployee[]>(API_GET_ALL_EMP_URL);
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
