import axiosInstance from "@/lib/axios";
import { API_CHAT_INITIATE_URL } from "@/utils/constants/apis/chat_url";

interface IInitateChatResponse {
  chatId: string;
  id: string; // receiver's resolved User.id — used as chatId in the message page
  name: string;
  avatar: string;
}

export const initateChat = async (
  senderId: string,
  receiverId: string,
): Promise<IInitateChatResponse> => {
  const response = await axiosInstance.post<IInitateChatResponse>(
    API_CHAT_INITIATE_URL,
    { senderId, receiverId },
  );
  // The backend returns `id` = the receiver's User.id (resolved from employee/company ID).
  // The message page uses chatId as userId2 for getChatHistory socket call.
  return response.data;
};
