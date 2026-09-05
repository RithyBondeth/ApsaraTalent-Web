/**
 * PostHog config read from the browser bundle.
 *
 * Both variables are `NEXT_PUBLIC_*` so they ship to the client. The key is
 * a public write key (safe by design — its scope is limited to capturing
 * events for one project), and the host is the ingestion origin.
 *
 * When the key is empty the provider becomes a no-op — every capture call
 * short-circuits before it does any work. That is what makes local dev and
 * CI run without any PostHog setup, and what makes production run before
 * the env var is filled in.
 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

/** Defaults to US cloud when unset. Change to `https://eu.i.posthog.com` in .env. */
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export const POSTHOG_ENABLED = POSTHOG_KEY.length > 0;
