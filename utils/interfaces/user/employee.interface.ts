import { ICareerScope } from "./career.interface";
import { ISocialLink } from "./social.interface";
import { TGender } from "@/utils/types/user/gender.type";

export type TWorkMode = "remote" | "on_site" | "hybrid" | "flexible";
export type TNoticePeriod = "immediate" | "2_weeks" | "1_month";

export interface IEmployee {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  dob?: string | null;
  username?: string | null;
  gender: TGender;
  avatar?: string;
  phone: string;
  email: string | null;
  job: string;
  yearsOfExperience: string;
  availability: string;
  description: string;
  location?: string | null;
  resume?: string;
  coverLetter?: string;
  workMode?: TWorkMode | null;
  noticePeriod?: TNoticePeriod | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  languages?: string[] | null;
  expectedSalaryMin?: number | null;
  expectedSalaryMax?: number | null;
  skills: ISkill[];
  experiences: IExperience[];
  educations: IEducation[];
  socials: ISocialLink[];
  careerScopes: ICareerScope[];
  createdAt?: string;
  skillScore?: number | null;
}

export interface ISkill {
  id?: string;
  name: string;
  description?: string;
}

export interface IExperience {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface IEducation {
  id?: string;
  school: string;
  degree: string;
  year: string;
}
