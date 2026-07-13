import axios from "@/lib/axios";
import { API_GET_CURRENT_USER_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { IUser } from "@/utils/interfaces/user/user.interface";
import * as Sentry from "@sentry/nextjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { extractApiErrorMessage } from "../../shared/api-error-message";
import { STORE_PERSIST_KEYS } from "../../shared/persist-keys";

/* ---------------------------------- States --------------------------------- */
// ── Get Current User State ───────────────────────────────────
type TGetCurrentUserState = {
  loading: boolean;
  error: string | null;
  user: IUser | null;
  getCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
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
          // Identify the user in Sentry so errors show who was affected.
          // Only id + role — never email/name, to keep PII out of Sentry.
          Sentry.setUser({ id: response.data.id, role: response.data.role });
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
        Sentry.setUser(null);
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
      // getCurrentUser is only fetched on profile pages, so a returning user
      // is usually restored from localStorage — identify them then too.
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          Sentry.setUser({ id: state.user.id, role: state.user.role });
        }
      },
    },
  ),
);
