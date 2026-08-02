import { defineConfig, devices } from "@playwright/test";

const port = 14_001;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const shouldStartServer = !process.env.PLAYWRIGHT_BASE_URL;
const shouldBuild = process.env.PLAYWRIGHT_SKIP_BUILD !== "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Keep the production server and three browser engines within a stable
  // resource envelope. Cross-engine concurrency caused intermittent WebKit
  // navigation failures on the full suite even though isolated tests passed.
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: shouldStartServer
    ? {
        command: shouldBuild
          ? "npm run build && node scripts/start-e2e-server.mjs"
          : "node scripts/start-e2e-server.mjs",
        url: `${baseURL}/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          NEXT_DIST_DIR: ".next-e2e",
          NEXT_PUBLIC_API_URL: "http://127.0.0.1:13000",
          NEXT_TELEMETRY_DISABLED: "1",
          SENTRY_DSN: "",
          NEXT_PUBLIC_SENTRY_DSN: "",
        },
      }
    : undefined,
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "desktop-firefox",
      workers: 1,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "desktop-webkit",
      workers: 1,
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chromium",
      grep: /@mobile/,
      use: { ...devices["Pixel 7"] },
    },
  ],
});
