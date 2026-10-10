import { pathToFileURL } from "node:url";

// Probe the API actually compiled into this release before assigning domains.
export async function verifyApiReadiness(rawUrl, fetcher = fetch) {
  const base = new URL(rawUrl);
  if (!/^https?:$/.test(base.protocol) || base.username || base.password) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an HTTP(S) origin without credentials",
    );
  }
  async function read(path) {
    const response = await fetcher(new URL(path, base), {
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      throw new Error(`API ${path} returned HTTP ${response.status}`);
    return response.json();
  }
  const live = await read("/health/live");
  if (
    live.status !== "ok" ||
    live.service !== "api-gateway" ||
    !live.release ||
    live.release === "unknown"
  ) {
    throw new Error(
      "API liveness did not identify a versioned Apsara Talent gateway",
    );
  }
  const ready = await read("/health/ready");
  const dependencies = [
    "database",
    "redis_cache",
    "AUTH_SERVICE",
    "USER_SERVICE",
    "RESUME_BUILDER_SERVICE",
    "CHAT_SERVICE",
    "JOB_SERVICE",
    "NOTIFICATION_SERVICE",
  ].map((name) => ready.details?.[name]);
  if (
    ready.status !== "ok" ||
    dependencies.some((entry) => entry?.status !== "up")
  ) {
    throw new Error(
      "API readiness must confirm Postgres, Redis, and all six internal services",
    );
  }
  return live.release;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const release = await verifyApiReadiness(process.env.NEXT_PUBLIC_API_URL);
  console.log(`Verified API gateway and all dependencies (release=${release})`);
}
