import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { getApiOrigin } from "@/utils/functions/media";
import { create } from "zustand";

/* ---------------------------------- State ---------------------------------- */
type TGetRecentChatsState = {
  loading: boolean;
  error: string | null;
  fetchRecentChats: () => Promise<unknown[]>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useGetRecentChatsStore = create<TGetRecentChatsState>((set) => ({
  loading: false,
  error: null,
  fetchRecentChats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${getApiOrigin()}/chat/recent`);
      set({ loading: false, error: null });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to get recent chats",
      );
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
