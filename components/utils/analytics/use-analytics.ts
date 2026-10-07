"use client";

import { getPostHog } from "@/lib/posthog/client";
import { EWebAnalyticsEvent } from "@/lib/posthog/event";
import { useCallback } from "react";

/**
 * The one hook a component uses to fire an analytics event. Wraps
 * `posthog.capture` so no component imports the library directly — the
 * indirection buys us swap-out headroom and one place to add PII scrubbing
 * or CSP-aware fallbacks later.
 *
 * `capture()` is a no-op when PostHog is disabled or hasn't initialised
 * yet. Components can call it unconditionally.
 */
export function useAnalytics() {
  const capture = useCallback(
    (event: EWebAnalyticsEvent, properties?: Record<string, unknown>) => {
      const ph = getPostHog();
      if (!ph) return;
      ph.capture(event, properties);
    },
    [],
  );

  return { capture };
}
