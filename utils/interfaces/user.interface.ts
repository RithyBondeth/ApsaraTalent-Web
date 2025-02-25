import { StaticImageData } from "next/image";

export interface IUser {
    id: number;
    avatar: string;
    firstname: string;
    lastname: string;
    username: string;
    phone: string;
    email: string;
    job: string;
    location: string;
    skills: string[];
    description: string;
    document: {
        resume: string;
        coverLetter: string;
    };
    status: {
        id: number;
        label: string;
        value: string;
    }[];
    yearsOfExperience: string;
    experiences: {
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
    }[];
    availability: string;
    educations: {
        id: number;
        school: string;
        degree: string;
        year: string;
    }[];
    social: {
        id: number;
        icon: StaticImageData;
        label: string;
        value: string;
    }[];
}