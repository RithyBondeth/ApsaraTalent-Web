import { ResumeTemplate } from "@/utils/interfaces/resume.interface";
export type { ResumeTemplate };
import { getUnifiedAccessToken } from "@/utils/auth/get-access-token";
import { API_RESUME_BUILDER_URL } from "@/utils/constants/apis/resume_url";
import axios from "axios";

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
  const token = getUnifiedAccessToken();

  const response = await axios.post(API_RESUME_BUILDER_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    responseType: "json",
  });

  return response.data;
}
