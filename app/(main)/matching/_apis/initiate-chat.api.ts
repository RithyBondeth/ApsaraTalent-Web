import axiosInstance from "@/lib/axios";
import { API_CHAT_INITIATE_URL } from "@/utils/constants/apis/chat_url";
import { IInitiateChatResponse } from "@/utils/interfaces/chat";

export const initateChat = async (
  senderId: string,
  receiverId: string,
): Promise<IInitiateChatResponse> => {
  const response = await axiosInstance.post<IInitiateChatResponse>(
    API_CHAT_INITIATE_URL,
    { senderId, receiverId },
  );
  // The backend returns `id` = the receiver's User.id (resolved from employee/company ID).
  // The message page uses chatId as userId2 for getChatHistory socket call.
  return response.data;
};
