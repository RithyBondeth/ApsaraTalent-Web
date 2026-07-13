import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { IFieldCheck } from "@/utils/interfaces/user/profile-completion.interface";
import { IProfileCompletionResult } from "@/utils/interfaces/user/profile-completion.interface";

/* --------------------------------- Helpers ---------------------------------- */
function isStringFilled(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isArrayFilled(value: unknown[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

function isNumberFilled(value: number | undefined): boolean {
  return typeof value === "number" && value > 0;
}

function calculateCompletion(fields: IFieldCheck[]): IProfileCompletionResult {
  let percentage = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  for (const field of fields) {
    if (field.isFilled) {
      percentage += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  }

  return {
    percentage: Math.min(Math.round(percentage), 100),
    missingFields,
    completedFields,
  };
}

/* --------------------------------- Methods ---------------------------------- */
/**
 * Employee profile completion — 16 weighted fields totaling 100%
 *
 * Core identity:   First Name (4) + Last Name (4) + Profile Photo (8) + Username (4) = 20%
 * Professional:    Job Title (8) + Bio (8) + Location (4) + Years of Exp (4) + Availability (4) = 28%
 * Skills & Edu:    Skills (8) + Experience (8) + Education (8) + Career Scopes (4) = 28%
 * Documents:       Resume (8) + Cover Letter (6) = 14%
 * Social:          Social Links (4) + Phone (4) = 8%
 * Bonus:           (not counted, only tracked)
 *
 * Total = 100%  (round-safe with Math.round)
 */
export function getEmployeeProfileCompletion(
  employee: IEmployee,
): IProfileCompletionResult {
  const fields: IFieldCheck[] = [
    // Core identity — 20%
    {
      label: "firstName",
      weight: 4,
      isFilled: isStringFilled(employee.firstname),
    },
    {
      label: "lastName",
      weight: 4,
      isFilled: isStringFilled(employee.lastname),
    },
    {
      label: "profilePhoto",
      weight: 8,
      isFilled: isStringFilled(employee.avatar),
    },
    {
      label: "username",
      weight: 4,
      isFilled: isStringFilled(employee.username),
    },

    // Professional — 28%
    { label: "jobTitle", weight: 8, isFilled: isStringFilled(employee.job) },
    { label: "bio", weight: 8, isFilled: isStringFilled(employee.description) },
    {
      label: "location",
      weight: 4,
      isFilled: isStringFilled(employee.location),
    },
    {
      label: "yearsOfExperience",
      weight: 4,
      isFilled: isStringFilled(employee.yearsOfExperience),
    },
    {
      label: "availability",
      weight: 4,
      isFilled: isStringFilled(employee.availability),
    },

    // Skills & Education — 28%
    { label: "skills", weight: 8, isFilled: isArrayFilled(employee.skills) },
    {
      label: "experience",
      weight: 8,
      isFilled: isArrayFilled(employee.experiences),
    },
    {
      label: "education",
      weight: 8,
      isFilled: isArrayFilled(employee.educations),
    },
    {
      label: "careerScopes",
      weight: 4,
      isFilled: isArrayFilled(employee.careerScopes),
    },

    // Documents — 14%
    { label: "resume", weight: 8, isFilled: isStringFilled(employee.resume) },
    {
      label: "coverLetter",
      weight: 6,
      isFilled: isStringFilled(employee.coverLetter),
    },

    // Social & Contact — 10%
    {
      label: "phoneNumber",
      weight: 5,
      isFilled: isStringFilled(employee.phone),
    },
    {
      label: "socialLinks",
      weight: 5,
      isFilled: isArrayFilled(employee.socials),
    },
  ];

  return calculateCompletion(fields);
}

/**
 * Company profile completion — 16 weighted fields totaling 100%
 *
 * Core identity:   Name (5) + Industry (5) + Profile Photo (10) + Cover (4) = 24%
 * Details:         Description (12) + Location (5) + Phone (4) + Size (4) + Founded (4) = 29%
 * Offerings:       Open Positions (15) + Benefits (5) + Values (5) = 25%
 * Discovery:       Career Scopes (5) + Social Links (4) + Company Images (8) = 17%
 * Availability:    Available Times (5) = 5%
 * Bonus:           Email (not counted, only tracked)
 *
 * Total = 100%
 */
export function getCompanyProfileCompletion(
  company: ICompany,
): IProfileCompletionResult {
  const fields: IFieldCheck[] = [
    // Core identity — 24%
    {
      label: "companyName",
      weight: 5,
      isFilled: isStringFilled(company.name),
    },
    {
      label: "industry",
      weight: 5,
      isFilled: isStringFilled(company.industry),
    },
    {
      label: "profilePhoto",
      weight: 10,
      isFilled: isStringFilled(company.avatar),
    },
    {
      label: "coverImage",
      weight: 4,
      isFilled: isStringFilled(company.cover),
    },

    // Details — 29%
    {
      label: "description",
      weight: 12,
      isFilled: isStringFilled(company.description),
    },
    {
      label: "location",
      weight: 5,
      isFilled: isStringFilled(company.location),
    },
    {
      label: "phoneNumber",
      weight: 4,
      isFilled: isStringFilled(company.phone),
    },
    {
      label: "companySize",
      weight: 4,
      isFilled: isNumberFilled(company.companySize),
    },
    {
      label: "foundedYear",
      weight: 4,
      isFilled: isNumberFilled(company.foundedYear),
    },

    // Offerings — 25%
    {
      label: "openPositions",
      weight: 15,
      isFilled: isArrayFilled(company.openPositions),
    },
    { label: "benefits", weight: 5, isFilled: isArrayFilled(company.benefits) },
    { label: "values", weight: 5, isFilled: isArrayFilled(company.values) },

    // Discovery — 17%
    {
      label: "careerScopes",
      weight: 5,
      isFilled: isArrayFilled(company.careerScopes),
    },
    {
      label: "socialLinks",
      weight: 4,
      isFilled: isArrayFilled(company.socials),
    },
    {
      label: "companyImages",
      weight: 8,
      isFilled: isArrayFilled(company.images),
    },

    // Availability — 5%
    {
      label: "availableTimes",
      weight: 5,
      isFilled: isArrayFilled(company.availableTimes),
    },
  ];

  return calculateCompletion(fields);
}
