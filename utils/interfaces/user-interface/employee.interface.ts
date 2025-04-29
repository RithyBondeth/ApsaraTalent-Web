import { TGender } from "../../types/gender.type";

export interface IEmployee {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  gender: TGender;
  avatar?: string | null;
  phone: string; //hide
  job: string;
  yearsOfExperience: string;
  availability: string;
  description: string;
  location: string;
  resume?: string;
  coverLetter?: string;
  skills: ISkill[];
  status: {
      id: number;
      label: string;
      value: string;
  }[];
  experiences: IExperience[];
  educations: IEducation[];
  socials: ISocial[];
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
export interface ISocial {
  id?: string;
  platform: string;
  url: string;
}

