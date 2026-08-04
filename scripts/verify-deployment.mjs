const rawBaseUrl = process.argv[2];
const timeoutMs = Number(process.env.DEPLOY_VERIFY_TIMEOUT_MS || 180_000);

if (!rawBaseUrl) {
  throw new Error("Usage: node scripts/verify-deployment.mjs <deployment-url>");
}

const baseUrl = new URL(
  /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`,
);
const healthUrl = new URL("/health", baseUrl);
const deadline = Date.now() + timeoutMs;
const automationBypassSecret =
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
let lastFailure = "No request attempted";

while (Date.now() < deadline) {
  try {
    const response = await fetch(healthUrl, {
      headers: {
        "user-agent": "apsaratalent-deploy-verifier/1.0",
        ...(automationBypassSecret
          ? { "x-vercel-protection-bypass": automationBypassSecret }
          : {}),
      },
      signal: AbortSignal.timeout(10_000),
    });
    const responseText = await response.text();
    let body;
    try {
      body = JSON.parse(responseText);
    } catch {
      lastFailure = `HTTP ${response.status}: expected JSON, received ${response.headers.get("content-type") || "unknown content type"}`;
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      continue;
    }
    if (
      response.ok &&
      body.status === "ok" &&
      body.service === "apsaratalent-web" &&
      body.apiBaseUrlConfigured === true
    ) {
      console.log(
        `Verified ${healthUrl} (${body.service}, release=${body.release || "unknown"})`,
      );
      process.exit(0);
    }
    lastFailure = `HTTP ${response.status}: ${JSON.stringify(body)}`;
  } catch (error) {
    lastFailure = error instanceof Error ? error.message : String(error);
  }
  await new Promise((resolve) => setTimeout(resolve, 5_000));
}

throw new Error(
  `Deployment did not become healthy within ${timeoutMs}ms: ${lastFailure}`,
);
