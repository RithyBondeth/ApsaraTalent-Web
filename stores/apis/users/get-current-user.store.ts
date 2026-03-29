import axios from "@/lib/axios";
import { API_GET_CURRENT_USER_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { extractApiErrorMessage } from "../../_shared/api-error-message";
import { STORE_PERSIST_KEYS } from "../../_shared/persist-keys";

type TGetCurrentUserState = {
  loading: boolean;
  error: string | null;
  user: IUser | null;
  getCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

export const useGetCurrentUserStore = create<TGetCurrentUserState>()(
  persist(
    (set) => ({
      loading: false,
      error: null,
      user: null,

      getCurrentUser: async () => {
        set({ loading: true, error: null });

        try {
          const response = await axios.get<IUser>(API_GET_CURRENT_USER_URL);
          set({
            user: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            loading: false,
            error: extractApiErrorMessage(
              error,
              "Failed to fetch current user",
            ),
          });
        }
      },

      clearUser: () => {
        useGetCurrentUserStore.persist.clearStorage();
        set({
          user: null,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: STORE_PERSIST_KEYS.currentUser,
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
