import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry init. Uses the public DSN so it is available client-side.
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate:
      Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  });
}
