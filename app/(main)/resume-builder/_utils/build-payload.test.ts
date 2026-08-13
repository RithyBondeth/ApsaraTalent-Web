import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(() => vi.useRealTimers());

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

  it("maps profile details, social aliases, education, age, and ongoing work", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-23T00:00:00Z"));
    const inlineAvatar = "data:image/jpeg;base64,aGVsbG8=";
    const payload = buildResumePayloadFromUser(
      employeeUser({
        dob: "2000-08-01",
        location: "Phnom Penh",
        avatar: inlineAvatar,
        skills: [{ name: " React " }, { name: " " }],
        careerScopes: [{ name: " Engineering " }],
        educations: [
          { degree: "BSc", school: "RUPP", year: "2022-06-01" },
          { degree: "Certificate", school: "Online", year: "unknown" },
        ],
        experiences: [
          {
            title: "Engineer",
            company: " Apsara ",
            startDate: "not-a-date",
            endDate: null,
            description: "* Shipped products",
          },
        ],
        socials: [
          { platform: "LinkedIn", url: "https://linkedin.test/me" },
          { platform: "X", url: "https://x.test/me" },
          { platform: "Portfolio", url: "https://me.test" },
          { platform: "Instagram", url: "https://instagram.test/me" },
          { platform: "Dribbble", url: "https://dribbble.test/me" },
          { platform: "Behance", url: "https://behance.test/me" },
          { platform: "Mastodon", url: "https://social.test/me" },
          { platform: "Github", url: "" },
        ],
      }),
      "modern",
    );

    expect(payload.personalInfo).toMatchObject({
      fullName: "Sokha Chan",
      age: 25,
      location: "Phnom Penh",
      profilePicture: inlineAvatar,
      socials: expect.objectContaining({
        linkedin: "https://linkedin.test/me",
        twitter: "https://x.test/me",
        portfolio: "https://me.test",
        mastodon: "https://social.test/me",
      }),
    });
    expect(payload.skills).toEqual(["React"]);
    expect(payload.careerScopes).toEqual(["Engineering"]);
    expect(payload.education).toBe(
      "BSc, RUPP, 2022 | Certificate, Online, unknown",
    );
    expect(payload.experience[0]).toMatchObject({
      company: "Apsara",
      startDate: "not-a-date",
      endDate: "Present",
      description: "* Shipped products",
      achievements: ["Shipped products"],
    });
  });

  it("requires employee data", () => {
    expect(() =>
      buildResumePayloadFromUser(
        { id: "user-1", role: "company", employee: null } as IUser,
        "classic",
      ),
    ).toThrow("Employee data is required");
  });
});
