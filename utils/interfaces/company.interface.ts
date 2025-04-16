export interface ICompany {
    id: number;
    name: string;
    industry: string;
    description: string;
    avatar: string;
    cover: string;
    companySize: number;
    foundedYear: number;
    location: string;
    email: string;
    password: string;
    phone: string;
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    telegram: string;
    images: string[];
    openPositions: IJobPosition[];
    availableTimes: string[];
    values: string[];
    benefits: string[];
    careerScopes: string[];
    socials: ISocial[];
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

export interface ISocial {
    id?: number;
    social: string;
    link: string;
}
