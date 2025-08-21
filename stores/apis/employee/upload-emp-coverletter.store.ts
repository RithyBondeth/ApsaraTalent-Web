import { API_UPLOAD_EMP_COVER_LETTER_URL } from "@/utils/constants/apis/employee_url";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUploadEmployeeCoverLetterResponse = {
  message: string | null;
};

type TUploadEmployeeCoverLetterState = TUploadEmployeeCoverLetterResponse & {
  loading: boolean;
  error: string | null;
  uploadCoverLetter: (employeeID: string, coverLetter: File) => Promise<void>;
};

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

        const response = await axios.post<TUploadEmployeeCoverLetterResponse>(
          API_UPLOAD_EMP_COVER_LETTER_URL(_employeeID),
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
            error: "An error occurred while uploading employee's cover letter",
          });
        }
      }
    },
  }));
