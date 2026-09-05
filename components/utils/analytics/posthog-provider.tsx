"use client";

import { getPostHog, initPostHog } from "@/lib/posthog/client";
import { POSTHOG_ENABLED } from "@/lib/posthog/config";
import { EWebAnalyticsEvent } from "@/lib/posthog/event";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect } from "react";

/**
 * Initializes PostHog once, keeps the identified user in sync, and emits a
 * page-view event on every client-side route change.
 *
 * The identify step matters more than it sounds: unless the client tells
 * PostHog "the anonymous person browsing before is now user X", every
 * anonymous session and the eventual login are stored as two different
 * users, and the funnel from `page_view` to `application_submitted` never
 * joins. `posthog.identify(id, {...})` also merges the anonymous session
 * into the identified one — call it as soon as the currentUser resolves.
 *
 * When `POSTHOG_ENABLED` is false, the whole provider is a pass-through —
 * no effects run, no library code initializes. Ships zero-op when the
 * project key isn't set.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_ENABLED) return;
    initPostHog();
  }, []);

  return (
    <>
      {POSTHOG_ENABLED ? (
        // useSearchParams needs a Suspense boundary or the whole tree
        // opts into client-side rendering at build time.
        <Suspense>
          <PostHogAnalyticsEffects />
        </Suspense>
      ) : null}
      {children}
    </>
  );
}

function PostHogAnalyticsEffects() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useGetCurrentUserStore((s) => s.user);

  // Identify — the moment the current user is known.
  useEffect(() => {
    const ph = getPostHog();
    if (!ph || !user?.id) return;
    ph.identify(user.id, {
      role: user.role,
      // PII stays out. Role and structural facts feed cohort splits; email
      // and phone belong in the platform's own DB, not a third party's.
    });
  }, [user?.id, user?.role]);

  // Page views — on every client-side route change. `capture_pageview: false`
  // in the client init means we own this; otherwise Next's soft nav wouldn't
  // fire and the funnel would only see full-page loads.
  useEffect(() => {
    const ph = getPostHog();
    if (!ph || !pathname) return;
    ph.capture(EWebAnalyticsEvent.PAGE_VIEW, {
      $current_url: `${pathname}${searchParams?.size ? `?${searchParams.toString()}` : ""}`,
      pathname,
    });
  }, [pathname, searchParams]);

  return null;
}
