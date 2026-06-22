import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware, edge routes) Sentry init. No-op without a DSN.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  });
}
