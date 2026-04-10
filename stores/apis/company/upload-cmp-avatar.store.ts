import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPLOAD_CMP_AVATAR_URL } from "@/utils/constants/apis/company.api.constant";
import { create } from "zustand";
import { useCompanySignupStore } from "../auth/company-signup.store";

/* ---------------------------------- States --------------------------------- */
// ── Upload Company Avatar API Response ─────────────────────────────────
type TUploadCompanyAvatarResponse = {
  message: string | null;
};

// ── Upload Company Avatar State ────────────────────────────────────────
type TUploadCompanyAvatarState = TUploadCompanyAvatarResponse & {
  loading: boolean;
  error: string | null;
  uploadAvatar: (companyID: string, avatar: File) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useUploadCompanyAvatarStore = create<TUploadCompanyAvatarState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    uploadAvatar: async (_companyID: string, _avatar: File) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        formData.append("avatar", _avatar);

        const accessToken = useCompanySignupStore.getState().accessToken;

        const response = await axios.post<TUploadCompanyAvatarResponse>(
          API_UPLOAD_CMP_AVATAR_URL(_companyID),
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
          "An error occurred while uploading company's avatar",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
