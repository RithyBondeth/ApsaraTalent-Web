import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPLOAD_CMP_COVER_URL } from "@/utils/constants/apis/company_url";
import { create } from "zustand";
import { useCompanySignupStore } from "../auth/company-signup.store";

/* ---------------------------------- States --------------------------------- */
// ── Upload Company Cover API Response ─────────────────────────────────
type TUploadCompanyCoverResponse = {
  message: string | null;
};

// ── Upload Company Cover State ────────────────────────────────────────
type TUploadCompanyCoverState = TUploadCompanyCoverResponse & {
  loading: boolean;
  error: string | null;
  uploadCover: (companyID: string, cover: File) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
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

        const accessToken = useCompanySignupStore.getState().accessToken;

        const response = await axios.post<TUploadCompanyCoverResponse>(
          API_UPLOAD_CMP_COVER_URL(_companyID),
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
          "An error occurred while uploading company's cover",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
