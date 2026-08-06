import type { ErrorEvent } from "@sentry/nextjs";

type UnknownRecord = Record<string, unknown>;

const SENSITIVE_KEY =
  /^(authorization|cookie|set-cookie|password|passcode|secret|token|access_token|refresh_token|api[_-]?key|session)$/i;

export function parseSentrySampleRate(
  raw: string | undefined,
  fallback = 0.1,
): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
}

/**
 * Transactions that fire constantly and carry no debugging value. Sampling
 * them would dominate the transaction quota without ever telling us anything:
 *   /monitoring  the Sentry tunnel itself (tunnelRoute in next.config.ts)
 *   /health      platform health checks
 *   /_next/      build output, HMR, and static assets
 */
const NOISY_TRANSACTION = /\/monitoring|\/health|\/_next\//;

/**
 * Shared tracesSampler used by the client, server, and edge runtimes so all
 * three filter the same noise. Mirrors the API's sampler in
 * libs/common/src/sentry/instrument.ts.
 */
export function makeTracesSampler(rate: number) {
  return ({
    name,
    parentSampled,
  }: {
    name: string;
    parentSampled?: boolean;
  }): number | boolean => {
    if (NOISY_TRANSACTION.test(name)) return 0;
    // Honor the upstream decision within a distributed trace.
    if (typeof parentSampled === "boolean") return parentSampled;
    return rate;
  };
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as UnknownRecord).map(([key, nested]) => [
      key,
      SENSITIVE_KEY.test(key) ? "[Filtered]" : redact(nested),
    ]),
  );
}

/**
 * Keep useful debugging context while preventing credentials, cookies, request
 * bodies, and incidental user PII from being sent to Sentry.
 */
export function sanitizeSentryEvent(event: ErrorEvent): ErrorEvent {
  const requestRecord = event.request as unknown as UnknownRecord | undefined;
  const userRecord = event.user as unknown as UnknownRecord | undefined;
  const request = event.request
    ? {
        ...event.request,
        cookies: undefined,
        headers: redact(requestRecord?.headers),
        data: redact(requestRecord?.data),
      }
    : undefined;
  const user = event.user
    ? { id: userRecord?.id, role: userRecord?.role }
    : undefined;

  return {
    ...event,
    ...(request ? { request } : {}),
    ...(user ? { user } : {}),
    ...(event.extra ? { extra: redact(event.extra) as UnknownRecord } : {}),
    ...(event.contexts
      ? { contexts: redact(event.contexts) as UnknownRecord }
      : {}),
    ...(event.breadcrumbs
      ? {
          breadcrumbs: event.breadcrumbs.map((breadcrumb) => ({
            ...breadcrumb,
            data: redact(breadcrumb.data) as UnknownRecord,
          })),
        }
      : {}),
  } as ErrorEvent;
}
