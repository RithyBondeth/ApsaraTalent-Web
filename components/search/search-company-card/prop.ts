import { TLocations } from "@/utils/types/location.type";

export type TSearchCompanyCardProps = {
    id?: string;
    title: string;
    description: string;
    type: string;
    salary: string;
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
    }
}