import axios from "axios";
import { getUnifiedAccessToken } from "@/utils/auth/get-access-token";
import { API_RESUME_BUILDER_URL } from "@/utils/constants/apis/resume_url";

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  socials?: Record<string, string>;
  job?: string;
};

export type Experience = {
  company: string;
  position: string;
  startDate: string; // Format: MM/DD/YYYY
  endDate?: string; // Format: MM/DD/YYYY or null
  description: string;
  achievements: string[];
};

export type ResumeTemplate = "modern" | "classic" | "creative";

export type BuildResume = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: string[];
  education?: string;
  template: ResumeTemplate;
};

export async function generateResumeAPI(payload: BuildResume) {
  const token = getUnifiedAccessToken();

  const response = await axios.post(
    API_RESUME_BUILDER_URL,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "json",
    }
  );

  return response.data;
}
