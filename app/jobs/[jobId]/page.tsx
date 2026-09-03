import Header from "@/components/landing/landing-header";
import LandingFooter from "@/components/landing/landing-footer";
import { PublicJobDetail } from "@/components/job/public-job-detail";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { fetchPublicJob } from "@/utils/functions/job";
import { buildJobPostingJsonLd, siteUrl } from "@/utils/functions/seo";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface IJobPageProps {
  params: Promise<{ jobId: string }>;
}

/** Enough of the description to fill a search snippet without truncating mid-word. */
function toSummary(description: string, limit = 155): string {
  const flattened = description.replace(/\s+/g, " ").trim();
  if (flattened.length <= limit) return flattened;
  const cut = flattened.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({
  params,
}: IJobPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await fetchPublicJob(jobId);

  // A job that is gone must not keep a title and a description in the index.
  if (!job) {
    return { title: "Job not found", robots: { index: false, follow: false } };
  }

  const title = `${job.title} at ${job.company.name}`;
  const description = toSummary(job.description);
  const url = `${siteUrl()}/jobs/${job.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Apsara Talent",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicJobPage({ params }: IJobPageProps) {
  const { jobId } = await params;
  const job = await fetchPublicJob(jobId);

  // Hidden, expired, suspended and non-existent all arrive here as null — the
  // API answers all four with the same 404 so that walking ids tells a scraper
  // nothing — and all four are a 404 to a reader too.
  if (!job) notFound();

  // Read on the server so the header and the apply button render the right
  // state on first paint rather than flipping after hydration. This page is the
  // one place a signed-in reader and a search-engine visitor meet.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return (
    <div className="landing-scope relative min-h-screen bg-background text-foreground">
      <Header
        sessionRole={sessionRole}
        className="sticky inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl"
      />

      {/*
        JSON-LD is what puts a posting into Google Jobs — the rich result reads
        this, not the visible markup. It is emitted from the server component
        rather than the client one so it is in the initial HTML for crawlers
        that do not execute scripts.

        No nonce: the app's CSP uses 'strict-dynamic', under which a
        non-executable `application/ld+json` block is data, not script.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJobPostingJsonLd(job, siteUrl())),
        }}
      />

      <main>
        <PublicJobDetail job={job} sessionRole={sessionRole} />
      </main>

      <LandingFooter />
    </div>
  );
}
