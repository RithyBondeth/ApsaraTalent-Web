import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  loginEmployee,
  mockApi,
  successfulEmployeeApi,
} from "./helpers";

const publicContentRoutes = [
  "/",
  "/product",
  "/learn",
  "/safety",
  "/support",
  "/privacy",
  "/terms",
] as const;

const protectedRoutes = [
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
] as const;

async function expectAccessible(
  page: import("@playwright/test").Page,
  route: string,
) {
  // Audit the settled page, not a frame of its entrance. The landing hero fades
  // its heading and description in over ~1.6s, so an 800ms sample caught them
  // mid-tween — axe read the transient opacity as a contrast failure on text
  // that reaches full contrast a moment later. Reduced motion makes the state
  // deterministic: the GSAP hooks show everything instantly under it, which is
  // the same thing visual.spec.ts already does for its baselines.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    results.violations,
    `${route}: ${JSON.stringify(results.violations)}`,
  ).toEqual([]);
}

test("public pages expose production security headers", async ({ page }) => {
  const response = await page.goto("/login");
  const contentSecurityPolicy = response?.headers()["content-security-policy"];
  expect(contentSecurityPolicy).toContain("default-src 'self'");
  expect(contentSecurityPolicy).toContain("object-src 'none'");
  expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response?.headers()["permissions-policy"]).toContain(
    "microphone=(self)",
  );
});

test("authentication pages have no automatically detectable WCAG A/AA violations", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const route of [
    "/login",
    "/login/phone-number",
    "/forgot-password",
    "/reset-password?token=e2e-token",
    "/signup/option",
  ]) {
    await page.goto(route);
    await expectAccessible(page, route);
  }
});

test("public content pages have no detectable WCAG A/AA violations", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "The complete accessibility matrix runs once",
  );
  test.setTimeout(120_000);
  for (const route of publicContentRoutes) {
    await page.goto(route);
    await expectAccessible(page, route);
  }
});

test("authenticated pages have no detectable WCAG A/AA violations", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "The complete accessibility matrix runs once",
  );
  test.setTimeout(180_000);
  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page);
  for (const route of protectedRoutes) {
    await page.goto(route);
    await expectAccessible(page, route);
  }
});

test("production login stays within navigation and resource budgets", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Performance budget is calibrated for Chromium",
  );
  await page.goto("/login", { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const transferredBytes = performance
      .getEntriesByType("resource")
      .reduce(
        (total, entry) =>
          total + (entry as PerformanceResourceTiming).transferSize,
        0,
      );
    return { durationMs: navigation.duration, transferredBytes };
  });
  expect(metrics.durationMs).toBeLessThan(10_000);
  expect(metrics.transferredBytes).toBeLessThan(5_000_000);
});

test("key production pages stay within navigation and resource budgets", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Performance budgets are calibrated for Chromium",
  );
  test.setTimeout(75_000);
  await mockApi(page, successfulEmployeeApi);

  for (const route of ["/", "/product"] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      durationMs: (
        performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming
      ).duration,
      transferredBytes: performance
        .getEntriesByType("resource")
        .reduce(
          (total, entry) =>
            total + (entry as PerformanceResourceTiming).transferSize,
          0,
        ),
    }));
    expect(metrics.durationMs, `${route} navigation`).toBeLessThan(10_000);
    expect(metrics.transferredBytes, `${route} transfer`).toBeLessThan(
      6_000_000,
    );
  }

  await loginEmployee(page);
  for (const route of [
    "/favorite",
    "/feed",
    "/matching",
    "/message",
    "/resume-builder",
  ] as const) {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const transferredBytes = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .reduce(
          (total, entry) =>
            total + (entry as PerformanceResourceTiming).transferSize,
          0,
        ),
    );
    expect(transferredBytes, `${route} transfer`).toBeLessThan(8_000_000);
  }
});

test("@mobile public and authenticated pages avoid horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chromium",
    "The mobile matrix uses the Pixel viewport",
  );
  test.setTimeout(75_000);
  for (const route of [
    ...publicContentRoutes,
    "/login",
    "/forgot-password",
  ] as const) {
    await page.goto(route);
    await expect(page.locator("body")).not.toBeEmpty();
    await expectNoHorizontalOverflow(page);
  }

  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page);
  for (const route of protectedRoutes) {
    await page.goto(route);
    await expect(page.locator("body")).not.toBeEmpty();
    await expectNoHorizontalOverflow(page);
  }
});
