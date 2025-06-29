import { TAvailability } from "@/utils/types/availability.type";
import { TLocations } from "@/utils/types/location.type";

export type TSearchEmployeeCardProps = {
    id?: string;
    firstname: string;
    lastname: string;
    username?: string;
    avatar: string;
    job: string;
    yearOfExperience: number;
    availability: TAvailability;
    description: string;
    location: TLocations;
    skills: string[];
    education: string;
}