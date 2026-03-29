import { RESUME_GENERATION_TIMEOUT_MS } from "@/utils/constants/config.constant";
import { API_RESUME_BUILDER_URL } from "@/utils/constants/apis/resume_url";
import { IBuildResume } from "@/utils/interfaces/resume-interface/resume.interface";
import axios from "@/lib/axios";

export async function generateResumeAPI(payload: IBuildResume) {
  try {
    const response = await axios.post(API_RESUME_BUILDER_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      timeout: RESUME_GENERATION_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ||
        error.message ||
        "Failed to build resume";
      throw new Error(apiMessage);
    }
    throw error;
  }
}
