export interface IUserDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    avatar: string;
    name: string;
    job: string;
    location: string;
    yearsOfExperience: string;
    availability: string;
    skills: string[];
    educations: { school: string, degree: string }[];
    status: { label: string, value: string }[]; 
}