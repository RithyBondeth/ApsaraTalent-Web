import * as Sentry from "@sentry/nextjs";
import {
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
    // Sample traces, but never for infra noise: /health (Docker healthchecks)
    // and /monitoring (the Sentry tunnel itself) fire constantly.
    tracesSampler: ({ name, parentSampled }) => {
      if (name.includes("/health") || name.includes("/monitoring")) return 0;
      // Honor the upstream decision within a distributed trace.
      if (typeof parentSampled === "boolean") return parentSampled;
      return tracesSampleRate;
    },
  });
}
