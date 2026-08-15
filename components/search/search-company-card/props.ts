import { TLocations } from "@/utils/types/user/location.type";

export interface ISearchCompanyCardProps {
  id?: string;
  title: string;
  description: string;
  type: string;
  /** Legacy free-text range; only used when the structured fields are absent. */
  salary?: string | null;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string | null;
  experience: string;
  education: string;
  skills: string[];
  deadlineDate?: string;
  postedDate: string;
  company: {
    id?: string;
    name: string;
    avatar?: string;
    companySize: number;
    industry: string;
    location: TLocations;
  };
}
