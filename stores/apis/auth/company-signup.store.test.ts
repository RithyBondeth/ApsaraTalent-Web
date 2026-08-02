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
