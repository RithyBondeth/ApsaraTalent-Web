import { TResumeTemplate } from "@/utils/types/resume.type";

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  profilePicture?: string;
  socials?: Record<string, string>;
  job?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface IBuildResume {
  personalInfo: IPersonalInfo;
  summary?: string;
  yearsOfExperience?: string;
  availability?: string;
  experience: IExperience[];
  skills: string[];
  education?: string;
  careerScopes?: string[];
  template: TResumeTemplate;
}
