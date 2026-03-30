import { API_REMOVE_EMP_EDUCATION_URL } from "@/utils/constants/apis/employee_url";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Remove Employee Education API Response ──────────────────────────────
type TRemoveEmpEducationResponse = {
  message: string | null;
};

// ── Remove Employee Education State ──────────────────────────────────────
type TRemoveEducationStoreState = TRemoveEmpEducationResponse & {
  loading: boolean;
  error: string | null;
  removeEducation: (employeeID: string, educationID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useRemoveEmpEducationStore = create<TRemoveEducationStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeEducation: async (employeeID: string, educationID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.delete<TRemoveEmpEducationResponse>(
          API_REMOVE_EMP_EDUCATION_URL(employeeID, educationID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing employee's education.",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
