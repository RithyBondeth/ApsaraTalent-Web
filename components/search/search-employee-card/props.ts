import { TAvailability } from "@/utils/types/user/availability.type";
import { TLocations } from "@/utils/types/user/location.type";

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
