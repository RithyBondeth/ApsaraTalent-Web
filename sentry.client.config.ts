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
    environment: process.env.NODE_ENV,
    tracesSampleRate:
      Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0.1,
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: Number.isFinite(replaysSessionSampleRate)
      ? replaysSessionSampleRate
      : 0,
    replaysOnErrorSampleRate: Number.isFinite(replaysOnErrorSampleRate)
      ? replaysOnErrorSampleRate
      : 1,
  });
}
