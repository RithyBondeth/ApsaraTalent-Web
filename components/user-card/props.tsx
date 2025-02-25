export interface IUserCardProps {
    avatar: string;
    name: string;
    job: string;
    location: string;
    skills: string[];
    description: string;
    resume: string;
    status: { label: string, value: string }[];
    yearsOfExperience: string;
    availability: string;
    educations: { school: string, degree: string }[];
    onViewClick: () => void;
    onSaveClick: () => void;
}