import { expect, test, type Request } from "@playwright/test";
import {
  captureRuntimeFailures,
  expectNoHorizontalOverflow,
  loginEmployee,
  mockApi,
  successfulEmployeeApi,
} from "./helpers";

const employee = {
  id: "employee-1",
  firstname: "Sophea",
  lastname: "Chan",
  username: "sophea.chan",
  gender: "female",
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
};

const currentUser = {
  id: "user-1",
  email: "candidate@example.com",
  role: "employee",
  createdAt: "2026-01-01T00:00:00.000Z",
  employee,
};

const openPosition = {
  id: "position-1",
  title: "Frontend Engineer",
  description: "Build accessible product interfaces",
  type: "full_time",
  experience: "mid",
  education: "bachelor",
  skills: ["React", "TypeScript"],
};

const company = {
  id: "company-1",
  name: "Apsara Labs",
  industry: "Technology",
  email: "hello@apsara.test",
  description: "A Cambodian product engineering company",
  avatar: "",
  companySize: 45,
  foundedYear: 2020,
  location: "Phnom Penh",
  phone: "023123456",
  websiteUrl: "https://example.com",
  openPositions: [openPosition],
  values: [],
  benefits: [],
  careerScopes: [],
  socials: [],
  images: [],
  skillScore: 86,
};

const favorite = {
  id: "favorite-1",
  createdAt: "2026-07-20T00:00:00.000Z",
  userId: "employee-1",
  company,
};

type JourneyState = {
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

function journeyApi(state: JourneyState) {
  return async (request: Request) => {
    const pathname = new URL(request.url()).pathname;
    const method = request.method();

    if (pathname.endsWith("/user/current-user")) {
      return { body: currentUser };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/user/employee/all-favorites/employee-1")
    ) {
      state.favoriteGets = (state.favoriteGets ?? 0) + 1;
      return { body: state.favoriteRemoved ? [] : [favorite] };
    }

    if (
      method === "POST" &&
      pathname.endsWith(
        "/user/employee/employee-1/unfavorite/favorite-1/company/company-1",
      )
    ) {
      state.favoriteRemovals = (state.favoriteRemovals ?? 0) + 1;
      if (state.favoriteFailure) {
        return {
          status: 503,
          body: { message: "Favorite service unavailable" },
        };
      }
      state.favoriteRemoved = true;
      return { body: { message: "Favorite removed" } };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/match/current-employee-matching/employee-1")
    ) {
      state.matchingGets = (state.matchingGets ?? 0) + 1;
      return { body: state.matchRemoved ? [] : [company] };
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
        body: { id: "chat-1", senderId: "employee-1", receiverId: "company-1" },
      };
    }

    if (method === "GET" && pathname.endsWith("/user/company/one/company-1")) {
      return { body: company };
    }

    return successfulEmployeeApi(request);
  };
}

test.describe("authenticated favorite journeys", () => {
  test("removes a saved company and refreshes the empty state", async ({
    page,
  }) => {
    const state: JourneyState = {};
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/favorite");

    await expect(page.getByText("Apsara Labs")).toBeVisible();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(
      page.getByText("Apsara Labs removed from favorites."),
    ).toBeVisible();
    await expect(page.getByText("Favorite List Empty")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore more" }),
    ).toHaveAttribute("href", "/search/company");
    expect(state.favoriteRemovals).toBe(1);
    expect(state.favoriteGets).toBeGreaterThanOrEqual(2);
  });

  test("keeps the saved company when removal fails", async ({ page }) => {
    const state: JourneyState = { favoriteFailure: true };
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/favorite");

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Favorite service unavailable")).toBeVisible();
    await expect(page.getByText("Apsara Labs")).toBeVisible();
    expect(state.favoriteRemovals).toBe(1);
    expect(state.favoriteGets).toBeGreaterThanOrEqual(1);
  });

  test("@mobile removes a saved company without layout overflow", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "The mobile journey uses the Pixel viewport",
    );
    const state: JourneyState = {};
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/favorite");

    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Favorite List Empty")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(state.favoriteRemovals).toBe(1);
  });

  test("opens the saved company detail page without runtime failures", async ({
    page,
  }) => {
    const failures = captureRuntimeFailures(page);
    await mockApi(page, journeyApi({}));
    await loginEmployee(page, "/favorite");

    await page.getByRole("button", { name: "View Detail" }).click();
    await expect(page).toHaveURL(/\/feed\/company\/company-1$/);
    await expect(page.getByText("Apsara Labs").first()).toBeVisible();
    expect(failures).toEqual([]);
  });
});

test.describe("authenticated matching journeys", () => {
  test("starts only one chat when the action is clicked twice rapidly", async ({
    page,
  }) => {
    const state: JourneyState = { chatDelayMs: 500 };
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/matching");
    const chatButton = page.getByRole("button", { name: "Chat Now" });

    await expect(chatButton).toBeVisible();
    await chatButton.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
    await expect(page).toHaveURL(/\/message\?chatId=chat-1$/);
    expect(state.chatRequests).toBe(1);
  });

  test("opens interview scheduling for the selected company", async ({
    page,
  }) => {
    await mockApi(page, journeyApi({}));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Schedule" }).click();
    await expect(page).toHaveURL(/\/interview\?with=company-1$/);
  });

  test("confirms and completes an unmatch", async ({ page }) => {
    const state: JourneyState = {};
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Unmatch" }).click();
    await expect(
      page.getByRole("dialog", { name: "Unmatch Apsara Labs?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();

    await expect(page.getByText("Unmatched successfully.")).toBeVisible();
    await expect(page.getByText("Matching List Empty")).toBeVisible();
    expect(state.unmatchRequests).toBe(1);
  });

  test("restores the match when unmatching fails", async ({ page }) => {
    const state: JourneyState = { unmatchFailure: true };
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Unmatch" }).click();
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();

    await expect(
      page.getByText("Failed to unmatch. Please try again."),
    ).toBeVisible();
    await expect(page.getByText("Apsara Labs")).toBeVisible();
    expect(state.unmatchRequests).toBe(1);
    expect(state.matchingGets).toBeGreaterThanOrEqual(2);
  });

  test("@mobile confirms an unmatch without layout overflow", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "The mobile journey uses the Pixel viewport",
    );
    const state: JourneyState = {};
    await mockApi(page, journeyApi(state));
    await loginEmployee(page, "/matching");

    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Unmatch" }).click();
    await expect(
      page.getByRole("dialog", { name: "Unmatch Apsara Labs?" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Yes, Unmatch" }).click();
    await expect(page.getByText("Matching List Empty")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(state.unmatchRequests).toBe(1);
  });
});
