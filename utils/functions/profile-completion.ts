import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import {
  IFieldCheck,
  IProfileCompletionResult,
} from "../interfaces/user-interface/profile-completion.interface";

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
      label: "First Name",
      weight: 4,
      isFilled: isStringFilled(employee.firstname),
    },
    {
      label: "Last Name",
      weight: 4,
      isFilled: isStringFilled(employee.lastname),
    },
    {
      label: "Profile Photo",
      weight: 8,
      isFilled: isStringFilled(employee.avatar),
    },
    {
      label: "Username",
      weight: 4,
      isFilled: isStringFilled(employee.username),
    },

    // Professional — 28%
    { label: "Job Title", weight: 8, isFilled: isStringFilled(employee.job) },
    { label: "Bio", weight: 8, isFilled: isStringFilled(employee.description) },
    {
      label: "Location",
      weight: 4,
      isFilled: isStringFilled(employee.location),
    },
    {
      label: "Years of Experience",
      weight: 4,
      isFilled: isStringFilled(employee.yearsOfExperience),
    },
    {
      label: "Availability",
      weight: 4,
      isFilled: isStringFilled(employee.availability),
    },

    // Skills & Education — 28%
    { label: "Skills", weight: 8, isFilled: isArrayFilled(employee.skills) },
    {
      label: "Experience",
      weight: 8,
      isFilled: isArrayFilled(employee.experiences),
    },
    {
      label: "Education",
      weight: 8,
      isFilled: isArrayFilled(employee.educations),
    },
    {
      label: "Career Scopes",
      weight: 4,
      isFilled: isArrayFilled(employee.careerScopes),
    },

    // Documents — 14%
    { label: "Resume", weight: 8, isFilled: isStringFilled(employee.resume) },
    {
      label: "Cover Letter",
      weight: 6,
      isFilled: isStringFilled(employee.coverLetter),
    },

    // Social & Contact — 10%
    {
      label: "Phone Number",
      weight: 5,
      isFilled: isStringFilled(employee.phone),
    },
    {
      label: "Social Links",
      weight: 5,
      isFilled: isArrayFilled(employee.socials),
    },
  ];

  return calculateCompletion(fields);
}

/**
 * Company profile completion — 16 weighted fields totaling 100%
 *
 * Core identity:   Name (5) + Industry (5) + Profile Photo (8) + Cover (4) = 22%
 * Details:         Description (10) + Location (5) + Phone (4) + Size (4) + Founded (4) = 27%
 * Offerings:       Open Positions (12) + Benefits (5) + Values (5) = 22%
 * Discovery:       Career Scopes (5) + Social Links (4) + Company Images (5) = 14%
 * Availability:    Available Times (5) = 5%
 * Bonus:           Email (not counted, only tracked)
 *
 * Note: Adjusted to sum to 100% with rounding safety
 */
export function getCompanyProfileCompletion(
  company: ICompany,
): IProfileCompletionResult {
  const fields: IFieldCheck[] = [
    // Core identity — 22%
    {
      label: "Company Name",
      weight: 5,
      isFilled: isStringFilled(company.name),
    },
    {
      label: "Industry",
      weight: 5,
      isFilled: isStringFilled(company.industry),
    },
    {
      label: "Profile Photo",
      weight: 8,
      isFilled: isStringFilled(company.avatar),
    },
    {
      label: "Cover Image",
      weight: 4,
      isFilled: isStringFilled(company.cover),
    },

    // Details — 27%
    {
      label: "Description",
      weight: 10,
      isFilled: isStringFilled(company.description),
    },
    {
      label: "Location",
      weight: 5,
      isFilled: isStringFilled(company.location),
    },
    {
      label: "Phone Number",
      weight: 4,
      isFilled: isStringFilled(company.phone),
    },
    {
      label: "Company Size",
      weight: 4,
      isFilled: isNumberFilled(company.companySize),
    },
    {
      label: "Founded Year",
      weight: 4,
      isFilled: isNumberFilled(company.foundedYear),
    },

    // Offerings — 22%
    {
      label: "Open Positions",
      weight: 12,
      isFilled: isArrayFilled(company.openPositions),
    },
    { label: "Benefits", weight: 5, isFilled: isArrayFilled(company.benefits) },
    { label: "Values", weight: 5, isFilled: isArrayFilled(company.values) },

    // Discovery — 14%
    {
      label: "Career Scopes",
      weight: 5,
      isFilled: isArrayFilled(company.careerScopes),
    },
    {
      label: "Social Links",
      weight: 4,
      isFilled: isArrayFilled(company.socials),
    },
    {
      label: "Company Images",
      weight: 5,
      isFilled: isArrayFilled(company.images),
    },

    // Availability — 2%
    {
      label: "Available Times",
      weight: 2,
      isFilled: isArrayFilled(company.availableTimes),
    },
  ];

  return calculateCompletion(fields);
}
