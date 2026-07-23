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
 * Employee profile completion uses 27 weighted fields totaling 100%.
 * Keep the weights and the boundary tests in sync when fields change.
 */
export function getEmployeeProfileCompletion(
  employee: IEmployee,
): IProfileCompletionResult {
  const fields: IFieldCheck[] = [
    {
      label: "firstName",
      weight: 3,
      isFilled: isStringFilled(employee.firstname),
    },
    {
      label: "lastName",
      weight: 3,
      isFilled: isStringFilled(employee.lastname),
    },
    {
      label: "dateOfBirth",
      weight: 3,
      isFilled: isStringFilled(employee.dob),
    },
    {
      label: "gender",
      weight: 2,
      isFilled: isStringFilled(employee.gender),
    },
    {
      label: "profilePhoto",
      weight: 6,
      isFilled: isStringFilled(employee.avatar),
    },
    {
      label: "username",
      weight: 3,
      isFilled: isStringFilled(employee.username),
    },
    {
      label: "email",
      weight: 4,
      isFilled: isStringFilled(employee.email),
    },
    {
      label: "phoneNumber",
      weight: 4,
      isFilled: isStringFilled(employee.phone),
    },

    { label: "jobTitle", weight: 6, isFilled: isStringFilled(employee.job) },
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
    {
      label: "bio",
      weight: 6,
      isFilled: isStringFilled(employee.description),
    },
    {
      label: "location",
      weight: 4,
      isFilled: isStringFilled(employee.location),
    },
    {
      label: "workMode",
      weight: 3,
      isFilled: isStringFilled(employee.workMode),
    },
    {
      label: "noticePeriod",
      weight: 3,
      isFilled: isStringFilled(employee.noticePeriod),
    },
    {
      label: "portfolioUrl",
      weight: 3,
      isFilled: isStringFilled(employee.portfolioUrl),
    },
    {
      label: "linkedinUrl",
      weight: 3,
      isFilled: isStringFilled(employee.linkedinUrl),
    },
    {
      label: "languages",
      weight: 4,
      isFilled: isArrayFilled(employee.languages ?? undefined),
    },
    {
      label: "minimumSalary",
      weight: 2,
      isFilled: isNumberFilled(employee.expectedSalaryMin ?? undefined),
    },
    {
      label: "maximumSalary",
      weight: 2,
      isFilled: isNumberFilled(employee.expectedSalaryMax ?? undefined),
    },

    { label: "skills", weight: 6, isFilled: isArrayFilled(employee.skills) },
    {
      label: "experience",
      weight: 6,
      isFilled: isArrayFilled(employee.experiences),
    },
    {
      label: "education",
      weight: 6,
      isFilled: isArrayFilled(employee.educations),
    },
    {
      label: "careerScopes",
      weight: 4,
      isFilled: isArrayFilled(employee.careerScopes),
    },
    {
      label: "socialLinks",
      weight: 3,
      isFilled: isArrayFilled(employee.socials),
    },
    { label: "resume", weight: 2, isFilled: isStringFilled(employee.resume) },
    {
      label: "coverLetter",
      weight: 1,
      isFilled: isStringFilled(employee.coverLetter),
    },
  ];

  return calculateCompletion(fields);
}

/**
 * Company profile completion uses 18 weighted fields totaling 100%.
 * Keep the weights and the boundary tests in sync when fields change.
 */
export function getCompanyProfileCompletion(
  company: ICompany,
): IProfileCompletionResult {
  const fields: IFieldCheck[] = [
    {
      label: "companyName",
      weight: 5,
      isFilled: isStringFilled(company.name),
    },
    {
      label: "industry",
      weight: 4,
      isFilled: isStringFilled(company.industry),
    },
    {
      label: "profilePhoto",
      weight: 7,
      isFilled: isStringFilled(company.avatar),
    },
    {
      label: "coverImage",
      weight: 5,
      isFilled: isStringFilled(company.cover),
    },

    {
      label: "description",
      weight: 8,
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
      weight: 3,
      isFilled: isNumberFilled(company.foundedYear),
    },
    {
      label: "email",
      weight: 4,
      isFilled: isStringFilled(company.email),
    },
    {
      label: "websiteUrl",
      weight: 4,
      isFilled: isStringFilled(company.websiteUrl),
    },
    {
      label: "companyType",
      weight: 3,
      isFilled: isStringFilled(company.companyType),
    },

    {
      label: "openPositions",
      weight: 14,
      isFilled: isArrayFilled(company.openPositions),
    },
    { label: "benefits", weight: 5, isFilled: isArrayFilled(company.benefits) },
    { label: "values", weight: 5, isFilled: isArrayFilled(company.values) },

    {
      label: "careerScopes",
      weight: 6,
      isFilled: isArrayFilled(company.careerScopes),
    },
    {
      label: "socialLinks",
      weight: 7,
      isFilled: isArrayFilled(company.socials),
    },
    {
      label: "companyImages",
      weight: 7,
      isFilled: isArrayFilled(company.images),
    },
  ];

  return calculateCompletion(fields);
}
