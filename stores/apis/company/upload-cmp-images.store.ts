import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPLOAD_CMP_IMAGES_URL } from "@/utils/constants/apis/company.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Upload Company Images API Response ─────────────────────────────────
type TUploadCompanyImagesResponse = {
  message: string | null;
};

// ── Upload Company Images State ────────────────────────────────────────
type TUploadCompanyImagesState = TUploadCompanyImagesResponse & {
  loading: boolean;
  error: string | null;
  uploadImages: (companyID: string, images: File[]) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
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
          },
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while uploading company's images",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
