import { spawn } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = process.env.NEXT_DIST_DIR ?? ".next-e2e";
const port = 14000;
const baseUrl = `http://127.0.0.1:${port}`;
let runtimeDir;
let server;
let serverOutput = "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      ...options,
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolvePromise();
      else
        reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function waitForHealth(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Web server exited before readiness:\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return response;
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Timed out waiting for ${baseUrl}/health\n${serverOutput}`);
}

async function stopServer() {
  if (!server || server.exitCode !== null) return;
  await new Promise((resolvePromise) => {
    server.once("exit", resolvePromise);
    server.kill("SIGTERM");
    setTimeout(() => {
      if (server.exitCode === null) server.kill("SIGKILL");
    }, 5000).unref();
  });
}

async function cleanup() {
  await stopServer();
  if (runtimeDir) await rm(runtimeDir, { recursive: true, force: true });
}

let exitCode = 0;
try {
  if (process.env.E2E_SKIP_BUILD !== "1") {
    await run("npm", ["run", "build"], {
      env: {
        ...process.env,
        NEXT_DIST_DIR: distDir,
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:13000",
        SENTRY_AUTH_TOKEN: "",
        SENTRY_ORG: "",
        SENTRY_PROJECT: "",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    });
  }

  const standalone = join(root, distDir, "standalone");
  assert(
    existsSync(join(standalone, "server.js")),
    "Standalone build missing. Run npm run build first.",
  );

  runtimeDir = await mkdtemp(join(tmpdir(), "apsara-web-e2e-"));
  await cp(standalone, runtimeDir, { recursive: true });
  await cp(join(root, distDir, "static"), join(runtimeDir, distDir, "static"), {
    recursive: true,
  });
  if (existsSync(join(root, "public"))) {
    await cp(join(root, "public"), join(runtimeDir, "public"), {
      recursive: true,
    });
  }

  server = spawn(process.execPath, [join(runtimeDir, "server.js")], {
    cwd: runtimeDir,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NEXT_PUBLIC_API_URL: "http://127.0.0.1:13000",
      NEXT_TELEMETRY_DISABLED: "1",
      SENTRY_DSN: "",
      NEXT_PUBLIC_SENTRY_DSN: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const capture = (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-12000);
  };
  server.stdout.on("data", capture);
  server.stderr.on("data", capture);

  const health = await waitForHealth();
  const healthBody = await health.json();
  assert(healthBody.status === "ok", "Web health status is not ok");
  assert(
    healthBody.apiBaseUrlConfigured === true,
    "Web runtime does not have an API URL",
  );

  const landing = await fetch(`${baseUrl}/`);
  assert(landing.status === 200, `Landing page returned ${landing.status}`);
  assert(
    (await landing.text()).toLowerCase().includes("<!doctype html"),
    "Landing page did not return HTML",
  );

  const expectedSecurityHeaders = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
  };
  for (const [header, expected] of Object.entries(expectedSecurityHeaders)) {
    assert(
      landing.headers.get(header) === expected,
      `Landing page ${header} header is missing or invalid`,
    );
  }

  const publicRoutes = [
    "/product",
    "/learn",
    "/safety",
    "/support",
    "/privacy",
    "/terms",
    "/login",
    "/login/phone-number",
    "/login/phone-number/phone-otp",
    "/login/email-verification/smoke-test-id",
    "/forgot-password",
    "/reset-password",
    "/signup",
    "/signup/option",
    "/signup/employee",
    "/signup/company",
  ];
  for (const route of publicRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert(response.status === 200, `${route} returned ${response.status}`);
    assert(
      (response.headers.get("content-type") ?? "").includes("text/html"),
      `${route} did not return HTML`,
    );
  }

  const icon = await fetch(`${baseUrl}/icon.svg`);
  assert(icon.status === 200, `/icon.svg returned ${icon.status}`);
  assert(
    (icon.headers.get("content-type") ?? "").includes("image/svg+xml"),
    "/icon.svg did not return SVG content",
  );

  const notFound = await fetch(`${baseUrl}/this-route-must-not-exist`);
  assert(notFound.status === 404, `Unknown route returned ${notFound.status}`);

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
  ];
  for (const route of protectedRoutes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    assert(
      [307, 308].includes(response.status),
      `${route} returned ${response.status} instead of redirecting`,
    );
    const location = response.headers.get("location") ?? "";
    assert(location.includes("/login?callbackUrl="), `${route} did not redirect to login`);
    assert(
      decodeURIComponent(location).includes(`callbackUrl=${route}`),
      `${route} did not preserve its callback URL`,
    );
  }

  const employeeCookie = "auth-session-role=employee";
  for (const route of protectedRoutes) {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: { cookie: employeeCookie },
      redirect: "manual",
    });
    assert(
      response.status === 200,
      `Authenticated ${route} returned ${response.status}`,
    );
    assert(
      (response.headers.get("content-type") ?? "").includes("text/html"),
      `Authenticated ${route} did not return HTML`,
    );
  }

  for (const route of ["/", "/login", "/signup/company"]) {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: { cookie: employeeCookie },
      redirect: "manual",
    });
    assert(
      [307, 308].includes(response.status),
      `Authenticated ${route} did not redirect away from guest access`,
    );
    assert(
      new URL(response.headers.get("location"), baseUrl).pathname === "/feed",
      `Authenticated ${route} did not redirect to the feed`,
    );
  }

  for (const route of ["/", "/dashboard", "/profile/employee"]) {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: { cookie: "auth-session-role=none" },
      redirect: "manual",
    });
    assert(
      [307, 308].includes(response.status),
      `Unassigned-role ${route} did not redirect to onboarding`,
    );
    assert(
      new URL(response.headers.get("location"), baseUrl).pathname ===
        "/signup/option",
      `Unassigned-role ${route} did not redirect to role selection`,
    );
  }

  const onboarding = await fetch(`${baseUrl}/signup/option`, {
    headers: { cookie: "auth-session-role=none" },
    redirect: "manual",
  });
  assert(
    onboarding.status === 200,
    `Unassigned-role onboarding returned ${onboarding.status}`,
  );

  const logout = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
  assert(logout.status === 200, `Logout returned ${logout.status}`);
  const logoutCookies = logout.headers.get("set-cookie") ?? "";
  assert(
    logoutCookies.includes("auth-token="),
    "Logout did not clear auth token",
  );
  assert(
    logoutCookies.toLowerCase().includes("httponly"),
    "Auth cookie is not HTTP-only",
  );
  assert(
    logoutCookies.includes("refresh-token="),
    "Logout did not clear refresh token",
  );
  assert(
    logoutCookies.toLowerCase().includes("samesite=strict"),
    "Logout auth cookies are missing SameSite=strict",
  );

  process.stdout.write(
    `Web e2e passed: health, ${publicRoutes.length + 1} public pages, ${protectedRoutes.length} protected redirects, ${protectedRoutes.length} authenticated pages, auth/onboarding redirects, security headers, static assets, 404, logout cookies, standalone runtime\n`,
  );
} catch (error) {
  exitCode = 1;
  process.stderr.write(
    `Web e2e failed: ${error instanceof Error ? error.stack : error}\n${serverOutput}`,
  );
} finally {
  await cleanup();
}

process.exitCode = exitCode;
