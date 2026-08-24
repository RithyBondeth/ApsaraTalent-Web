"use client";

import { LandingLaptop } from "@/components/landing/landing-device/laptop";
import { LandingPhone } from "@/components/landing/landing-device/phone";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import {
  LucideArrowLeft,
  LucideBriefcase,
  LucideCalendarCheck,
  LucideCircleUser,
  LucideClock,
  LucideGraduationCap,
  LucideMapPin,
  LucidePlus,
  LucideSparkles,
  LucideVideo,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ILandingFeatureTourProps } from "./props";

/* ---------------------------------------------------------------------------
 * The product tour.
 *
 * Two features the marketing copy already claims — interview scheduling and the
 * AI resume builder — shown running rather than described. Each screen mirrors
 * the real surface: the interview list with its status pill and meta chips, the
 * builder's two-pane workspace with its collapsible form column and live
 * preview. Both use the app's own tokens, so what a visitor sees here is what
 * they get after signing up.
 *
 * Scheduling is on a phone and the builder on a laptop because that is how each
 * is actually used — the builder is a side-by-side workspace and would be a lie
 * on a 250px screen.
 * ------------------------------------------------------------------------- */

/* A meta chip from the interview card. */
function MetaChip(props: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 border border-border bg-muted/45 px-1.5 py-[4px] text-[7px] leading-none text-muted-foreground">
      {props.icon}
      {props.label}
    </span>
  );
}

/* One interview, matching components/interview/interview-card. */
function InterviewRow(props: {
  title: string;
  who: string;
  status: string;
  statusClass: string;
  when: string;
  duration: string;
  place: string;
  placeIcon: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card p-2 shadow-hard">
      <div className="flex items-start justify-between gap-1.5">
        <span className="min-w-0">
          <span className="block truncate text-[9px] font-black leading-tight tracking-[-0.02em]">
            {props.title}
          </span>
          <span className="mt-0.5 block truncate text-[7px] text-muted-foreground">
            {props.who}
          </span>
        </span>
        <span
          className={`shrink-0 whitespace-nowrap rounded-none px-1.5 py-[3px] text-[6px] font-bold uppercase tracking-[0.08em] ${props.statusClass}`}
        >
          {props.status}
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <MetaChip
          icon={<LucideCalendarCheck className="size-2" strokeWidth={2} />}
          label={props.when}
        />
        <MetaChip
          icon={<LucideClock className="size-2" strokeWidth={2} />}
          label={props.duration}
        />
        <MetaChip icon={props.placeIcon} label={props.place} />
      </div>
    </div>
  );
}

function ScheduleScreen() {
  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <LandingPhone
      activeTab={2}
      bar={
        <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
          <span className="grid size-[18px] shrink-0 place-items-center rounded-none border border-border">
            <LucideArrowLeft className="size-[9px]" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[6px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {t("tourScheduleEyebrow")}
            </span>
            <span className="block truncate text-[9px] font-bold leading-tight">
              {t("featureInterviewScheduling")}
            </span>
          </span>
          <span className="grid size-[18px] shrink-0 place-items-center rounded-none border border-primary bg-primary text-primary-foreground">
            <LucidePlus className="size-[9px]" strokeWidth={2.4} />
          </span>
        </div>
      }
    >
      {/* Page Banner Section */}
      <div className="mb-2 border border-l-[3px] border-border border-l-primary bg-card px-2.5 py-2 shadow-hard">
        <span className="block text-[6px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t("tourScheduleEyebrow")}
        </span>
        <span className="mt-1 block text-[11px] font-bold leading-tight tracking-[-0.03em]">
          {t("tourScheduleBannerTitle")}
        </span>
      </div>

      {/* Interview List Section */}
      <div className="flex flex-col gap-2">
        <InterviewRow
          title={t("tourScheduleOneTitle")}
          who="Kiri Labs · Sophea Dara"
          status={t("tourStatusConfirmed")}
          statusClass="border border-success-border bg-success-subtle text-success-accent"
          when="Thu, 14 Mar"
          duration="45 min"
          place={t("tourVideoCall")}
          placeIcon={<LucideVideo className="size-2" strokeWidth={2} />}
        />
        <InterviewRow
          title={t("tourScheduleTwoTitle")}
          who="Kiri Labs · Dara Chan"
          status={t("tourStatusPending")}
          statusClass="border border-warning-border bg-warning-subtle text-warning-accent"
          when="Fri, 15 Mar"
          duration="30 min"
          place="Phnom Penh"
          placeIcon={<LucideMapPin className="size-2" strokeWidth={2} />}
        />
      </div>
    </LandingPhone>
  );
}

/* One collapsible section of the builder's form column. */
function FormRow(props: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 border border-border bg-muted/25 px-2 py-[7px]">
      <span className="grid size-5 shrink-0 place-items-center border border-border bg-background text-muted-foreground">
        {props.icon}
      </span>
      <span className="text-[8px] font-bold">{props.label}</span>
    </div>
  );
}

function ResumeBuilderScreen() {
  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <LandingLaptop>
      {/* Editor Toolbar Section */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 py-1.5">
        <span className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center border border-border bg-muted/60">
            <LucideSparkles className="size-[8px]" strokeWidth={2} />
          </span>
          <span className="text-[8px] font-bold">
            {t("featureResumeBuilder")}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[6px] text-muted-foreground">
            {t("tourBuilderSaved")}
          </span>
          <span className="rounded-none bg-primary px-2 py-[3px] text-[7px] font-bold text-primary-foreground">
            {t("tourBuilderExport")}
          </span>
        </span>
      </div>

      {/* Two-Pane Workspace Section */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        {/* Form Column Section */}
        <div className="flex flex-col gap-1.5 overflow-hidden border-r border-border bg-background p-2.5">
          <FormRow
            icon={<LucideCircleUser className="size-[9px]" strokeWidth={2} />}
            label={t("tourBuilderPersonal")}
          />
          <FormRow
            icon={<LucideBriefcase className="size-[9px]" strokeWidth={2} />}
            label={t("tourBuilderExperience")}
          />
          <FormRow
            icon={
              <LucideGraduationCap className="size-[9px]" strokeWidth={2} />
            }
            label={t("tourBuilderEducation")}
          />

          {/* AI Assist Section */}
          <div className="mt-auto border border-l-[3px] border-border border-l-primary bg-primary/5 p-2">
            <span className="flex items-center gap-1 text-[7px] font-bold text-accent-foreground">
              <LucideSparkles className="size-[8px]" strokeWidth={2} />
              {t("tourBuilderAiTitle")}
            </span>
            <span className="mt-1 block text-[6px] leading-relaxed text-muted-foreground">
              {t("tourBuilderAiBody")}
            </span>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="overflow-hidden bg-muted/30 p-3">
          <div className="h-full border border-border bg-card p-3 shadow-hard">
            {/* Resume Header Section */}
            <div className="border-b border-border pb-1.5">
              <span className="block text-[11px] font-black leading-none tracking-[-0.03em]">
                Sophea Dara
              </span>
              <span className="mt-1 block text-[6px] uppercase tracking-[0.2em] text-muted-foreground">
                Senior Product Designer
              </span>
            </div>

            {/* Resume Body Section */}
            <div className="mt-2 space-y-2">
              {[t("tourBuilderSummary"), t("tourBuilderExperience")].map(
                (heading, i) => (
                  <div key={heading}>
                    <span className="block text-[6px] font-bold uppercase tracking-[0.16em] text-foreground/70">
                      {heading}
                    </span>
                    <div className="mt-1 space-y-[3px]">
                      {[100, 92, i === 0 ? 74 : 86, 64].map((w, j) => (
                        <span
                          key={j}
                          style={{ width: `${w}%` }}
                          className="block h-[3px] rounded-none bg-muted-foreground/20"
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </LandingLaptop>
  );
}

export default function LandingFeatureTour(props: ILandingFeatureTourProps) {
  /* ------------------------------- Props ------------------------------- */
  const { className } = props;

  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");
  const sectionRef = useGsapScrollAnimation<HTMLElement>();

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <section
      ref={sectionRef}
      className={`bg-background px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-20 lg:gap-28">
        {/* Interview Scheduling Beat Section */}
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,320px)] lg:gap-16">
          <div data-gsap="fade-up">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
              {t("featureInterviewScheduling")}
            </p>
            <TypographyH2 className="mt-5 max-w-lg !border-0 text-3xl font-bold !leading-[1.05] tracking-[-0.04em] sm:text-4xl">
              {t("tourScheduleHeading")}
            </TypographyH2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("tourScheduleDescription")}
            </p>
          </div>
          <div
            data-gsap="fade-up"
            className="flex justify-center lg:justify-end"
          >
            <ScheduleScreen />
          </div>
        </div>

        {/* Resume Builder Beat Section */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_1fr] lg:gap-16">
          <div
            data-gsap="fade-up"
            className="flex justify-center lg:order-1 lg:justify-start"
          >
            <ResumeBuilderScreen />
          </div>
          <div data-gsap="fade-up" className="lg:order-2">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
              {t("featureResumeBuilder")}
            </p>
            <TypographyH2 className="mt-5 max-w-lg !border-0 text-3xl font-bold !leading-[1.05] tracking-[-0.04em] sm:text-4xl">
              {t("tourBuilderHeading")}
            </TypographyH2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("tourBuilderDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
