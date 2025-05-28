import { TGender } from "../../types/gender.type";
import { TPlatform } from "@/utils/types/platform.type";

export interface IEmployee {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
  gender: TGender;
  avatar?: string;
  phone: string;
  job: string;
  yearsOfExperience: number;
  availability: string;
  description: string;
  location?: string | null;
  resume?: string;
  coverLetter?: string;
  skills: ISkill[];
  experiences: IExperience[];
  educations: IEducation[];
  socials: ISocial[];
  careerScopes: ICareerScopes[];
  createdAt?: string;
}

export interface ICareerScopes {
  id?: string;
  name: string;
  description?: string;
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
export interface ISocial {
  id?: string;
  platform: TPlatform;
  url: string;
}

