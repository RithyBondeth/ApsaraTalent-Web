import { IJobPosition } from "@/utils/interfaces/user-interface/company.interface";

export interface IMatchingCompanyCardProps {
    avatar: string;
    name: string;
    industry: string;
    founded: number;
    description: string;
    openPosition: IJobPosition[];
    companySize: number;
    location: string;
    onChatNowClick: () => void;
}