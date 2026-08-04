import * as Sentry from "@sentry/nextjs";
import {
  parseSentrySampleRate,
  sanitizeSentryEvent,
} from "./sentry.shared.config";

// Edge runtime (middleware, edge routes) Sentry init. No-op without a DSN.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Optional override for deploys where NODE_ENV doesn't describe the
    // target; falls back to NODE_ENV.
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: parseSentrySampleRate(
      process.env.SENTRY_TRACES_SAMPLE_RATE,
    ),
    beforeSend: sanitizeSentryEvent,
  });
}
