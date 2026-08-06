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

// When set, the origin must be serving exactly this release. "Healthy" alone
// cannot tell a new deployment from the old one still on the alias, which is
// the difference between a deploy that landed and one that silently did not.
const expectedRelease = process.env.EXPECTED_RELEASE?.trim();

// When set, the origin must NOT be serving this release. Used after a rollback
// to prove the alias actually moved off the bad deployment.
const rejectedRelease = process.env.REJECTED_RELEASE?.trim();

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
      // An HTML body on a deployment URL is almost always Vercel's Deployment
      // Protection login page rather than the app. Say so, because "expected
      // JSON" on its own sends people looking at the wrong thing.
      const contentType =
        response.headers.get("content-type") || "unknown content type";
      const looksProtected =
        contentType.includes("text/html") && !automationBypassSecret;
      lastFailure =
        `HTTP ${response.status}: expected JSON, received ${contentType}` +
        (looksProtected
          ? " — likely Deployment Protection; set VERCEL_AUTOMATION_BYPASS_SECRET or verify the production domain instead"
          : "");
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      continue;
    }
    const healthy =
      response.ok &&
      body.status === "ok" &&
      body.service === "apsaratalent-web" &&
      body.apiBaseUrlConfigured === true;

    if (healthy && expectedRelease && body.release !== expectedRelease) {
      // Healthy, but still the previous build. The alias has not switched yet;
      // keep polling rather than declaring success on the old deployment.
      lastFailure = `serving release ${body.release || "unknown"}, expected ${expectedRelease}`;
    } else if (healthy && rejectedRelease && body.release === rejectedRelease) {
      lastFailure = `still serving the rolled-back release ${rejectedRelease}`;
    } else if (healthy) {
      console.log(
        `Verified ${healthUrl} (${body.service}, release=${body.release || "unknown"})`,
      );
      process.exit(0);
    } else {
      lastFailure = `HTTP ${response.status}: ${JSON.stringify(body)}`;
    }
  } catch (error) {
    lastFailure = error instanceof Error ? error.message : String(error);
  }
  await new Promise((resolve) => setTimeout(resolve, 5_000));
}

throw new Error(
  `Deployment did not become healthy within ${timeoutMs}ms: ${lastFailure}`,
);
