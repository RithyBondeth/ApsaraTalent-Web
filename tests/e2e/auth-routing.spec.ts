import { expect, test } from "@playwright/test";
import {
  captureRuntimeFailures,
  mockBackendUnavailable,
  setRole,
} from "./helpers";

test("anonymous users return to login with the complete callback URL", async ({ page }) => {
  await page.goto("/search/employee?q=typescript&page=2");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  const url = new URL(page.url());
  expect(url.searchParams.get("callbackUrl")).toBe("/search/employee?q=typescript&page=2");
  await expect(page.getByRole("heading", { name: "Log in to your Account" })).toBeVisible();
});

test("authenticated users are redirected away from guest pages", async ({ page }) => {
  await setRole(page, "employee");
  await mockBackendUnavailable(page);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.locator("body")).not.toBeEmpty();
});

test("users without a role are sent to onboarding and can remain there", async ({ page }) => {
  await setRole(page, "none");
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/signup\/option$/);
  await expect(
    page.getByRole("heading", { name: "Who do you wanna be in our platform?" }),
  ).toBeVisible();
});

test("an expired session returns the user to login", async ({ page }) => {
  await setRole(page, "employee");
  await mockBackendUnavailable(page);
  await page.goto("/feed");
  await expect(page).toHaveURL(/\/feed$/);

  await page.context().clearCookies();
  await page.goto("/message?conversation=conversation-1");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  expect(new URL(page.url()).searchParams.get("callbackUrl")).toBe(
    "/message?conversation=conversation-1",
  );
});

test("representative authenticated pages render without uncaught runtime errors", async ({ page }) => {
  await setRole(page, "employee");
  const failures: string[] = [];

  for (const route of [
    "/dashboard",
    "/favorite",
    "/feed",
    "/interview",
    "/matching",
    "/message",
    "/notification",
    "/profile/company",
    "/profile/employee",
    "/resume-builder",
    "/resume-builder/edit",
    "/search/company",
    "/search/employee",
    "/setting",
  ]) {
    const routePage = await page.context().newPage();
    await mockBackendUnavailable(routePage);
    const routeFailures = captureRuntimeFailures(routePage);
    const response = await routePage.goto(route, { waitUntil: "load" });
    expect(response?.status(), `${route} response`).toBe(200);
    await expect(routePage).toHaveURL(
      new RegExp(`${route.replaceAll("/", "\\/")}$`),
    );
    await expect(routePage.locator("body")).not.toBeEmpty();
    failures.push(...routeFailures);
    await routePage.close();
  }

  expect(failures).toEqual([]);
});
