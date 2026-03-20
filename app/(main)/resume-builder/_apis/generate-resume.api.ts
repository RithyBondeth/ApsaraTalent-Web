import { ResumeTemplate } from "@/utils/interfaces/resume.interface";
export type { ResumeTemplate };
import { API_RESUME_BUILDER_URL } from "@/utils/constants/apis/resume_url";
import axios from "@/lib/axios";

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  profilePicture?: string;
  socials?: Record<string, string>;
  job?: string;
};

export type Experience = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
};

export type BuildResume = {
  personalInfo: PersonalInfo;
  summary?: string;
  yearsOfExperience?: string;
  availability?: string;
  experience: Experience[];
  skills: string[];
  education?: string;
  careerScopes?: string[];
  template: ResumeTemplate;
};

export async function generateResumeAPI(payload: BuildResume) {
  try {
    const response = await axios.post(API_RESUME_BUILDER_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      timeout: 180000,
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
