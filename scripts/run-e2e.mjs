import { spawn } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:13000",
        SENTRY_AUTH_TOKEN: "",
        SENTRY_ORG: "",
        SENTRY_PROJECT: "",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    });
  }

  const standalone = join(root, ".next/standalone");
  assert(
    existsSync(join(standalone, "server.js")),
    "Standalone build missing. Run npm run build first.",
  );

  runtimeDir = await mkdtemp(join(tmpdir(), "apsara-web-e2e-"));
  await cp(standalone, runtimeDir, { recursive: true });
  await cp(join(root, ".next/static"), join(runtimeDir, ".next/static"), {
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

  const protectedPage = await fetch(`${baseUrl}/profile/employee`, {
    redirect: "manual",
  });
  assert(
    [307, 308].includes(protectedPage.status),
    `Protected page returned ${protectedPage.status}`,
  );
  assert(
    protectedPage.headers.get("location")?.includes("/login?callbackUrl="),
    "Protected page did not redirect to login",
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

  process.stdout.write(
    "Web e2e passed: health, landing, auth redirect, logout cookies, standalone runtime\n",
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
