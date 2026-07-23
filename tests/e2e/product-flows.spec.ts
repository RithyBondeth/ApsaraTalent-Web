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
  test.setTimeout(60_000);
  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page);
  const failures: string[] = [];
  const routeFailures = captureRuntimeFailures(page);

  for (const route of productRoutes) {
    const failureStart = routeFailures.length;
    const response = await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(300);
    expect(response?.status(), `${route} response`).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await expect(page.locator("body")).not.toBeEmpty();
    failures.push(
      ...routeFailures.slice(failureStart).map((failure) => `${route}: ${failure}`),
    );
  }

  expect(failures).toEqual([]);
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
