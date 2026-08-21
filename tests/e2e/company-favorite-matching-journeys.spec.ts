import { expect, test, type Page, type Request } from "@playwright/test";
import {
  captureRuntimeFailures,
  expectNoHorizontalOverflow,
  mockApi,
  successfulEmployeeApi,
} from "./helpers";

const employee = {
  id: "employee-1",
  firstname: "Sophea",
  lastname: "Chan",
  username: "sophea.chan",
  gender: "female",
  avatar: "",
  phone: "012345678",
  email: "candidate@example.com",
  job: "Frontend Engineer",
  yearsOfExperience: "4",
  availability: "full_time",
  description: "Product-focused frontend engineer",
  location: "Phnom Penh",
  skills: [{ id: "skill-1", name: "React" }],
  experiences: [],
  educations: [],
  socials: [],
  careerScopes: [],
  skillScore: 86,
};

const company = {
  id: "company-1",
  name: "Apsara Labs",
  industry: "Technology",
  email: "hello@apsara.test",
  description: "A Cambodian product engineering company",
  companySize: 45,
  foundedYear: 2020,
  location: "Phnom Penh",
  phone: "023123456",
  openPositions: [],
  values: [],
  benefits: [],
  careerScopes: [],
  socials: [],
};

const currentUser = {
  id: "user-company-1",
  email: "hello@apsara.test",
  role: "company",
  createdAt: "2026-01-01T00:00:00.000Z",
  company,
};

const favorite = {
  id: "favorite-employee-1",
  createdAt: "2026-07-20T00:00:00.000Z",
  userId: "company-1",
  employee,
};

type CompanyJourneyState = {
  favoriteRemoved?: boolean;
  favoriteFailure?: boolean;
  favoriteGets?: number;
  favoriteRemovals?: number;
  matchRemoved?: boolean;
  unmatchFailure?: boolean;
  matchingGets?: number;
  unmatchRequests?: number;
  chatRequests?: number;
  chatDelayMs?: number;
};

async function openAsCompany(page: Page, pathname: string) {
  await page.goto(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  await page.getByLabel("Email").fill("hello@apsara.test");
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill("StrongPass1!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(
    new RegExp(`${pathname.replaceAll("/", "\\/")}$`),
  );
}

function companyJourneyApi(state: CompanyJourneyState) {
  return async (request: Request) => {
    const pathname = new URL(request.url()).pathname;
    const method = request.method();

    if (pathname.endsWith("/auth/login")) {
      return {
        body: {
          message: "Logged in",
          user: { id: "user-company-1", role: "company" },
        },
      };
    }

    if (pathname.endsWith("/user/current-user")) {
      return { body: currentUser };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/user/company/all-favorites/company-1")
    ) {
      state.favoriteGets = (state.favoriteGets ?? 0) + 1;
      return { body: state.favoriteRemoved ? [] : [favorite] };
    }

    if (
      method === "POST" &&
      pathname.endsWith(
        "/user/company/company-1/unfavorite/favorite-employee-1/employee/employee-1",
      )
    ) {
      state.favoriteRemovals = (state.favoriteRemovals ?? 0) + 1;
      if (state.favoriteFailure) {
        return {
          status: 503,
          body: { message: "Talent favorite service unavailable" },
        };
      }
      state.favoriteRemoved = true;
      return { body: { message: "Favorite removed" } };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/match/current-company-matching/company-1")
    ) {
      state.matchingGets = (state.matchingGets ?? 0) + 1;
      return { body: state.matchRemoved ? [] : [employee] };
    }

    if (
      method === "DELETE" &&
      pathname.endsWith("/match/unmatch/employee-1/company-1")
    ) {
      state.unmatchRequests = (state.unmatchRequests ?? 0) + 1;
      if (state.unmatchFailure) {
        return {
          status: 503,
          body: { message: "Unmatch service unavailable" },
        };
      }
      state.matchRemoved = true;
      return { body: { message: "Unmatched" } };
    }

    if (method === "POST" && pathname.endsWith("/chat/initiate")) {
      state.chatRequests = (state.chatRequests ?? 0) + 1;
      if (state.chatDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, state.chatDelayMs));
      }
      return {
        body: {
          id: "chat-company-1",
          senderId: "company-1",
          receiverId: "employee-1",
        },
      };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/user/employee/one/employee-1")
    ) {
      return { body: employee };
    }

    return successfulEmployeeApi(request);
  };
}

test.describe("company favorite journeys", () => {
  test("removes saved talent and refreshes the empty state", async ({
    page,
  }) => {
    const state: CompanyJourneyState = {};
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/favorite");

    await expect(page.getByText("Sophea Chan")).toBeVisible();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(
      page.getByText("sophea.chan removed from favorites."),
    ).toBeVisible();
    await expect(page.getByText("Nothing saved yet")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore more" }),
    ).toHaveAttribute("href", "/search/employee");
    expect(state.favoriteRemovals).toBe(1);
    expect(state.favoriteGets).toBeGreaterThanOrEqual(2);
  });

  test("keeps saved talent and displays the API error when removal fails", async ({
    page,
  }) => {
    const state: CompanyJourneyState = { favoriteFailure: true };
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/favorite");

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(
      page.getByText("Talent favorite service unavailable"),
    ).toBeVisible();
    await expect(page.getByText("Sophea Chan")).toBeVisible();
    expect(state.favoriteRemovals).toBe(1);
  });

  test("@mobile removes saved talent without layout overflow", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "The mobile journey uses the Pixel viewport",
    );
    const state: CompanyJourneyState = {};
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/favorite");

    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Nothing saved yet")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(state.favoriteRemovals).toBe(1);
  });

  test("opens the saved employee detail page without runtime failures", async ({
    page,
  }) => {
    const failures = captureRuntimeFailures(page);
    await mockApi(page, companyJourneyApi({}));
    await openAsCompany(page, "/favorite");

    await page.getByRole("button", { name: "View Detail" }).click();
    await expect(page).toHaveURL(/\/feed\/employee\/employee-1$/);
    await expect(page.getByText("Sophea Chan").first()).toBeVisible();
    expect(failures).toEqual([]);
  });
});

test.describe("company matching journeys", () => {
  test("starts only one chat when clicked twice rapidly", async ({ page }) => {
    const state: CompanyJourneyState = { chatDelayMs: 500 };
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/matching");
    const chatButton = page.getByRole("button", { name: "Chat Now" });

    await expect(chatButton).toBeVisible();
    await chatButton.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
    await expect(page).toHaveURL(/\/message\?chatId=chat-company-1$/);
    expect(state.chatRequests).toBe(1);
  });

  test("opens interview scheduling for the selected employee", async ({
    page,
  }) => {
    await mockApi(page, companyJourneyApi({}));
    await openAsCompany(page, "/matching");

    await page.getByRole("button", { name: "Schedule" }).click();
    await expect(page).toHaveURL(/\/interview\?with=employee-1$/);
  });

  test("confirms and completes an employee unmatch", async ({ page }) => {
    const state: CompanyJourneyState = {};
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/matching");

    await page.getByRole("button", { name: "Unmatch" }).click();
    await expect(
      page.getByRole("dialog", { name: "Unmatch Sophea Chan?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();

    await expect(page.getByText("Unmatched successfully.")).toBeVisible();
    await expect(page.getByText("No matches yet")).toBeVisible();
    expect(state.unmatchRequests).toBe(1);
  });

  test("restores the employee match when unmatching fails", async ({
    page,
  }) => {
    const state: CompanyJourneyState = { unmatchFailure: true };
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/matching");

    await page.getByRole("button", { name: "Unmatch" }).click();
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();

    await expect(
      page.getByText("Failed to unmatch. Please try again."),
    ).toBeVisible();
    await expect(page.getByText("Sophea Chan")).toBeVisible();
    expect(state.unmatchRequests).toBe(1);
    expect(state.matchingGets).toBeGreaterThanOrEqual(2);
  });

  test("@mobile confirms an employee unmatch without layout overflow", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "The mobile journey uses the Pixel viewport",
    );
    const state: CompanyJourneyState = {};
    await mockApi(page, companyJourneyApi(state));
    await openAsCompany(page, "/matching");

    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Unmatch" }).click();
    await expect(
      page.getByRole("dialog", { name: "Unmatch Sophea Chan?" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();
    await expect(page.getByText("No matches yet")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(state.unmatchRequests).toBe(1);
  });
});
