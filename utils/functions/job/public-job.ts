import {
  API_PUBLIC_JOB_SITEMAP_URL,
  API_PUBLIC_JOB_URL,
} from "@/utils/constants/apis/job.api.constant";
import {
  TPublicJob,
  TPublicJobSitemapEntry,
} from "@/utils/types/job/public-job.type";

/**
 * Server-side reads of the public job API.
 *
 * Plain `fetch`, not the axios client in `lib/axios`: that one attaches the
 * access token from browser storage and runs a refresh interceptor, neither of
 * which exists in a server component. These endpoints take no credentials by
 * design — the whole point is that a crawler can reach them.
 */

/** How long Next caches a job page before revalidating. Matches the API's own TTL. */
const JOB_REVALIDATE_SECONDS = 600;
/** The sitemap changes slowly and is cached for an hour server-side too. */
const SITEMAP_REVALIDATE_SECONDS = 3600;

/**
 * One job, or null when it is not public.
 *
 * Null covers every reason at once — no such job, expired, taken down, posted
 * by a suspended account — because the API deliberately answers all four with
 * the same 404. The page turns null into `notFound()`.
 */
export async function fetchPublicJob(
  jobId: string,
): Promise<TPublicJob | null> {
  try {
    const response = await fetch(API_PUBLIC_JOB_URL(jobId), {
      next: { revalidate: JOB_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;
    return (await response.json()) as TPublicJob;
  } catch {
    // A network failure and a missing job both render the same 404 page. The
    // alternative is a 500 that search engines treat as "come back later" for
    // a URL that may be permanently gone.
    return null;
  }
}

/** Every indexable job id. Returns an empty list rather than failing the sitemap. */
export async function fetchPublicJobSitemap(): Promise<
  TPublicJobSitemapEntry[]
> {
  try {
    const response = await fetch(API_PUBLIC_JOB_SITEMAP_URL, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];
    return (await response.json()) as TPublicJobSitemapEntry[];
  } catch {
    // A sitemap that 500s is worse than a sitemap listing only the static
    // pages: search engines back off from a failing sitemap entirely.
    return [];
  }
}
