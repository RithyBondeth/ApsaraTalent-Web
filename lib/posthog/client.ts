"use client";

import posthog, { type PostHog } from "posthog-js";
import { POSTHOG_ENABLED, POSTHOG_HOST, POSTHOG_KEY } from "./config";

let initialized = false;

/**
 * One-shot initializer. Idempotent — Next remounts the provider on some
 * navigations, and re-initing PostHog throws away the queue that came
 * before. Guarded by a module-level flag so subsequent calls no-op.
 *
 * Autocapture and session replay are **off** on purpose. Autocapture
 * records every click, form input and mutation — a firehose that leaks
 * form-field values into the analytics store and makes the CSP fight
 * PostHog's dynamically-injected element listeners. The explicit
 * `capture()` calls elsewhere are the whole taxonomy; each of them was a
 * deliberate decision.
 */
export function initPostHog(): PostHog | null {
  if (!POSTHOG_ENABLED) return null;
  if (initialized) return posthog;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Explicit-only capture. See the comment above.
    autocapture: false,
    capture_pageview: false, // handled by our own hook so router changes fire
    capture_pageleave: true,
    disable_session_recording: true,
    // The library's own console noise adds nothing in prod.
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  });

  initialized = true;
  return posthog;
}

/**
 * Returns the initialised client, or null if PostHog is disabled — for
 * hand-rolled `capture()` calls outside the provider tree (rare).
 */
export function getPostHog(): PostHog | null {
  return POSTHOG_ENABLED && initialized ? posthog : null;
}
