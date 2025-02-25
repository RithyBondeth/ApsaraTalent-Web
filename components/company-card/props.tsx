export interface ICompanyCardProps {
    name: string;
    description: string;
    avatar?: string;
    numberOfEmployees: number;
    location: string;
    openPositions: string[];
    availableTimes: string[];
    onViewClick: () => void;
    onSaveClick: () => void;
}