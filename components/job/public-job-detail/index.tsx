"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MetaChip from "@/components/utils/data-display/meta-chip";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  formatAvailabilityWords,
  formatSalaryRange,
} from "@/utils/functions/text";
import {
  LucideBriefcase,
  LucideBuilding2,
  LucideCalendarClock,
  LucideGraduationCap,
  LucideLanguages,
  LucideMapPin,
  LucideUsers,
  LucideWallet,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { EWebAnalyticsEvent } from "@/lib/posthog/event";
import { useAnalytics } from "@/components/utils/analytics/use-analytics";
import { useEffect } from "react";
import { IPublicJobDetailProps } from "./props";

/**
 * The public job posting.
 *
 * A client component only so it can reach `useTranslations` — it holds no
 * state and no effects, so Next still renders the whole thing to HTML on the
 * server. That matters: a crawler must see the description and the JSON-LD in
 * the response body, not after hydration.
 */
export function PublicJobDetail(props: IPublicJobDetailProps) {
  /* --------------------------------- Props --------------------------------- */
  const { job, sessionRole } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("publicJob");
  const { capture } = useAnalytics();

  // One capture per mount — a signed-out visitor counts, and gets stitched
  // into a funnel with any subsequent sign-in via posthog's alias.
  useEffect(() => {
    capture(EWebAnalyticsEvent.PUBLIC_JOB_VIEWED, {
      job_id: job.id,
      company_id: job.company.id,
      signed_in: sessionRole !== null && sessionRole !== "none",
    });
  }, [capture, job.id, job.company.id, sessionRole]);
  const tCommon = useTranslations("common");
  const format = useFormatter();

  // The three states mirror the middleware: no cookie is a guest, "none" is
  // signed in but still owes the role step, anything else is a full session.
  const isSignedIn = Boolean(sessionRole) && sessionRole !== "none";
  // A guest goes to login and is returned here; a signed-in reader goes to the
  // company profile, which is where applying happens today.
  const applyHref = isSignedIn
    ? `/feed/company/${job.company.id}`
    : `/login?callbackUrl=${encodeURIComponent(`/jobs/${job.id}`)}`;

  const salary = formatSalaryRange(job, {
    from: (amount) => tCommon("salaryFrom", { amount }),
    upTo: (amount) => tCommon("salaryUpTo", { amount }),
    negotiable: tCommon("salaryNegotiable"),
  });

  const postedOn = new Date(job.createdAt);
  const expiresOn = job.expireDate ? new Date(job.expireDate) : null;
  const asDate = (value: Date) =>
    format.dateTime(value, { day: "numeric", month: "long", year: "numeric" });

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-7 px-4 py-10 sm:px-6 lg:px-8">
      {/* Job Header Section */}
      <header className="flex flex-col gap-5 border border-border bg-card p-5 shadow-hard sm:p-7">
        <div className="flex items-start gap-4">
          {/* Company Avatar Section */}
          {job.company.avatar ? (
            <Image
              src={job.company.avatar}
              alt={t("companyLogoAlt", { company: job.company.name })}
              width={56}
              height={56}
              className="size-14 shrink-0 border border-border object-cover"
            />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center border border-border bg-muted [&>svg]:size-6">
              <LucideBuilding2 />
            </span>
          )}

          {/* Title Section */}
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight tracking-[-0.02em] sm:text-3xl">
              {job.title}
            </h1>
            <TypographyMuted className="mt-1 text-sm">
              {job.company.industry
                ? `${job.company.name} · ${job.company.industry}`
                : job.company.name}
            </TypographyMuted>
          </div>
        </div>

        {/* Job Facts Section */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideBriefcase />}
            text={formatAvailabilityWords(job.type)}
          />
          {job.location && (
            <MetaChip icon={<LucideMapPin />} text={job.location} />
          )}
          {job.workMode && (
            <MetaChip
              icon={<LucideBuilding2 />}
              text={formatAvailabilityWords(job.workMode)}
            />
          )}
          <MetaChip icon={<LucideWallet />} text={salary} />
          {job.openingsCount !== null && (
            <MetaChip
              icon={<LucideUsers />}
              text={t("openings", { count: job.openingsCount })}
            />
          )}
        </div>

        {/* Primary Action Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild className="w-fit">
            {/* Labelled for what it actually does. A guest sent to a login
                screen by a button that said "Apply" has been misled, and this
                page exists to convert people arriving cold from a search. */}
            <Link href={applyHref}>
              {isSignedIn ? t("viewAndApply") : t("signInToApply")}
            </Link>
          </Button>
          <TypographyMuted className="text-xs">
            {t("posted")}{" "}
            <time dateTime={job.createdAt}>{asDate(postedOn)}</time>
            {expiresOn && (
              <>
                {` · ${t("closes")} `}
                <time dateTime={job.expireDate ?? undefined}>
                  {asDate(expiresOn)}
                </time>
              </>
            )}
          </TypographyMuted>
        </div>
      </header>

      {/* Job Description Section */}
      <section className="flex flex-col gap-3 border border-border bg-card p-5 shadow-hard sm:p-7">
        <h2 className="text-lg font-black tracking-[-0.01em]">
          {t("aboutRole")}
        </h2>
        {/* `whitespace-pre-line` rather than a markdown renderer: descriptions
            are plain text typed into a textarea, and rendering them as markup
            would let a poster inject formatting — or worse — into a page served
            to anonymous visitors. */}
        <p className="whitespace-pre-line text-sm leading-7 text-foreground/90">
          {job.description}
        </p>
      </section>

      {/* Requirements Section */}
      <section className="flex flex-col gap-5 border border-border bg-card p-5 shadow-hard sm:p-7">
        <h2 className="text-lg font-black tracking-[-0.01em]">
          {t("requirements")}
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <TypographyMuted className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
              <LucideBriefcase className="size-3.5" />
              {t("experience")}
            </TypographyMuted>
            <p className="text-sm">{job.experienceRequired}</p>
          </div>

          <div className="flex flex-col gap-2">
            <TypographyMuted className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
              <LucideGraduationCap className="size-3.5" />
              {t("education")}
            </TypographyMuted>
            <p className="text-sm">{job.educationRequired}</p>
          </div>
        </div>

        {job.skills.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <TypographyMuted className="text-xs font-semibold uppercase tracking-[0.08em]">
                {t("skills")}
              </TypographyMuted>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Tag key={skill} label={skill} />
                ))}
              </div>
            </div>
          </>
        )}

        {job.languagesRequired.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <TypographyMuted className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
                <LucideLanguages className="size-3.5" />
                {t("languages")}
              </TypographyMuted>
              <div className="flex flex-wrap gap-2">
                {job.languagesRequired.map((language) => (
                  <Tag key={language} label={language} />
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Company Section */}
      <section className="flex flex-col gap-4 border border-border bg-card p-5 shadow-hard sm:p-7">
        <h2 className="text-lg font-black tracking-[-0.01em]">
          {t("aboutCompany", { company: job.company.name })}
        </h2>
        <div className="flex flex-wrap gap-2">
          {job.company.industry && (
            <MetaChip icon={<LucideBriefcase />} text={job.company.industry} />
          )}
          {job.company.location && (
            <MetaChip icon={<LucideMapPin />} text={job.company.location} />
          )}
          {job.company.companySize !== null && (
            <MetaChip
              icon={<LucideUsers />}
              text={t("employees", { count: job.company.companySize })}
            />
          )}
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href={applyHref}>{t("viewCompany")}</Link>
        </Button>
      </section>

      {/* Closing Notice Section */}
      {expiresOn && (
        <TypographyMuted className="flex items-center gap-2 text-xs">
          <LucideCalendarClock className="size-3.5" />
          {t("closingNotice", { date: asDate(expiresOn) })}
        </TypographyMuted>
      )}
    </article>
  );
}
