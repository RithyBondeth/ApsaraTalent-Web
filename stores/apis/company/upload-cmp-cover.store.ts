import { API_UPLOAD_CMP_COVER_URL } from "@/utils/constants/apis/company_url";
import axios from "axios";
import { create } from "zustand";

type TUploadCompanyCoverResponse = {
  message: string | null;
};

type TUploadCompanyCoverState = TUploadCompanyCoverResponse & {
  loading: boolean;
  error: string | null;
  uploadCover: (companyID: string, cover: File) => Promise<void>;
};

export const useUploadCompanyCoverStore = create<TUploadCompanyCoverState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    uploadCover: async (_companyID: string, _cover: File) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        formData.append("cover", _cover);

        const response = await axios.post<TUploadCompanyCoverResponse>(
          API_UPLOAD_CMP_COVER_URL(_companyID),
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
            error: "An error occurred while uploading company's cover",
          });
        }
      }
    },
  })
);
