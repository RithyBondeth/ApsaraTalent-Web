import { API_REMOVE_EMP_EXPERIENCE_URL } from "@/utils/constants/apis/employee_url";
import axios from "axios";
import { create } from "zustand";

type TRemoveEmpExperienceResponse = {
  message: string | null;
};

type TRemoveEmpExperienceStoreState = TRemoveEmpExperienceResponse & {
  loading: boolean;
  error: string | null;
  removeExperience: (employeeID: string, experienceID: string) => Promise<void>;
};

export const useRemoveEmpExperienceStore =
  create<TRemoveEmpExperienceStoreState>((set) => ({
    message: null,
    loading: false,
    error: null,
    removeExperience: async (employeeID: string, experienceID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.delete<TRemoveEmpExperienceResponse>(
          API_REMOVE_EMP_EXPERIENCE_URL(employeeID, experienceID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage, message: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while removing employee's experience.",
            message: "An error occurred while removing employee's experience.",
          });
        }
      }
    },
  }));
