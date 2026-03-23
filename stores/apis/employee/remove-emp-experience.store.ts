import { API_REMOVE_EMP_EXPERIENCE_URL } from "@/utils/constants/apis/employee_url";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
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
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing employee's experience.",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }));
