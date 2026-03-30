import { ICareerScope } from "@/utils/interfaces/career-option.interface";
import { ISocialLink } from "@/utils/interfaces/social.interface";

export interface ICompany {
  id: string;
  name: string;
  industry: string;
  email: string | null;
  description: string;
  avatar?: string;
  cover?: string;
  companySize: number;
  foundedYear: number;
  location: string;
  phone: string;
  images?: IImage[];
  openPositions: IJobPosition[];
  availableTimes?: string[];
  values: IValues[];
  benefits: IBenefits[];
  careerScopes: ICareerScope[];
  socials: ISocialLink[];
  createdAt?: string;
}

export interface IBenefits {
  id?: number;
  label: string;
}

export interface IValues {
  id?: number;
  label: string;
}

export interface IJobPosition {
  id?: string;
  title: string;
  description: string;
  salary: string;
  type: string;
  experience: string;
  education: string;
  skills: string[];
  postedDate?: string;
  deadlineDate: string;
}

export interface IImage {
  id?: string;
  image: string;
}
