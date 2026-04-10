import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPLOAD_EMP_COVER_LETTER_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { create } from "zustand";
import { useEmployeeSignupStore } from "../auth/employee-signup.store";

/* ---------------------------------- States --------------------------------- */
// ── Upload Employee Cover Letter API Response ──────────────────────────────
type TUploadEmployeeCoverLetterResponse = {
  message: string | null;
};

// ── Upload Employee Cover Letter State ──────────────────────────────────────
type TUploadEmployeeCoverLetterState = TUploadEmployeeCoverLetterResponse & {
  loading: boolean;
  error: string | null;
  uploadCoverLetter: (employeeID: string, coverLetter: File) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useUploadEmployeeCoverLetter =
  create<TUploadEmployeeCoverLetterState>((set) => ({
    message: null,
    loading: false,
    error: null,
    uploadCoverLetter: async (_employeeID: string, _coverLetter: File) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        formData.append("coverLetter", _coverLetter);

        const accessToken = useEmployeeSignupStore.getState().accessToken;

        const response = await axios.post<TUploadEmployeeCoverLetterResponse>(
          API_UPLOAD_EMP_COVER_LETTER_URL(_employeeID),
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while uploading employee's cover letter",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }));
