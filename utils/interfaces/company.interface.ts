export interface ICompany {
    id: number;
    name: string;
    industry: string;
    description: string;
    avatar: string;
    companySize: number;
    foundedYear: number;
    location: string;
    email: string;
    phone: string;
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    telegram: string;
    images: string[];
    openPositions: JobPosition[];
    availableTimes: LabelItem[];
    values: LabelItem[];
    benefits: LabelItem[];
}

export interface JobPosition {
    id: number;
    title: string;
    description: string;
    salary: string;
    type: string;
    experience: string;
    education: string;
    skills: string[];
}

export interface LabelItem {
    id: number;
    label: string;
}
