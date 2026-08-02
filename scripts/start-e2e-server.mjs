import { spawn } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const distDir = process.env.NEXT_DIST_DIR ?? ".next-e2e";
const standalone = join(root, distDir, "standalone");
const serverEntry = join(standalone, "server.js");

if (!existsSync(serverEntry)) {
  throw new Error("Standalone build missing. Run npm run build first.");
}

const staticTarget = join(standalone, distDir, "static");
await rm(staticTarget, { recursive: true, force: true });
await mkdir(join(standalone, distDir), { recursive: true });
await cp(join(root, distDir, "static"), staticTarget, { recursive: true });

if (existsSync(join(root, "public"))) {
  const publicTarget = join(standalone, "public");
  await rm(publicTarget, { recursive: true, force: true });
  await cp(join(root, "public"), publicTarget, { recursive: true });
}

const server = spawn(process.execPath, [serverEntry], {
  cwd: standalone,
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: process.env.PORT ?? "14001",
  },
  stdio: "inherit",
});

const stop = (signal) => {
  if (server.exitCode === null) server.kill(signal);
};

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
server.once("exit", (code, signal) => {
  process.exitCode = signal ? 0 : (code ?? 1);
});
