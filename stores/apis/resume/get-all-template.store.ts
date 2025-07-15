import { API_GET_ALL_TEMPLATE_URL } from "@/utils/constants/apis/resume_url";
import { IResumeTemplate } from "@/utils/interfaces/resume.interface";
import axios from "axios";
import { create } from "zustand";

type TGetAllTemplateState = {
  templateData: IResumeTemplate[] | null;
  error: string | null;
  loading: boolean;
  queryAllTemplates: (accessToken: string) => Promise<void>;
};

export const useGetAllTemplateStore = create<TGetAllTemplateState>((set) => ({
  templateData: null,
  loading: false,
  error: null,
  queryAllTemplates: async (accessToken: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IResumeTemplate[]>(
        API_GET_ALL_TEMPLATE_URL,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Template Response: ", response.data);
      set({ loading: false, error: null, templateData: response.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching all resume's templates",
        });
    }
  },
}));
