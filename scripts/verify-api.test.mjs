import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyApiReadiness } from "./verify-api.mjs";

function responses(
  ready,
  live = { status: "ok", service: "api-gateway", release: "tested-sha" },
) {
  return async (url) =>
    Response.json(url.pathname === "/health/live" ? live : ready);
}
const ready = {
  status: "ok",
  details: Object.fromEntries(
    [
      "database",
      "redis_cache",
      "AUTH_SERVICE",
      "USER_SERVICE",
      "RESUME_BUILDER_SERVICE",
      "CHAT_SERVICE",
      "JOB_SERVICE",
      "NOTIFICATION_SERVICE",
    ].map((name) => [name, { status: "up" }]),
  ),
};

test("verifies the gateway identity and all dependencies", async () => {
  assert.equal(
    await verifyApiReadiness("https://api.local.test", responses(ready)),
    "tested-sha",
  );
});
test("refuses Railway fallbacks, unversioned servers, and partial readiness", async () => {
  await assert.rejects(
    verifyApiReadiness(
      "https://api.local.test",
      async () => new Response("Application not found", { status: 404 }),
    ),
    /HTTP 404/,
  );
  await assert.rejects(
    verifyApiReadiness(
      "https://api.local.test",
      responses(ready, {
        status: "ok",
        service: "api-gateway",
        release: "unknown",
      }),
    ),
    /versioned/,
  );
  await assert.rejects(
    verifyApiReadiness("https://api.local.test", responses({ status: "ok" })),
    /six internal/,
  );
  await assert.rejects(
    verifyApiReadiness(
      "https://api.local.test",
      responses({
        ...ready,
        details: { ...ready.details, AUTH_SERVICE: { status: "down" } },
      }),
    ),
    /six internal/,
  );
});
test("never probes a URL containing credentials or a non-HTTP scheme", async () => {
  for (const url of [
    "https://user:private@api.local.test",
    "file:///private",
    "not a URL",
  ]) {
    await assert.rejects(
      verifyApiReadiness(url, () => assert.fail("must not fetch")),
    );
  }
});
