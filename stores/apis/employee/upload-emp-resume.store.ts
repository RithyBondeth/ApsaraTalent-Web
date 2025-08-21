import { API_UPLOAD_EMP_RESUME_URL } from "@/utils/constants/apis/employee_url";
import axios from "@/lib/axios";
import { create } from "zustand";

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

        const response = await axios.post<TUploadEmployeeResumeResponse>(
          API_UPLOAD_EMP_RESUME_URL(_employeeID),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while uploading employee's resume",
          });
        }
      }
    },
  })
);
