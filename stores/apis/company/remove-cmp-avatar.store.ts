import axios from "@/lib/axios";
import { API_REMOVE_CMP_AVATAR_URL } from "@/utils/constants/apis/company_url";
import { create } from "zustand";

type TRemoveCmpAvatarResponse = {
  message: string | null;
};

type TRemoveCmpAvatarStoreState = TRemoveCmpAvatarResponse & {
  loading: boolean;
  error: string | null;
  removeCmpAvatar: (companyID: string) => Promise<void>;
};

export const useRemoveCmpAvatarStore = create<TRemoveCmpAvatarStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeCmpAvatar: async (companyID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveCmpAvatarResponse>(
          API_REMOVE_CMP_AVATAR_URL(companyID)
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
            error: "An error occurred while removing company's avatar",
          });
        }
      }
    },
  })
);
