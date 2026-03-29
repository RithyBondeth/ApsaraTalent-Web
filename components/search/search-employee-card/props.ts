import { TAvailability } from "@/utils/types/user";
import { TLocations } from "@/utils/types/user";

export interface ISearchEmployeeCardProps {
  id?: string;
  firstname: string;
  lastname: string;
  username?: string;
  avatar: string;
  job: string;
  yearOfExperience: number | string;
  availability: TAvailability;
  description: string;
  location: TLocations;
  skills: string[];
  education: string;
}
