import { expect, type Page, type Request } from "@playwright/test";

export const AUTH_ROLE_COOKIE = "auth-session-role";

export async function setRole(page: Page, role: "employee" | "company" | "none") {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:14001";
  const cookie = {
      name: AUTH_ROLE_COOKIE,
      value: role,
      httpOnly: true,
      sameSite: "Strict",
    } as const;
  await page.context().addCookies([
    { ...cookie, url: new URL(baseURL).origin },
    { ...cookie, url: "http://localhost:14001" },
  ]);
}

export async function mockBackendUnavailable(page: Page) {
  await page.route("http://127.0.0.1:13000/**", async (route) => {
    const origin = route.request().headers()["origin"] ?? "http://127.0.0.1:14001";
    const headers = {
      "access-control-allow-origin": origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
    };
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      headers,
      body: JSON.stringify({ message: "E2E backend intentionally unavailable" }),
    });
  });
}

type MockApiResult = {
  body?: unknown;
  headers?: Record<string, string>;
  status?: number;
};

export async function mockApi(
  page: Page,
  resolver: (request: Request) => MockApiResult | Promise<MockApiResult>,
) {
  await page.route("http://127.0.0.1:13000/**", async (route) => {
    const request = route.request();
    const origin = request.headers()["origin"] ?? "http://localhost:14001";
    const corsHeaders = {
      "access-control-allow-origin": origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    const result = await resolver(request);
    await route.fulfill({
      status: result.status ?? 200,
      contentType: "application/json",
      headers: { ...corsHeaders, ...result.headers },
      body: JSON.stringify(result.body ?? {}),
    });
  });
}

export function successfulEmployeeApi(request: Request): MockApiResult {
  const pathname = new URL(request.url()).pathname;
  if (pathname.endsWith("/auth/login")) {
    return {
      body: {
        message: "Logged in",
        user: { id: "user-1", role: "employee" },
      },
    };
  }
  if (pathname.endsWith("/auth/verify-otp")) {
    return {
      body: {
        message: "OTP verified",
        user: { id: "user-1", role: "employee" },
      },
    };
  }
  if (pathname.endsWith("/user/current-user")) {
    return {
      body: {
        id: "user-1",
        email: "candidate@example.com",
        role: "employee",
        createdAt: "2026-01-01T00:00:00.000Z",
        employee: {
          id: "employee-1",
          firstName: "Sophea",
          lastName: "Chan",
          username: "sophea.chan",
          careerScopes: [],
        },
      },
    };
  }
  if (pathname.includes("/job/search")) {
    return {
      body: { data: [], total: 0, page: 1, pageSize: 20, isUsingFallback: false },
    };
  }
  if (pathname.includes("/notification") && pathname.includes("unread")) {
    return { body: { unreadCount: 0 } };
  }
  if (pathname.includes("/notification")) {
    return { body: { items: [], total: 0, page: 1, limit: 20 } };
  }
  if (pathname.includes("/count")) return { body: { count: 0 } };
  if (pathname.includes("/quota")) {
    return {
      body: {
        daily: { used: 0, limit: 10, remaining: 10 },
        resetsAt: "2026-07-24T00:00:00.000Z",
      },
    };
  }
  return { body: [] };
}

export async function loginEmployee(page: Page, callbackUrl = "/feed") {
  await page.goto(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  await page.getByLabel("Email").fill("candidate@example.com");
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill("StrongPass1!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(
    new RegExp(`${callbackUrl.replaceAll("/", "\\/")}$`),
    { timeout: 10_000 },
  );
}

export function captureRuntimeFailures(page: Page) {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("E2E backend intentionally unavailable") &&
      !message.text().includes("Failed to load resource")
    ) {
      failures.push(message.text());
    }
  });
  return failures;
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}
