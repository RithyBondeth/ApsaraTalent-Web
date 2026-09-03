import { fetchPublicJobSitemap } from "@/utils/functions/job";
import { siteUrl } from "@/utils/functions/seo";
import type { MetadataRoute } from "next";

/**
 * Only pages a signed-out visitor can actually reach belong here.
 *
 * Everything under `(main)` and `(admin)` is behind the middleware and would be
 * a redirect to /login for a crawler — submitting those trains search engines
 * to distrust the sitemap.
 */
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/product", changeFrequency: "monthly", priority: 0.8 },
  { path: "/learn", changeFrequency: "monthly", priority: 0.7 },
  { path: "/safety", changeFrequency: "yearly", priority: 0.5 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/signup", changeFrequency: "yearly", priority: 0.6 },
  { path: "/login", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${origin}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Returns [] rather than throwing when the API is unreachable, so a backend
  // blip degrades the sitemap to its static half instead of serving a 500 that
  // makes search engines back off from it entirely.
  const jobs = await fetchPublicJobSitemap();

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${origin}/jobs/${job.id}`,
    lastModified: new Date(job.updatedAt),
    // Postings are written once and rarely edited, but they expire — daily
    // keeps a closed role from sitting in the index for a month.
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticEntries, ...jobEntries];
}
