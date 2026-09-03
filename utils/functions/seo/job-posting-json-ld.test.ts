import { beforeEach, describe, expect, it } from "vitest";
import { buildJobPostingJsonLd } from "./job-posting-json-ld";
import type { TPublicJob } from "@/utils/types/job/public-job.type";

const job = (overrides: Partial<TPublicJob> = {}): TPublicJob => ({
  id: "job-1",
  title: "Backend Engineer",
  description: "Build things",
  type: "full_time",
  experienceRequired: "3 - 5 years",
  educationRequired: "Bachelor's Degree",
  skills: ["Node.js", "Redis"],
  salary: null,
  salaryMin: 2000,
  salaryMax: 3000,
  salaryCurrency: "USD",
  workMode: "onsite",
  location: "Phnom Penh",
  languagesRequired: ["English"],
  openingsCount: 2,
  expireDate: "2026-12-01T00:00:00.000Z",
  createdAt: "2026-08-01T00:00:00.000Z",
  company: {
    id: "company-1",
    name: "Acme",
    avatar: "https://cdn.example.com/acme.png",
    industry: "Software",
    location: "Phnom Penh",
    companySize: 40,
  },
  ...overrides,
});

describe("buildJobPostingJsonLd", () => {
  const origin = "https://apsara.example.com";

  it("emits the properties Google requires for a JobPosting", () => {
    const jsonLd = buildJobPostingJsonLd(job(), origin);

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: "Backend Engineer",
      datePosted: "2026-08-01T00:00:00.000Z",
      validThrough: "2026-12-01T00:00:00.000Z",
      url: "https://apsara.example.com/jobs/job-1",
      hiringOrganization: { "@type": "Organization", name: "Acme" },
    });
  });

  it("maps employment types onto schema.org's vocabulary", () => {
    expect(buildJobPostingJsonLd(job(), origin).employmentType).toBe(
      "FULL_TIME",
    );
    expect(
      buildJobPostingJsonLd(job({ type: "internship" }), origin).employmentType,
    ).toBe("INTERN");
  });

  it("omits an employment type it cannot map rather than guessing", () => {
    // Google rejects a value outside its controlled vocabulary, which
    // invalidates the whole posting — omitting the property does not.
    const jsonLd = buildJobPostingJsonLd(job({ type: "seasonal" }), origin);
    expect(jsonLd).not.toHaveProperty("employmentType");
  });

  it("marks a remote posting as TELECOMMUTE", () => {
    const jsonLd = buildJobPostingJsonLd(job({ workMode: "remote" }), origin);
    expect(jsonLd.jobLocationType).toBe("TELECOMMUTE");
  });

  it("does not claim TELECOMMUTE for an onsite posting", () => {
    expect(buildJobPostingJsonLd(job(), origin)).not.toHaveProperty(
      "jobLocationType",
    );
  });

  it("emits a structured salary only when there is a real number behind it", () => {
    const withSalary = buildJobPostingJsonLd(job(), origin);
    expect(withSalary.baseSalary).toMatchObject({
      currency: "USD",
      value: { minValue: 2000, maxValue: 3000 },
    });

    // A negotiable posting must not invent one: Google penalises structured
    // salary that disagrees with the page.
    const negotiable = buildJobPostingJsonLd(
      job({ salaryMin: null, salaryMax: null }),
      origin,
    );
    expect(negotiable).not.toHaveProperty("baseSalary");
  });

  it("omits the salary when no currency is known", () => {
    const jsonLd = buildJobPostingJsonLd(job({ salaryCurrency: null }), origin);
    expect(jsonLd).not.toHaveProperty("baseSalary");
  });

  it("omits validThrough for a posting that does not expire", () => {
    const jsonLd = buildJobPostingJsonLd(job({ expireDate: null }), origin);
    expect(jsonLd).not.toHaveProperty("validThrough");
  });

  it("serializes to valid JSON", () => {
    // It is injected via dangerouslySetInnerHTML, so it has to survive
    // JSON.stringify and parse back identically.
    const jsonLd = buildJobPostingJsonLd(job(), origin);
    expect(() => JSON.parse(JSON.stringify(jsonLd))).not.toThrow();
  });
});

describe("siteUrl", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env = { ...original };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  });

  it("prefers the explicit variable and strips a trailing slash", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://apsara.example.com/";
    const { siteUrl } = await import("./site-url");
    expect(siteUrl()).toBe("https://apsara.example.com");
  });

  it("falls back to the Vercel host, which is a host and not a URL", async () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "apsara.vercel.app";
    const { siteUrl } = await import("./site-url");
    expect(siteUrl()).toBe("https://apsara.vercel.app");
  });
});
