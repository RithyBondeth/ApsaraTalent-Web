import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ONE_USER_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user/user.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get One User State ───────────────────────────────────────
type TGetOneUserState = {
  error: string | null;
  loading: boolean;
  user: IUser | null;
  getOneUerByID: (userID: string) => Promise<void>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useGetOneUserStore = create<TGetOneUserState>((set) => ({
  error: null,
  loading: false,
  user: null,
  getOneUerByID: async (userID: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IUser>(API_GET_ONE_USER_URL(userID));
      set({ user: response.data, loading: false, error: null });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(
          error,
          "An error occurred while fetching a user.",
        ),
      });
    }
  },
}));
