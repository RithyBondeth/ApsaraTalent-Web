import { ICareerScope } from "@/utils/interfaces/career";
import { ISocialLink } from "@/utils/interfaces/social";
import { TGender } from "@/utils/types/user";

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
  skills: ISkill[];
  experiences: IExperience[];
  educations: IEducation[];
  socials: ISocialLink[];
  careerScopes: ICareerScope[];
  createdAt?: string;
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
