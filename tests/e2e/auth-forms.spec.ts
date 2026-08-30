import { expect, test } from "@playwright/test";
import { mockApi, successfulEmployeeApi } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("login validates fields and supports password visibility", async ({
  page,
}) => {
  await page.goto("/login");
  const email = page.getByLabel("Email");
  const password = page.getByRole("textbox", { name: "Password" });

  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Email is required" }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({ hasText: "Password is required" }),
  ).toBeVisible();

  await email.fill("not-an-email");
  await password.fill("weak");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Invalid email" }),
  ).toBeVisible();

  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
});

test("login submits the expected credentials and surfaces an API rejection", async ({
  page,
}) => {
  await page.route("http://127.0.0.1:13000/**/auth/login", async (route) => {
    const origin =
      route.request().headers()["origin"] ?? "http://127.0.0.1:14001";
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-credentials": "true",
      },
      body: JSON.stringify({ message: "Invalid credentials" }),
    });
  });
  await page.goto("/login");
  await page.getByLabel("Email").fill("candidate@example.com");
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill("StrongPass1!");
  const requestPromise = page.waitForRequest(/\/auth\/login$/);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  const request = await requestPromise;

  expect(request.method()).toBe("POST");
  expect(request.postDataJSON()).toEqual({
    identifier: "candidate@example.com",
    password: "StrongPass1!",
  });
  await expect(page.getByText("Login failed", { exact: true })).toBeVisible();
});

test("successful email login preserves the protected callback destination", async ({
  page,
}) => {
  await mockApi(page, successfulEmployeeApi);
  await page.goto("/login?callbackUrl=%2Fdashboard");
  await page.getByLabel("Email").fill("candidate@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("StrongPass1!");
  const requestPromise = page.waitForRequest(/\/auth\/login$/);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  const request = await requestPromise;

  expect(request.postDataJSON()).toEqual({
    identifier: "candidate@example.com",
    password: "StrongPass1!",
  });
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
  await expect(page.locator("body")).not.toBeEmpty();
});

test("phone login validates malformed Cambodian numbers", async ({ page }) => {
  await page.goto("/login/phone-number");
  await page.getByLabel("Phone Number *").fill("123");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByText("Invalid Khmer phone number", { exact: false }),
  ).toBeVisible();
});

test("phone login sends and verifies an OTP before entering the app", async ({
  page,
}) => {
  await mockApi(page, (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.endsWith("/auth/login-otp")) {
      return { body: { message: "OTP sent" } };
    }
    return successfulEmployeeApi(request);
  });
  await page.goto("/login/phone-number");
  await page.getByLabel("Phone Number *").fill("012345678");
  const sendRequest = page.waitForRequest(/\/auth\/login-otp$/);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  expect((await sendRequest).postDataJSON()).toEqual({ phone: "+85512345678" });
  await expect(page).toHaveURL(/\/login\/phone-number\/phone-otp$/, {
    timeout: 8_000,
  });

  await page.locator("input").fill("123456");
  const verifyRequest = page.waitForRequest(/\/auth\/verify-otp$/);
  await page.getByRole("button", { name: "Continue" }).click();
  expect((await verifyRequest).postDataJSON()).toEqual({
    phone: "+85512345678",
    otp: "123456",
  });
  await expect(page).toHaveURL(/\/feed$/, { timeout: 10_000 });
});

test("forgot-password validates empty and malformed identifiers", async ({
  page,
}) => {
  await page.goto("/forgot-password");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Email or Phone number is required", { exact: true }),
  ).toBeVisible();

  await page.getByLabel("Email or Mobile").fill("not-valid");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Invalid email or Khmer phone number", { exact: true }),
  ).toBeVisible();
});

test("forgot and reset password submit successful recovery requests", async ({
  page,
}) => {
  await mockApi(page, (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.endsWith("/auth/forgot-password")) {
      return { body: { message: "Recovery sent" } };
    }
    if (pathname.endsWith("/auth/reset-password/e2e-reset-token")) {
      return { body: { message: "Password reset" } };
    }
    return { body: {} };
  });
  await page.goto("/forgot-password");
  await page.getByLabel("Email or Mobile").fill("candidate@example.com");
  const forgotRequest = page.waitForRequest(/\/auth\/forgot-password$/);
  await page.getByRole("button", { name: "Continue" }).click();
  expect((await forgotRequest).postDataJSON()).toEqual({
    identifier: "candidate@example.com",
  });
  await expect(page).toHaveURL(/\/reset-password$/, { timeout: 8_000 });

  await page.goto("/reset-password?token=e2e-reset-token");
  await page.getByRole("textbox", { name: "New Password" }).fill("NewStrong1!");
  await page
    .getByRole("textbox", { name: "Confirm Password" })
    .fill("NewStrong1!");
  const resetRequest = page.waitForRequest(
    /\/auth\/reset-password\/e2e-reset-token$/,
  );
  await page.getByRole("button", { name: "Reset Password" }).click();
  expect((await resetRequest).postDataJSON()).toEqual({
    newPassword: "NewStrong1!",
    confirmPassword: "NewStrong1!",
  });
  await expect(page).toHaveURL(/\/login$/, { timeout: 8_000 });
});

test("forgot-password recovers after a temporary server error", async ({
  page,
}) => {
  let attempts = 0;
  await mockApi(page, (request) => {
    if (new URL(request.url()).pathname.endsWith("/auth/forgot-password")) {
      attempts += 1;
      return attempts === 1
        ? { status: 503, body: { message: "Temporarily unavailable" } }
        : { body: { message: "Recovery sent" } };
    }
    return { body: {} };
  });
  await page.goto("/forgot-password");
  const identifier = page.getByLabel("Email or Mobile");
  await identifier.fill("candidate@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("An error occurred", { exact: true }),
  ).toBeVisible();
  await expect(identifier).toBeEnabled();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/reset-password$/, { timeout: 8_000 });
  expect(attempts).toBe(2);
});

test("reset-password validates strength and matching confirmation", async ({
  page,
}) => {
  await page.goto("/reset-password?token=e2e-reset-token");
  const password = page.getByRole("textbox", { name: "New Password" });
  const confirmation = page.getByRole("textbox", { name: "Confirm Password" });
  await password.fill("weak");
  await confirmation.fill("different");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await expect(
    page.getByText("Password must be at least 8 characters", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Passwords do not match", { exact: true }),
  ).toBeVisible();
});

test("role onboarding validates selection and continues company signup", async ({
  page,
}) => {
  await page.goto("/signup/option");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(
    page.getByText("Please select your role.", { exact: true }),
  ).toBeVisible();

  await page.getByRole("combobox", { name: "Who do you wanna be?" }).click();
  await page.getByRole("option", { name: "Company or (Employer)" }).click();
  await expect(
    page.getByRole("combobox", { name: "Who do you wanna be?" }),
  ).toContainText("Company");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(
    page.getByRole("heading", { name: "Welcome to Apsara Talent" }),
  ).toBeVisible();
});

test("company signup carries validated account data into company onboarding", async ({
  page,
}) => {
  await page.goto("/signup/option");
  await page.getByRole("combobox", { name: "Who do you wanna be?" }).click();
  await page.getByRole("option", { name: "Company or (Employer)" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/signup$/);

  await page.getByLabel("Mobile").fill("012345678");
  await page.getByLabel("Email").fill("company@example.com");
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill("StrongPass1!");
  await page
    .getByRole("textbox", { name: "Confirm Password" })
    .fill("StrongPass1!");
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/\/signup\/company$/);
  await expect(
    page.getByRole("heading", { name: "Add Basic information" }),
  ).toBeVisible();
});

test("employee signup carries personal data into employee onboarding", async ({
  page,
}) => {
  await page.goto("/signup/option");
  await page.getByRole("combobox", { name: "Who do you wanna be?" }).click();
  await page.getByRole("option", { name: "Employee or (Freelancer)" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Fill in manually" }).click();
  await expect(page).toHaveURL(/\/signup$/);

  await page.getByLabel("Firstname").fill("Sophea");
  await page.getByLabel("Lastname").fill("Chan");
  await page.getByLabel("Username").fill("sophea.chan");
  await page.getByLabel("Date of Birth").click();
  await page.getByRole("gridcell", { name: "1", exact: true }).first().click();
  await page.getByRole("combobox", { name: "Location" }).click();
  await page.getByRole("option", { name: "Phnom Penh" }).click();
  await page.getByRole("combobox", { name: "Gender" }).click();
  await page.getByRole("option", { name: "Female" }).click();
  await page.getByLabel("Mobile").fill("012345678");
  await page.getByLabel("Email").fill("candidate@example.com");
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill("StrongPass1!");
  await page
    .getByRole("textbox", { name: "Confirm Password" })
    .fill("StrongPass1!");
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/\/signup\/employee$/);
  await expect(page.locator("body")).toContainText(/profession|position/i);
});

test("login keyboard order reaches the primary fields", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "Password" })).toBeFocused();
});
