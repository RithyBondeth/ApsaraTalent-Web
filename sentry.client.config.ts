import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry init. Uses the public DSN so it is available client-side.
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Session Replay: no recording of normal sessions by default; capture the
// session when an error occurs. Override via the NEXT_PUBLIC_SENTRY_REPLAYS_*
// env vars (0-1). Set on-error rate to 0 to disable replay entirely.
const replaysSessionSampleRate = Number(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0",
);
const replaysOnErrorSampleRate = Number(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "1",
);

if (dsn) {
  Sentry.init({
    dsn,
    // Optional override (inlined at build time) for deploys where NODE_ENV
    // doesn't describe the target; falls back to NODE_ENV.
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate:
      Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0.1,
    // Known browser noise that would otherwise drown real issues. API
    // outages are still caught server-side and by the API's own Sentry.
    ignoreErrors: [
      // Benign browser quirk; fires constantly and is safe to ignore.
      /ResizeObserver loop/,
      // Request cancelled: user navigated away or component unmounted.
      "AbortError",
      // Network blips on the user's side (offline, flaky mobile data).
      "TypeError: Failed to fetch",
      "TypeError: NetworkError when attempting to fetch a resource.",
      "TypeError: Load failed",
    ],
    // Errors thrown by browser extensions, not our code.
    denyUrls: [
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
      /^safari-(web-)?extension:\/\//,
    ],
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: Number.isFinite(replaysSessionSampleRate)
      ? replaysSessionSampleRate
      : 0,
    replaysOnErrorSampleRate: Number.isFinite(replaysOnErrorSampleRate)
      ? replaysOnErrorSampleRate
      : 1,
  });
}
