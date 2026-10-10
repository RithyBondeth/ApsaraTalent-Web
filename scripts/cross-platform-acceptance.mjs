import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, appendFile, copyFile } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";

const web = process.env.ACCEPTANCE_WEB_URL || "http://127.0.0.1:14000";
const api = process.env.ACCEPTANCE_API_URL || "http://127.0.0.1:13000";
const device = process.env.ACCEPTANCE_DEVICE;
const sdk =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  join(homedir(), "Library/Android/sdk");
const sdkAdb = join(
  sdk,
  "platform-tools",
  process.platform === "win32" ? "adb.exe" : "adb",
);
const adb = process.env.ACCEPTANCE_ADB || (existsSync(sdkAdb) ? sdkAdb : "adb");
const mobile = fileURLToPath(
  new URL("../../ApsaraTalent-Mobile", import.meta.url),
);
const output =
  process.env.ACCEPTANCE_OUTPUT_DIR ||
  fileURLToPath(new URL("../test-results/cross-platform/", import.meta.url));
if (!device)
  throw new Error(
    "Set ACCEPTANCE_DEVICE to an iOS simulator or Android emulator ID",
  );
for (const url of [web, api]) {
  if (!["127.0.0.1", "localhost"].includes(new URL(url).hostname))
    throw new Error("Acceptance fixtures must use the isolated loopback stack");
}
if (device.startsWith("emulator-")) {
  assert.equal(
    execFileSync(adb, ["-s", device, "get-state"], { encoding: "utf8" }).trim(),
    "device",
    "Start the Android emulator first",
  );
} else {
  const simulators = JSON.parse(
    execFileSync(
      "xcrun",
      ["simctl", "list", "devices", "available", "--json"],
      { encoding: "utf8" },
    ),
  );
  assert(
    Object.values(simulators.devices)
      .flat()
      .some((item) => item.udid === device && item.state === "Booted"),
    "ACCEPTANCE_DEVICE must identify a booted iOS simulator or Android emulator",
  );
}
await mkdir(output, { recursive: true });
const results = [];
let cookie = "";
async function request(path, method = "GET", body) {
  const response = await fetch(new URL(path, api), {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: web,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (path === "/auth/login")
    cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
  assert(response.ok, `${path}: HTTP ${response.status}`);
  return response.json();
}
async function signIn(page) {
  await page.goto(`${web}/login`);
  await page
    .getByPlaceholder("Email", { exact: true })
    .fill("candidate@local.test");
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("LocalTest!12345");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/feed$/, { timeout: 40_000 });
}
async function openDraft(page, name) {
  await page.goto(`${web}/resume-builder`);
  const row = page
    .locator("div")
    .filter({ has: page.locator("span", { hasText: name }) })
    .filter({ has: page.getByRole("button", { name: "Open", exact: true }) })
    .last();
  await row.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveURL(/\/resume-builder\/edit$/, { timeout: 30_000 });
  return page.getByPlaceholder(
    "A brief professional summary about yourself...",
  );
}
const id = randomUUID();
const name = `Acceptance ${id}`;
const browserText = `Written in the real browser ${id}`;
const mobileText = `Edited in the native app ${id}`;
const browser = await chromium.launch({ headless: true });
let created = false;
try {
  await request("/auth/login", "POST", {
    identifier: "candidate@local.test",
    password: "LocalTest!12345",
  });
  const seed = (await request("/resume/drafts"))[0];
  assert(seed, "The disposable stack must seed a full shared resume");
  const source = await request(`/resume/drafts/${seed.id}`);
  const content = { ...source.content, summary: "Awaiting browser edit" };
  await request("/resume/drafts", "POST", { id, name, content });
  created = true;
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await signIn(page);
  const summary = await openDraft(page, name);
  await summary.fill(browserText);
  await expect
    .poll(async () => (await request(`/resume/drafts/${id}`)).content.summary, {
      timeout: 20_000,
    })
    .toBe(browserText);
  results.push({
    journey: "real browser login and cloud autosave",
    status: "passed",
  });
  await page.screenshot({
    path: `${output}/browser-before-mobile.png`,
    fullPage: true,
  });

  const nativeLog = `${output}/native.log`;
  await writeFile(nativeLog, "");
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      "flutter",
      [
        "test",
        "--no-pub",
        "--no-uninstall",
        "integration_test/local_journeys_test.dart",
        "-d",
        device,
        "--dart-define=LOCAL_ACCEPTANCE=true",
        `--dart-define=ACCEPTANCE_DRAFT_NAME=${name}`,
        `--dart-define=ACCEPTANCE_API_BASE_URL=${api}`,
        `--dart-define=ACCEPTANCE_BROWSER_TEXT=${browserText}`,
        `--dart-define=ACCEPTANCE_MOBILE_TEXT=${mobileText}`,
      ],
      { cwd: mobile, stdio: ["ignore", "pipe", "pipe"] },
    );
    child.stdout.on("data", (chunk) => void appendFile(nativeLog, chunk));
    child.stderr.on("data", (chunk) => void appendFile(nativeLog, chunk));
    child.once("error", reject);
    child.once("exit", resolve);
  });
  assert.equal(exitCode, 0, `Native journey failed; inspect ${nativeLog}`);
  for (const shot of ["feed", "khmer-resume"]) {
    const filename = `apsara-acceptance-${shot}.png`;
    if (device.startsWith("emulator-")) {
      const appId =
        process.env.ACCEPTANCE_ANDROID_APP_ID ||
        "com.example.apsaratalent_mobile";
      const bytes = execFileSync(
        adb,
        ["-s", device, "exec-out", "run-as", appId, "cat", `cache/${filename}`],
        { maxBuffer: 10 * 1024 * 1024 },
      );
      await writeFile(`${output}/native-${shot}.png`, bytes);
    } else {
      const appId = execFileSync(
        "/usr/libexec/PlistBuddy",
        [
          "-c",
          "Print :CFBundleIdentifier",
          `${mobile}/build/ios/iphonesimulator/Runner.app/Info.plist`,
        ],
        { encoding: "utf8" },
      ).trim();
      const container = execFileSync(
        "xcrun",
        ["simctl", "get_app_container", device, appId, "data"],
        { encoding: "utf8" },
      ).trim();
      await copyFile(
        `${container}/tmp/${filename}`,
        `${output}/native-${shot}.png`,
      );
    }
  }
  const saved = await request(`/resume/drafts/${id}`);
  assert.equal(saved.content.summary, mobileText);
  assert.deepEqual(saved.content.design, content.design);
  assert.deepEqual(saved.content.sectionOrder, content.sectionOrder);
  results.push({
    journey: "native sign-in, dashboard, resume edit and Khmer",
    status: "passed",
  });

  const staleSave = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/resume/drafts/${id}`) &&
      response.request().method() === "PUT",
  );
  await summary.fill(
    "This stale browser edit must never overwrite the mobile edit",
  );
  assert.equal((await staleSave).status(), 409);
  assert.equal(
    (await request(`/resume/drafts/${id}`)).content.summary,
    mobileText,
  );
  results.push({
    journey: "stale browser revision cannot overwrite the native edit",
    status: "passed",
  });
  await page.screenshot({
    path: `${output}/browser-conflict.png`,
    fullPage: true,
  });
  const fresh = await browser.newPage();
  await signIn(fresh);
  await expect(await openDraft(fresh, name)).toHaveValue(mobileText);
  results.push({
    journey: "fresh browser session opens the native edit",
    status: "passed",
  });
  console.log(
    "Cross-platform acceptance passed: browser → native → browser, including revision conflict protection.",
  );
} catch (error) {
  results.push({ status: "failed", error: error.message });
  throw error;
} finally {
  if (created) await request(`/resume/drafts/${id}`, "DELETE").catch(() => {});
  await browser.close();
  await writeFile(
    `${output}/results.json`,
    JSON.stringify(
      { testedAt: new Date().toISOString(), web, api, device, results },
      null,
      2,
    ) + "\n",
  );
}
