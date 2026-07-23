import { describe, expect, it } from "vitest";

import { makeForgotPasswordSchema } from "./(auth)/forgot-password/validate";
import { makeLoginSchema } from "./(auth)/login/validation";
import { makePhoneLoginSchema } from "./(auth)/login/phone-number/validation";
import { makeResetPasswordSchema } from "./(auth)/reset-password/validate";
import {
  makeBasicSignupCompanySchema,
  makeBasicSignupEmployeeSchema,
} from "./(auth)/signup/validation";
import { makeCompanySignupSchema } from "./(auth)/signup/company/validation";
import { makeEmployeeSignUpSchema } from "./(auth)/signup/employee/validation";
import { signupOptionSchema } from "./(auth)/signup/option/validation";
import { companySearchSchema } from "./(main)/search/company/validation";
import { employeeSearchSchema } from "./(main)/search/employee/validation";
import { companyFormSchema } from "./(main)/profile/company/validation";
import { employeeFormSchema } from "./(main)/profile/employee/validation";

const passwordMessages = {
  passwordRequired: "Password is required",
  passwordMinLength: "Password is too short",
  passwordNeedsNumber: "Password needs a number",
  passwordNeedsSpecial: "Password needs a special character",
};

describe("application validation schemas", () => {
  it("validates login credentials and password strength", () => {
    const schema = makeLoginSchema({
      emailRequired: "Email is required",
      emailInvalid: "Email is invalid",
      ...passwordMessages,
    });

    expect(schema.safeParse({ email: "user@example.com", password: "Secure1!" }).success).toBe(true);
    expect(schema.safeParse({ email: "invalid", password: "weak" }).success).toBe(false);
  });

  it("accepts email or Cambodian phone recovery identifiers", () => {
    const schema = makeForgotPasswordSchema({
      phoneOrEmailRequired: "Required",
      phoneOrEmailInvalid: "Invalid",
    });
    expect(schema.safeParse({ forgotPassword: "user@example.com" }).success).toBe(true);
    expect(schema.safeParse({ forgotPassword: "+85512345678" }).success).toBe(true);
    expect(schema.safeParse({ forgotPassword: "not-an-account" }).success).toBe(false);
  });

  it("trims and validates phone login values", () => {
    const schema = makePhoneLoginSchema({ phoneRequired: "Required", phoneInvalid: "Invalid" });
    expect(schema.parse({ phone: " 012345678 " }).phone).toBe("012345678");
    expect(schema.safeParse({ phone: "" }).success).toBe(false);
    expect(schema.safeParse({ phone: "123" }).success).toBe(false);
  });

  it("requires matching reset passwords", () => {
    const schema = makeResetPasswordSchema({
      ...passwordMessages,
      confirmPasswordRequired: "Confirmation required",
      passwordsMismatch: "Passwords differ",
    });
    expect(
      schema.safeParse({ password: "Secure1!", confirmPassword: "Secure1!" }).success,
    ).toBe(true);
    const invalid = schema.safeParse({ password: "Secure1!", confirmPassword: "Different1!" });
    expect(invalid.success).toBe(false);
    if (!invalid.success) expect(invalid.error.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("validates the basic employee signup step", () => {
    const schema = makeBasicSignupEmployeeSchema({
      firstNameRequired: "First name required",
      lastNameRequired: "Last name required",
      dobRequired: "DOB required",
      usernameRequired: "Username required",
      locationRequired: "Location required",
      genderRequired: "Gender required",
      phoneInvalid: "Phone invalid",
      emailRequired: "Email required",
      emailInvalid: "Email invalid",
      ...passwordMessages,
      confirmPasswordRequired: "Confirmation required",
      passwordsMismatch: "Passwords differ",
    });
    const valid = {
      firstName: "Sokha",
      lastName: "Chan",
      dob: "1995-05-15",
      username: "sokha",
      phone: "",
      gender: "male",
      selectedLocation: "Phnom Penh",
      email: "sokha@example.com",
      password: "Secure1!",
      confirmPassword: "Secure1!",
    };
    expect(schema.safeParse(valid).success).toBe(true);
    expect(schema.safeParse({ ...valid, confirmPassword: "Mismatch1!" }).success).toBe(false);
  });

  it("validates the basic company signup step", () => {
    const schema = makeBasicSignupCompanySchema({
      phoneInvalid: "Phone invalid",
      emailRequired: "Email required",
      emailInvalid: "Email invalid",
      ...passwordMessages,
      confirmPasswordRequired: "Confirmation required",
      passwordsMismatch: "Passwords differ",
    });
    expect(
      schema.safeParse({
        phone: "+85512345678",
        email: "company@example.com",
        password: "Secure1!",
        confirmPassword: "Secure1!",
      }).success,
    ).toBe(true);
  });

  it("validates complete company onboarding including positions and career scopes", () => {
    const schema = makeCompanySignupSchema({
      atLeastOneSkill: "Skill required",
      atLeastOnePosition: "Position required",
      atLeastOneCareer: "Career required",
      deadlineRequired: "Deadline required",
      fieldRequired: (field) => `${field} required`,
      fieldTooLong: (field, max) => `${field} max ${max}`,
      selectRequired: (field) => `${field} required`,
    });
    const valid = {
      basicInfo: {
        name: "Apsara",
        description: "Talent platform",
        industry: "Technology",
        companySize: "11-50",
        foundedYear: "2024",
        location: "Phnom Penh",
        websiteUrl: "https://example.com",
        companyType: "startup",
      },
      openPositions: [
        {
          title: "Engineer",
          description: "Build products",
          experienceRequirement: "2 years",
          educationRequirement: "Bachelor",
          skills: ["TypeScript"],
          types: "full-time",
          deadlineDate: "2026-12-01",
        },
      ],
      benefitsAndValues: { benefits: ["Insurance"], values: ["Integrity"] },
      careerScopes: ["Engineering"],
    };
    expect(schema.safeParse(valid).success).toBe(true);
    expect(schema.safeParse({ ...valid, openPositions: [] }).success).toBe(false);
  });

  it("validates complete employee onboarding and date ordering", () => {
    const schema = makeEmployeeSignUpSchema({
      yearsOfExperienceRequired: "Experience required",
      availabilityRequired: "Availability required",
      endDateAfterStart: "End must follow start",
      startDateRequired: "Start required",
      endDateRequired: "End required",
      graduationYearRequired: "Year required",
      atLeastOneSkill: "Skill required",
      atLeastOneCareer: "Career required",
      fieldRequired: (field) => `${field} required`,
      fieldTooLong: (field, max) => `${field} max ${max}`,
    });
    const valid = {
      profession: {
        job: "Engineer",
        yearOfExperience: "2",
        availability: "full-time",
        description: "Frontend engineer",
      },
      experience: [
        {
          title: "Developer",
          company: "Example",
          description: "Built applications",
          startDate: "2024-01-01",
          endDate: "2025-01-01",
        },
      ],
      educations: [{ school: "University", degree: "Computer Science", year: 2022 }],
      skillAndReference: { skills: ["TypeScript"] },
      careerScopes: ["Engineering"],
    };
    expect(schema.safeParse(valid).success).toBe(true);
    expect(
      schema.safeParse({
        ...valid,
        experience: [{ ...valid.experience[0], endDate: "2023-01-01" }],
      }).success,
    ).toBe(false);
  });

  it("validates role selection and search filters", () => {
    expect(signupOptionSchema.safeParse({ selectedRole: "employee" }).success).toBe(true);
    expect(signupOptionSchema.safeParse({ selectedRole: "" }).success).toBe(false);
    expect(
      companySearchSchema.safeParse({ keyword: "engineer", sortBy: "createdAt", orderBy: "DESC" })
        .success,
    ).toBe(true);
    expect(
      employeeSearchSchema.safeParse({
        keyword: "developer",
        companySize: { min: 10, max: 100 },
        salaryRange: { min: 800, max: 2000 },
        sortBy: "salary",
        orderBy: "ASC",
      }).success,
    ).toBe(true);
  });

  it("validates company profile media, URLs, and open-position constraints", () => {
    const image = new File(["image"], "logo.png", { type: "image/png" });
    const unsupported = new File(["image"], "logo.svg", { type: "image/svg+xml" });
    expect(
      companyFormSchema.safeParse({
        basicInfo: {
          websiteUrl: "https://apsaratalent.com",
          avatar: image,
          cover: image,
        },
        images: [{ id: "image-1", image }],
        openPositions: [
          {
            title: "Engineer",
            salaryMin: 500,
            salaryMax: 1500,
            openingsCount: 2,
            deadlineDate: "2027-01-01",
          },
        ],
      }).success,
    ).toBe(true);
    expect(
      companyFormSchema.safeParse({ basicInfo: { websiteUrl: "invalid", avatar: unsupported } })
        .success,
    ).toBe(false);
    expect(
      companyFormSchema.safeParse({
        openPositions: [{ salaryMin: -1, openingsCount: 0, deadlineDate: "invalid" }],
      }).success,
    ).toBe(false);
  });

  it("validates employee profile dates, media, documents, and social URLs", () => {
    const image = new File(["image"], "avatar.webp", { type: "image/webp" });
    const resume = new File(["resume"], "resume.pdf", { type: "application/pdf" });
    const unsupported = new File(["text"], "resume.txt", { type: "text/plain" });
    expect(
      employeeFormSchema.safeParse({
        basicInfo: { avatar: image, dob: "2000-01-01" },
        profession: {
          portfolioUrl: "https://portfolio.example.com",
          linkedinUrl: "https://linkedin.com/in/candidate",
          expectedSalaryMin: 500,
          expectedSalaryMax: 1500,
        },
        experiences: [{ startDate: "2024-01-01", endDate: "2025-01-01" }],
        references: { resume, coverLetter: resume },
        socials: [{ platform: "Github", url: "https://github.com/candidate" }],
      }).success,
    ).toBe(true);
    expect(
      employeeFormSchema.safeParse({
        experiences: [{ startDate: "2025-01-01", endDate: "2024-01-01" }],
        references: { resume: unsupported },
        socials: [{ url: "invalid" }],
      }).success,
    ).toBe(false);
    expect(
      employeeFormSchema.safeParse({ basicInfo: { avatar: unsupported } }).success,
    ).toBe(false);
  });
});
