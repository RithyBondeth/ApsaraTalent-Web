import { API_UPLOAD_CMP_AVATAR_URL } from "@/utils/constants/apis/company_url";
import axios from "@/lib/axios";
import { create } from "zustand";

type TUploadCompanyAvatarResponse = {
  message: string | null;
};

type TUploadCompanyAvatarState = TUploadCompanyAvatarResponse & {
  loading: boolean;
  error: string | null;
  uploadAvatar: (companyID: string, avatar: File) => Promise<void>;
};

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

        const response = await axios.post<TUploadCompanyAvatarResponse>(
          API_UPLOAD_CMP_AVATAR_URL(_companyID),
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
            error: "An error occurred while uploading company's avatar",
          });
        }
      }
    },
  })
);
