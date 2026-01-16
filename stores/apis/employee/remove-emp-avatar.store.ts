import { API_REMOVE_EMP_AVATAR_URL } from "@/utils/constants/apis/employee_url";
import axios from "axios";
import { create } from "zustand";

type TRemoveEmpAvatarResponse = {
  message: string | null;
};

type TRemoveEmpAvatarStoreState = TRemoveEmpAvatarResponse & {
  loading: boolean;
  error: string | null;
  removeEmpAvatar: (employeeID: string) => Promise<void>;
};

export const useRemoveEmpAvatarStore = create<TRemoveEmpAvatarStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeEmpAvatar: async (employeeID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveEmpAvatarResponse>(
          API_REMOVE_EMP_AVATAR_URL(employeeID)
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.joi(", ")
              : error.request.data.message || error.message;

          set({ loading: true, error: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while removing employee's avatar"
          })
        }
      }
    },
  })
);
