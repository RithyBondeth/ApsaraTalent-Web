import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_CHAT_INITIATE_URL } from "@/utils/constants/apis/chat.api.constant";
import { IInitiateChatResponse } from "@/utils/interfaces/chat/chat.interface";
import { create } from "zustand";

/* ---------------------------------- State --------------------------------- */
type TInitiateChatState = {
  loading: boolean;
  error: string | null;
  data: IInitiateChatResponse | null;
  initiateChat: (
    senderId: string,
    receiverId: string,
  ) => Promise<IInitiateChatResponse>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useInitiateChatStore = create<TInitiateChatState>((set) => ({
  loading: false,
  error: null,
  data: null,
  initiateChat: async (senderId, receiverId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<IInitiateChatResponse>(
        API_CHAT_INITIATE_URL,
        { senderId, receiverId },
      );
      set({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to initiate chat",
      );
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
