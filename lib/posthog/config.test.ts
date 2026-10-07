import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("PostHog config", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env = { ...original };
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
    // Config reads env at module init — reset the module cache so each test
    // gets a fresh evaluation against its own env.
    vi.resetModules();
  });

  afterEach(() => {
    process.env = original;
  });

  it("is disabled when the key is empty — local dev and pre-configured deploys keep working", async () => {
    const { POSTHOG_ENABLED } = await import("./config");
    expect(POSTHOG_ENABLED).toBe(false);
  });

  it("defaults the host to US cloud", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";
    const { POSTHOG_HOST } = await import("./config");
    expect(POSTHOG_HOST).toBe("https://us.i.posthog.com");
  });

  it("respects an explicit host override — EU or self-hosted", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://eu.i.posthog.com";
    const { POSTHOG_HOST } = await import("./config");
    expect(POSTHOG_HOST).toBe("https://eu.i.posthog.com");
  });
});
