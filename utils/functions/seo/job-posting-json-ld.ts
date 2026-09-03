import { TPublicJob } from "@/utils/types/job/public-job.type";

/**
 * Maps the app's employment type values onto schema.org's controlled
 * vocabulary. Google rejects values outside this set, so an unknown type is
 * omitted rather than guessed at.
 */
const EMPLOYMENT_TYPES: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  freelance: "CONTRACTOR",
};

/** schema.org models remote work as a separate property, not a location. */
const REMOTE_WORK_MODES = new Set(["remote", "work_from_home"]);

/**
 * Builds the `JobPosting` structured data for one posting.
 *
 * This is what places a job in Google Jobs; the visible markup is not read for
 * that. Two details are load-bearing:
 *
 *  - `datePosted` and `validThrough` must be ISO 8601, which is why the API
 *    hands this page ISO strings rather than the DD/MM/YYYY the rest of the app
 *    displays.
 *  - `baseSalary` is emitted only when there is a real number behind it.
 *    Google penalises a posting whose structured salary disagrees with the page
 *    or is fabricated, so a negotiable posting simply omits the property.
 */
export function buildJobPostingJsonLd(
  job: TPublicJob,
  origin: string,
): Record<string, unknown> {
  const employmentType = EMPLOYMENT_TYPES[job.type];
  const isRemote = job.workMode
    ? REMOTE_WORK_MODES.has(job.workMode.toLowerCase())
    : false;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    identifier: {
      "@type": "PropertyValue",
      name: "Apsara Talent",
      value: job.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      ...(job.company.avatar ? { logo: job.company.avatar } : {}),
    },
    url: `${origin}/jobs/${job.id}`,
  };

  if (employmentType) jsonLd.employmentType = employmentType;
  if (job.expireDate) jsonLd.validThrough = job.expireDate;
  if (job.skills.length > 0) jsonLd.skills = job.skills.join(", ");
  if (job.educationRequired)
    jsonLd.educationRequirements = job.educationRequired;
  if (job.experienceRequired)
    jsonLd.experienceRequirements = job.experienceRequired;
  if (job.openingsCount !== null) jsonLd.totalJobOpenings = job.openingsCount;

  if (job.location) {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    };
  }

  // Google requires this property for a posting advertised as remote, and
  // requires jobLocation to be absent or secondary when it is present.
  if (isRemote) jsonLd.jobLocationType = "TELECOMMUTE";

  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;
  if (hasSalary && job.salaryCurrency) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency,
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin !== null ? { minValue: job.salaryMin } : {}),
        ...(job.salaryMax !== null ? { maxValue: job.salaryMax } : {}),
        unitText: "MONTH",
      },
    };
  }

  return jsonLd;
}
