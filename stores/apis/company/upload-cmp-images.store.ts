import { API_UPLOAD_CMP_IMAGES_URL } from "@/utils/constants/apis/company_url";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUploadCompanyImagesResponse = {
  message: string | null;
};

type TUploadCompanyImagesState = TUploadCompanyImagesResponse & {
  loading: boolean;
  error: string | null;
  uploadImages: (companyID: string, images: File[]) => Promise<void>;
};

export const useUploadCompanyImagesStore = create<TUploadCompanyImagesState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    uploadImages: async (_companyID: string, _images: File[]) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        _images.forEach((image) => {
          formData.append("images", image);
        });

        const response = await axios.post<TUploadCompanyImagesResponse>(
          API_UPLOAD_CMP_IMAGES_URL(_companyID),
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
            error: "An error occurred while uploading company's images",
          });
        }
      }
    },
  })
);
