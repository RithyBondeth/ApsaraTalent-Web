import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const E2E_DIST_DIR = ".next-e2e";

export function resolveDistDir({
  skipBuild = process.env.E2E_SKIP_BUILD === "1",
} = {}) {
  if (process.env.NEXT_DIST_DIR) return process.env.NEXT_DIST_DIR;
  if (skipBuild) {
    const e2eStandalone = join(ROOT, E2E_DIST_DIR, "standalone", "server.js");
    const defaultStandalone = join(ROOT, ".next", "standalone", "server.js");
    if (!existsSync(e2eStandalone) && existsSync(defaultStandalone)) {
      return ".next";
    }
  }
  return E2E_DIST_DIR;
}
