import { describe, expect, it } from "vitest";
import {
  makeTracesSampler,
  parseSentrySampleRate,
  sanitizeSentryEvent,
} from "./sentry.shared.config";

describe("shared Sentry configuration", () => {
  it("accepts an explicit zero sample rate", () => {
    expect(parseSentrySampleRate("0")).toBe(0);
    expect(parseSentrySampleRate("0.25")).toBe(0.25);
    expect(parseSentrySampleRate("invalid")).toBe(0.1);
    expect(parseSentrySampleRate("2")).toBe(0.1);
  });

  it("drops infra transactions and honors distributed-trace decisions", () => {
    const sampler = makeTracesSampler(0.25);

    // Noise is never sampled, even when the parent trace was.
    expect(sampler({ name: "GET /monitoring" })).toBe(0);
    expect(sampler({ name: "GET /health/ready" })).toBe(0);
    expect(sampler({ name: "GET /_next/static/chunk.js" })).toBe(0);
    expect(sampler({ name: "GET /monitoring", parentSampled: true })).toBe(0);

    // Real routes fall through to the configured rate.
    expect(sampler({ name: "GET /feed" })).toBe(0.25);

    // An upstream decision wins over the local rate.
    expect(sampler({ name: "GET /feed", parentSampled: true })).toBe(true);
    expect(sampler({ name: "GET /feed", parentSampled: false })).toBe(false);
  });

  it("redacts credentials and limits user PII", () => {
    expect(
      sanitizeSentryEvent({
        type: undefined,
        request: {
          cookies: { session: "cookie-value" },
          headers: { authorization: "Bearer value", accept: "json" },
          data: { password: "secret", profile: { token: "value" } },
        },
        user: { id: "user-1", role: "employee", email: "user@example.com" },
        extra: { apiKey: "secret", safe: "context" },
      }),
    ).toMatchObject({
      request: {
        headers: { authorization: "[Filtered]", accept: "json" },
        data: { password: "[Filtered]", profile: { token: "[Filtered]" } },
      },
      user: { id: "user-1", role: "employee" },
      extra: { apiKey: "[Filtered]", safe: "context" },
    });
  });
});
