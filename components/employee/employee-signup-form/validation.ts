import * as z from "zod";

// Max size is 5MB.
const MAX_FILE_SIZE = 5000000; 

function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "docx" || fileType === "pdf") return true;
    }
    return false;
}

// Define schema for step 1
export const professionStepSchema = z.object({
    profession: z.object({
        job: z.string().min(2, { message: "Job title must be at least 2 characters" }),
        yearOfExperience: z.coerce.number().min(0, { message: "Years of experience must be a positive number" }),
        availability: z.string().min(1, { message: "Please select your availability" }),
        description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    })
});

// Define schema for step 2
export const experienceStepSchema = z.object({
    experience: z.object({
        title: z.string().min(2, { message: "Title must be at least 2 characters" }),
        description: z.string().min(10, { message: "Description must be at least 10 characters" }),
        startDate: z.string().min(1, { message: "Start date is required" }),
        endDate: z.string().min(1, { message: "End date is required" }),
    }).array()
});

// Define schema for step 3
export  const educationStepSchema = z.object({
    educations: z.object({
        school: z.string().min(2, { message: "School name must be at least 2 characters" }),
        degree: z.string().min(2, { message: "Degree must be at least 2 characters" }),
        year: z.string().min(1, { message: "Year is required" }),
    }).array()
});

// Define schema for step 4
export const skillReferenceStepSchema = z.object({
   skillAndReference: z.object({
        skills: z.string().array().min(1, { message: "Skill is required" }),
        resume: z.any()
        .refine((file: File) => file !== null, "File is required")
        .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
        .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported."),
        coverLetter: z.any()
        .refine((file: File) => file !== null, "File is required")
        .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
        .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported."),
    })
});

// Define schema for step 5
export const avatarStepSchema = z.object({
    avatar: z.string().url(),
});

// FormSchema
export const employeeSignUpSchema = z.object({
    ...professionStepSchema.shape,
    ...experienceStepSchema.shape,
    ...educationStepSchema.shape,
    ...skillReferenceStepSchema.shape,
    ...avatarStepSchema.shape,
});

export type TProfessionStepInfo = z.infer<typeof professionStepSchema>;
export type TExperienceStepInfo = z.infer<typeof experienceStepSchema>;
export type TEducationStepInfo = z.infer<typeof educationStepSchema>;
export type TSkillReferenceStepInfo = z.infer<typeof skillReferenceStepSchema>;
export type TAvatarStepInfo = z.infer<typeof avatarStepSchema>; 

export type TEmployeeSignUp = z.infer<typeof employeeSignUpSchema>;