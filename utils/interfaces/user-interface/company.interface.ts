export interface ICompany {
    id: string;
    name: string;
    industry: string;
    description: string;
    avatar?: string | null;
    cover?: string;
    companySize: number;
    foundedYear: number;
    location: string;
    phone: string;
    images?: IImage[];
    openPositions: IJobPosition[];
    availableTimes: string[];
    values: IValues[];
    benefits: IBenefits[];
    careerScopes: ICareerScopes[];
    socials: ISocial[];
    createdAt?: string;
}

export interface IBenefits {
    id?: number;
    label: string;
}

export interface IValues {
    id?: number;
    label: string;
}

export interface ICareerScopes {
    id?: string;
    name: string;
    description?: string;
   
}

export interface IJobPosition {
    id: string;
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

export interface IImage {
    id?: string;
    image: string;   
}

export interface ISocial {
    id?: string;
    platform: string;
    url: string;
}
