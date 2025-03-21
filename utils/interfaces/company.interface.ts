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
    openPositions: IJobPosition[];
    availableTimes: ILabelItem[];
    values: ILabelItem[];
    benefits: ILabelItem[];
}

export interface IJobPosition {
    id: number;
    title: string;
    description: string;
    salary: string;
    type: string;
    experience: string;
    education: string;
    skills: string[];
    postedDate: string;
    deadlineDate: string;
}

export interface ILabelItem {
    id: number;
    label: string;
}
