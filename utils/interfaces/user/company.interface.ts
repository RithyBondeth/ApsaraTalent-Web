import { ICareerScope } from "./career.interface";
import { ISocialLink } from "./social.interface";

/**
 * Free text, not a union — `companyTypeConstant` is the list the UI suggests,
 * but employers outside it may enter their own. Matches the API contract.
 */
type TCompanyType = string;

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
  websiteUrl?: string | null;
  companyType?: TCompanyType | null;
  images?: IImage[];
  openPositions: IJobPosition[];
  availableTimes?: string[];
  values: IValues[];
  benefits: IBenefits[];
  careerScopes: ICareerScope[];
  socials: ISocialLink[];
  createdAt?: string;
  skillScore?: number | null;
  matchScore?: number | null;
}

export interface IBenefits {
  id?: number;
  label: string;
}

export interface IValues {
  id?: number;
  label: string;
}

type TJobWorkMode = "remote" | "on_site" | "hybrid" | "flexible";

export interface IJobPosition {
  id?: string;
  title: string;
  description: string;
  salary?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  workMode?: TJobWorkMode | null;
  location?: string | null;
  languagesRequired?: string[] | null;
  openingsCount?: number | null;
  type: string;
  experience: string;
  education: string;
  skills: string[];
  postedDate?: string;
  deadlineDate?: string | null;
}

export interface IImage {
  id?: string;
  image: string;
}
