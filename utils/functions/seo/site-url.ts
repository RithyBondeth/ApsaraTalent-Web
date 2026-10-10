/**
 * The app's own public origin, for canonical URLs, OG tags and the sitemap.
 *
 * `NEXT_PUBLIC_SITE_URL` is authoritative. Vercel's `VERCEL_PROJECT_PRODUCTION_URL`
 * is the fallback so preview and production builds do not need the variable set
 * by hand — but note it is a *host*, not a URL, hence the scheme below.
 *
 * The localhost default exists only so a local build produces parseable URLs.
 * A production build with neither variable set would emit canonical tags
 * pointing at localhost, which is why `next.config.ts` already refuses to build
 * without NEXT_PUBLIC_API_URL and why this is worth setting alongside it.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:4000";
}
