import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, setSessionRole } = vi.hoisted(() => ({
  post: vi.fn(),
  setSessionRole: vi.fn(),
}));
vi.mock("@/lib/axios", () => ({ default: { post } }));
vi.mock("@/utils/auth/cookie-manager", () => ({ setSessionRole }));

import { useEmployeeSignupStore } from "./employee-signup.store";

type SignupBody = Parameters<
  ReturnType<typeof useEmployeeSignupStore.getState>["signup"]
>[0];

const body = {
  email: "user@example.com",
  password: "secret",
  authEmail: true,
  firstname: "Sokha",
  lastname: "Chan",
  username: "sokha",
  gender: "male",
  phone: "012345678",
  job: "Engineer",
  yearsOfExperience: "3",
  availability: "available",
  description: "Engineer",
  location: "Phnom Penh",
  educations: [{ school: "RUPP", degree: "BSc", year: "2023" }],
  experiences: [
    {
      title: "Engineer",
      company: "Example",
      description: "Built products",
      startDate: "2023-01-01",
      endDate: null,
    },
  ],
  skills: [{ name: "TypeScript", description: "Advanced" }],
  careerScopes: [{ name: "Software", description: "Web" }],
  socials: [{ platform: "linkedin", url: "https://linkedin.com/in/sokha" }],
} as SignupBody;

describe("employee-signup store", () => {
  beforeEach(() => {
    useEmployeeSignupStore.setState({
      loading: false,
      error: null,
      message: null,
      isAuthenticated: false,
    });
  });

  it("maps the wizard data to the API and returns the employee id", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Created",
        user: { role: "employee", employee: { id: "employee-1" } },
      },
    });

    await expect(useEmployeeSignupStore.getState().signup(body)).resolves.toBe(
      "employee-1",
    );

    expect(post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        firstname: "Sokha",
        educations: [{ school: "RUPP", degree: "BSc", year: "2023" }],
        skills: [{ name: "TypeScript", description: "Advanced" }],
      }),
    );
    expect(setSessionRole).toHaveBeenCalledWith("employee", false);
    expect(useEmployeeSignupStore.getState().isAuthenticated).toBe(true);
  });

  it("does not authenticate when signup fails", async () => {
    post.mockRejectedValueOnce(new Error("Email already exists"));

    await expect(
      useEmployeeSignupStore.getState().signup(body),
    ).resolves.toBeUndefined();
    expect(useEmployeeSignupStore.getState()).toMatchObject({
      loading: false,
      isAuthenticated: false,
      error: "Email already exists",
      message: "Email already exists",
    });
  });
});
