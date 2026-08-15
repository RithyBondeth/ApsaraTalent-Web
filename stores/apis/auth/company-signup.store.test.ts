import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, setSessionRole } = vi.hoisted(() => ({
  post: vi.fn(),
  setSessionRole: vi.fn(),
}));
vi.mock("@/lib/axios", () => ({ default: { post } }));
vi.mock("@/utils/auth/cookie-manager", () => ({ setSessionRole }));

import { useCompanySignupStore } from "./company-signup.store";

type SignupBody = Parameters<
  ReturnType<typeof useCompanySignupStore.getState>["signup"]
>[0];

const body = {
  email: "company@example.com",
  password: "secret",
  authEmail: true,
  name: "Apsara Labs",
  description: "Technology company",
  phone: "012345678",
  industry: "Technology",
  location: "Phnom Penh",
  companySize: 25,
  foundedYear: 2020,
  openPositions: [
    {
      title: "Engineer",
      description: "Build products",
      type: "full_time",
      experience: "mid",
      education: "bachelor",
      salary: "$1,000",
      deadlineDate: "2026-12-31",
      skills: ["TypeScript", "React"],
    },
  ],
  benefits: [{ label: "Insurance" }],
  values: [{ label: "Integrity" }],
  careerScopes: [{ name: "Software", description: "Web" }],
  socials: [{ platform: "linkedin", url: "https://linkedin.com/company/test" }],
} as SignupBody;

describe("company-signup store", () => {
  beforeEach(() => {
    useCompanySignupStore.setState({
      loading: false,
      error: null,
      message: null,
      isAuthenticated: false,
    });
  });

  it("maps jobs and career data to the API and returns the company id", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Created",
        user: { role: "company", company: { id: "company-1" } },
      },
    });

    await expect(useCompanySignupStore.getState().signup(body)).resolves.toBe(
      "company-1",
    );

    expect(post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        name: "Apsara Labs",
        jobs: [
          expect.objectContaining({
            experienceRequired: "mid",
            educationRequired: "bachelor",
            skillsRequired: "TypeScript, React",
          }),
        ],
        careerScopes: [{ name: "Software", description: "Web" }],
      }),
    );
    expect(setSessionRole).toHaveBeenCalledWith("company", false);
    expect(useCompanySignupStore.getState().isAuthenticated).toBe(true);
  });

  // These all reached the wizard but were dropped before the request, so a
  // company's type, website and every structured job detail were silently lost
  // at signup. Asserted by name because `objectContaining` cannot catch an
  // omission.
  it("forwards company type, website, and structured job details", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Created",
        user: { role: "company", company: { id: "company-1" } },
      },
    });

    await useCompanySignupStore.getState().signup({
      ...body,
      websiteUrl: "https://apsara.example.com",
      companyType: "Agricultural Cooperative",
      openPositions: [
        {
          ...body.openPositions[0],
          salaryMin: 800,
          salaryMax: 1500,
          salaryCurrency: "USD",
          workMode: "hybrid",
          location: "Phnom Penh",
          languagesRequired: ["Khmer", "English"],
          openingsCount: 3,
        },
      ],
    } as SignupBody);

    const [, payload] = post.mock.calls[0];
    expect(payload.websiteUrl).toBe("https://apsara.example.com");
    expect(payload.companyType).toBe("Agricultural Cooperative");
    expect(payload.jobs[0]).toMatchObject({
      salaryMin: 800,
      salaryMax: 1500,
      salaryCurrency: "USD",
      workMode: "hybrid",
      location: "Phnom Penh",
      languagesRequired: ["Khmer", "English"],
      openingsCount: 3,
    });
  });

  it("does not authenticate when company signup fails", async () => {
    post.mockRejectedValueOnce(new Error("Company already exists"));

    await expect(
      useCompanySignupStore.getState().signup(body),
    ).resolves.toBeUndefined();
    expect(useCompanySignupStore.getState()).toMatchObject({
      loading: false,
      isAuthenticated: false,
      error: "Company already exists",
      message: "Company already exists",
    });
  });
});
