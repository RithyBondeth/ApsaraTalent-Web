import * as Sentry from "@sentry/nextjs";
import {
  makeTracesSampler,
  parseSentrySampleRate,
  sanitizeSentryEvent,
} from "./sentry.shared.config";

// Server-side (Node.js runtime) Sentry init. No-op when no DSN is configured.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const tracesSampleRate = parseSentrySampleRate(
  process.env.SENTRY_TRACES_SAMPLE_RATE,
);

if (dsn) {
  Sentry.init({
    dsn,
    // Optional override for deploys where NODE_ENV doesn't describe the
    // target; falls back to NODE_ENV.
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    beforeSend: sanitizeSentryEvent,
    // Filters the same infra noise as the client and edge runtimes.
    tracesSampler: makeTracesSampler(tracesSampleRate),
  });
}
