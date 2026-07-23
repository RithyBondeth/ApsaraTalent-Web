import { expect, test } from "@playwright/test";
import { loginEmployee, mockApi, successfulEmployeeApi } from "./helpers";

test("key pages match reviewed visual baselines", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Visual baselines are maintained in Chromium");
  test.setTimeout(45_000);
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

  for (const [route, name] of [
    ["/", "landing.png"],
    ["/login", "login.png"],
  ] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(name, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.04,
    });
  }

  await mockApi(page, successfulEmployeeApi);
  await loginEmployee(page, "/dashboard");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("dashboard.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.04,
  });
});
