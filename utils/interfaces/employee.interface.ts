import { StaticImageData } from "next/image";

export interface IEducation {
    id: number;
    school: string;
    degree: string;
    year: string;
  }
  
  export interface IExperience {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  
  export interface ISocial {
    id: number;
    icon: StaticImageData;
    label: string;
    value: string;
  }

export interface IEmployee {
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
    experiences: IExperience[];
    availability: string;
    educations: IEducation[];
    social: ISocial[];
}
