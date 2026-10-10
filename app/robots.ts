import { siteUrl } from "@/utils/functions/seo";
import type { MetadataRoute } from "next";

/**
 * What crawlers may read.
 *
 * The disallow list is every authenticated area. None of it is reachable
 * without a session — the middleware redirects — so this is not a security
 * boundary; it is a crawl-budget one. Left open, a crawler spends its budget
 * on redirects to /login instead of on the job pages that are the point.
 *
 * `/unsubscribe` is disallowed for a different reason: it is a real page that
 * acts on a token in the query string, and there is no value in it being
 * indexed with somebody's token attached to it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/application",
        "/dashboard",
        "/favorite",
        "/feed",
        "/interview",
        "/matching",
        "/message",
        "/notification",
        "/profile",
        "/resume-builder",
        "/search",
        "/setting",
        "/unsubscribe",
        "/design-system",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
