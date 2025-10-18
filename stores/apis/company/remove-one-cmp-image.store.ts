import axios from "@/lib/axios";
import { API_REMOVE_ONE_CMP_IMAGE_URL } from "@/utils/constants/apis/company_url";
import { create } from "zustand";

type TRemoveOneCmpImageResponse = {
  message: string | null;
};

type TRemoveOneCmpImageState = TRemoveOneCmpImageResponse & {
  loading: boolean;
  error: string | null;
  removeOneCmpImage: (companyID: string, imageID: string) => Promise<void>;
};

export const useRemoveOneCmpImageStore = create<TRemoveOneCmpImageState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeOneCmpImage: async (companyID: string, imageID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.delete<TRemoveOneCmpImageResponse>(
          API_REMOVE_ONE_CMP_IMAGE_URL(companyID, imageID)
        );

        set({ message: response.data.message, error: null, loading: false });
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
            error: "An error occurred while removing company's image",
          });
        }
      }
    },
  })
);
