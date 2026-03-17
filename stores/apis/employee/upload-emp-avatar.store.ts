import axios from "@/lib/axios";
import { API_UPLOAD_EMP_AVATAR_URL } from "@/utils/constants/apis/employee_url";
import { create } from "zustand";
import { useEmployeeSignupStore } from "../auth/employee-signup.store";

type TUploadEmployeeAvatarResponse = {
  message: string | null;
};

type TUploadEmployeeAvatarState = TUploadEmployeeAvatarResponse & {
  loading: boolean;
  error: string | null;
  uploadAvatar: (employeeID: string, avatar: File) => Promise<void>;
};

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

        const accessToken = useEmployeeSignupStore.getState().accessToken;

        const response = await axios.post<TUploadEmployeeAvatarResponse>(
          API_UPLOAD_EMP_AVATAR_URL(_employeeID),
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage, message: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while uploading employee's avatar",
            message: "An error occurred while uploading employee's avatar",
          });
        }
      }
    },
  }),
);
