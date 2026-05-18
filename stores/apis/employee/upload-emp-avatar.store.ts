import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_UPLOAD_EMP_AVATAR_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Upload Employee Avatar API Response ──────────────────────────────────
type TUploadEmployeeAvatarResponse = {
  message: string | null;
};

// ── Upload Employee Avatar State ────────────────────────────────────────
type TUploadEmployeeAvatarState = TUploadEmployeeAvatarResponse & {
  loading: boolean;
  error: string | null;
  uploadAvatar: (employeeID: string, avatar: File) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useUploadEmployeeAvatarStore = create<TUploadEmployeeAvatarState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    uploadAvatar: async (_employeeID: string, _avatar: File) => {
      set({ loading: true, error: null });

      try {
        const formData = new FormData();
        formData.append("avatar", _avatar);

        const response = await axios.post<TUploadEmployeeAvatarResponse>(
          API_UPLOAD_EMP_AVATAR_URL(_employeeID),
          formData,
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while uploading employee's avatar",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }),
);
