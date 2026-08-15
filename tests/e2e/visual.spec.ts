import { expect, test } from "@playwright/test";
import { loginEmployee, mockApi, successfulEmployeeApi } from "./helpers";

test("key pages match reviewed visual baselines", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Visual baselines are maintained in Chromium",
  );
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
  // Logging in fires a success toast that auto-dismisses within about a second.
  // Whether it is still on screen at capture time is a race with how fast the
  // run is — it lands in the shot locally but not on slower CI. Hide the
  // toaster outright rather than waiting it out, so the baseline captures the
  // page's steady state instead of encoding machine speed.
  await page.addStyleTag({
    content: "[data-sonner-toaster]{display:none !important}",
  });
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("dashboard.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.04,
  });
});
