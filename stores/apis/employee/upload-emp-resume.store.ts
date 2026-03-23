import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { API_UPLOAD_EMP_RESUME_URL } from "@/utils/constants/apis/employee_url";
import { create } from "zustand";
import { useEmployeeSignupStore } from "../auth/employee-signup.store";

type TUploadEmployeeResumeResponse = {
  message: string | null;
};

type TUploadEmployeeAvatarState = TUploadEmployeeResumeResponse & {
  loading: boolean;
  error: string | null;
  uploadResume: (employeeID: string, resume: File) => Promise<void>;
};

export const useUploadEmployeeResumeStore = create<TUploadEmployeeAvatarState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    uploadResume: async (_employeeID: string, _resume: File) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        formData.append("resume", _resume);

        const accessToken = useEmployeeSignupStore.getState().accessToken;

        const response = await axios.post<TUploadEmployeeResumeResponse>(
          API_UPLOAD_EMP_RESUME_URL(_employeeID),
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
          "An error occurred while uploading employee's resume",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
