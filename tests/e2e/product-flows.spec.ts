import { expect, test } from "@playwright/test";
import {
  captureRuntimeFailures,
  loginEmployee,
  mockApi,
  successfulEmployeeApi,
} from "./helpers";

const productRoutes = [
  "/favorite",
  "/matching",
  "/interview",
  "/notification",
  "/message",
  "/resume-builder",
  "/search/company",
  "/search/employee",
  "/setting",
] as const;

test("core product pages handle successful empty API responses", async ({ page }) => {
  test.setTimeout(150_000);
  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page);
  const failures: string[] = [];

  for (const route of productRoutes) {
    const routePage = await page.context().newPage();
    await mockApi(routePage, successfulEmployeeApi);
    const routeFailures = captureRuntimeFailures(routePage);
    const response = await routePage.goto(route, { waitUntil: "load" });
    await routePage.waitForTimeout(300);
    expect(response?.status(), `${route} response`).toBe(200);
    await expect(routePage).toHaveURL(
      new RegExp(`${route.replaceAll("/", "\\/")}$`),
    );
    await expect(routePage.locator("body")).not.toBeEmpty();
    failures.push(
      ...routeFailures.map((failure) => `${route}: ${failure}`),
    );
    await routePage.close();
  }

  expect(failures).toEqual([]);
});

test("search pages recover from malformed paginated API responses", async ({
  page,
}) => {
  const failures = captureRuntimeFailures(page);
  await mockApi(page, (request) => {
    const pathname = new URL(request.url()).pathname;
    if (
      pathname.includes("/search-employee") ||
      pathname.includes("/job/search")
    ) {
      return { body: [] };
    }
    return successfulEmployeeApi(request);
  });

  await loginEmployee(page, "/search/company");
  await expect(
    page.getByText("Invalid employee search response"),
  ).toBeVisible();

  await page.goto("/search/employee");
  await expect(page.getByText("Invalid job search response")).toBeVisible();
  const relevantFailures = failures.filter(
    (failure) =>
      !failure.includes("Failed to fetch RSC payload") &&
      !failure.includes("due to access control checks."),
  );
  expect(relevantFailures).toEqual([]);
});

test("search updates its shareable URL and can clear the keyword", async ({ page }) => {
  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page, "/search/employee");
  const keyword = page.getByPlaceholder("Job title, keywords");

  await keyword.fill("TypeScript");
  await expect(page).toHaveURL(/q=TypeScript/, { timeout: 5_000 });
  await keyword.fill("");
  await expect(page).not.toHaveURL(/q=/, { timeout: 5_000 });
});

test("settings persist theme and language choices", async ({ page }) => {
  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page, "/setting");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  await page.getByRole("button", { name: /Dark/ }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: /Khmer/ }).click();
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "language")?.value)
    .toBe("km");
});
