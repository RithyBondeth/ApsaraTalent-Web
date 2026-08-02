import { describe, expect, it } from "vitest";
import type { ICompany } from "@/utils/interfaces/user/company.interface";
import type { IEmployee } from "@/utils/interfaces/user/employee.interface";
import {
  getCompanyProfileCompletion,
  getEmployeeProfileCompletion,
} from "./profile-completion";

const completeEmployee = {
  id: "employee-1",
  firstname: "Sokha",
  lastname: "Chan",
  dob: "1995-01-01",
  gender: "male",
  avatar: "/avatar.jpg",
  username: "sokha",
  email: "sokha@example.com",
  phone: "012345678",
  job: "Engineer",
  yearsOfExperience: "5",
  availability: "available",
  description: "Experienced engineer",
  location: "Phnom Penh",
  workMode: "hybrid",
  noticePeriod: "2_weeks",
  portfolioUrl: "https://example.com",
  linkedinUrl: "https://linkedin.com/in/sokha",
  languages: ["Khmer", "English"],
  expectedSalaryMin: 1000,
  expectedSalaryMax: 2000,
  skills: [{ name: "TypeScript" }],
  experiences: [
    {
      title: "Engineer",
      description: "Built products",
      startDate: "2020-01-01",
    },
  ],
  educations: [{ school: "RUPP", degree: "BSc", year: "2019" }],
  careerScopes: [{ name: "Software Engineering" }],
  socials: [{ platform: "linkedin", url: "https://linkedin.com/in/sokha" }],
  resume: "/resume.pdf",
  coverLetter: "/cover-letter.pdf",
} as IEmployee;

const completeCompany = {
  id: "company-1",
  name: "Apsara Labs",
  industry: "Technology",
  avatar: "/avatar.jpg",
  cover: "/cover.jpg",
  description: "Product company",
  location: "Phnom Penh",
  phone: "012345678",
  companySize: 25,
  foundedYear: 2020,
  email: "hello@example.com",
  websiteUrl: "https://example.com",
  companyType: "startup",
  openPositions: [
    {
      title: "Engineer",
      description: "Build products",
      type: "full_time",
      experience: "mid",
      education: "bachelor",
      skills: ["TypeScript"],
    },
  ],
  benefits: [{ label: "Insurance" }],
  values: [{ label: "Integrity" }],
  careerScopes: [{ name: "Software Engineering" }],
  socials: [{ platform: "linkedin", url: "https://linkedin.com/company/example" }],
  images: [{ image: "/office.jpg" }],
} as ICompany;

describe("profile completion", () => {
  it("returns 100% with every employee field completed", () => {
    const result = getEmployeeProfileCompletion(completeEmployee);

    expect(result.percentage).toBe(100);
    expect(result.missingFields).toEqual([]);
    expect(result.completedFields).toHaveLength(27);
  });

  it("treats blank strings, empty arrays, and non-positive salaries as missing", () => {
    const result = getEmployeeProfileCompletion({
      ...completeEmployee,
      firstname: "   ",
      skills: [],
      expectedSalaryMin: 0,
      expectedSalaryMax: -1,
    });

    expect(result.percentage).toBe(87);
    expect(result.missingFields).toEqual([
      "firstName",
      "minimumSalary",
      "maximumSalary",
      "skills",
    ]);
  });

  it("returns 100% with every company field completed", () => {
    const result = getCompanyProfileCompletion(completeCompany);

    expect(result.percentage).toBe(100);
    expect(result.missingFields).toEqual([]);
    expect(result.completedFields).toHaveLength(18);
  });

  it("never reports more than 100%", () => {
    expect(
      getEmployeeProfileCompletion(completeEmployee).percentage,
    ).toBeLessThanOrEqual(100);
    expect(
      getCompanyProfileCompletion(completeCompany).percentage,
    ).toBeLessThanOrEqual(100);
  });
});
