import { describe, expect, it } from "vitest";
import { IUser } from "@/utils/interfaces/user/user.interface";
import { buildResumePayloadFromUser } from "./build-payload";

function employeeUser(overrides: Record<string, unknown> = {}): IUser {
  return {
    id: "user-1",
    role: "employee",
    email: "candidate@example.com",
    company: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    employee: {
      id: "employee-1",
      firstname: "Sokha",
      lastname: "Chan",
      gender: "male",
      phone: "012345678",
      email: "candidate@example.com",
      job: "Software Engineer",
      yearsOfExperience: "3 - 5 years",
      availability: "full_time",
      description: "Product-minded engineer",
      skills: [],
      experiences: [],
      educations: [],
      socials: [],
      careerScopes: [],
      ...overrides,
    },
  } as IUser;
}

describe("buildResumePayloadFromUser", () => {
  it("preserves the employer and separates common bullet formats", () => {
    const payload = buildResumePayloadFromUser(
      employeeUser({
        experiences: [
          {
            title: "Lead Engineer",
            company: "Apsara Labs",
            startDate: "2022-01-01",
            endDate: "2024-02-01",
            description:
              "Built the platform • Increased revenue by 30%\n- Reduced deployment time\nSupported the team",
          },
        ],
      }),
      "modern",
    );

    expect(payload.experience[0]).toMatchObject({
      company: "Apsara Labs",
      position: "Lead Engineer",
      startDate: "January 2022",
      endDate: "February 2024",
      description: "Built the platform Supported the team",
      achievements: ["Increased revenue by 30%", "Reduced deployment time"],
    });
  });

  it("starts every resume with the complete section order", () => {
    const payload = buildResumePayloadFromUser(
      employeeUser({ avatar: "https://private.example/avatar.jpg" }),
      "classic",
    );

    expect(payload.sectionOrder).toEqual([
      "summary",
      "experience",
      "skills",
      "education",
      "careerScopes",
    ]);
    expect(payload.personalInfo.profilePicture).toBeUndefined();
  });
});
