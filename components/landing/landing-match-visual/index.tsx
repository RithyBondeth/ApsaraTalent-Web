"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { cn } from "@/lib/utils";
import {
  LucideArrowLeft,
  LucideArrowLeftRight,
  LucideBriefcase,
  LucideCalendar,
  LucideCircleUser,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideCheck,
  LucideEllipsisVertical,
  LucideGraduationCap,
  LucideHeart,
  LucideMapPin,
  LucideMessageCircle,
  LucidePhone,
  LucideSend,
  LucideSparkles,
  LucideTimer,
  LucideUsers,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingPhone } from "@/components/landing/landing-device/phone";
import { ILandingMatchVisualProps } from "./props";

gsap.registerPlugin(ScrollTrigger);

/* A skill / position chip, matching `Tag`. */
function MiniTag(props: { label: string }) {
  return (
    <span className="rounded-none border border-border bg-muted/50 px-1.5 py-[3px] text-[8px] font-medium leading-none text-foreground/75">
      {props.label}
    </span>
  );
}

/* One cell of the detail page's 2-up metadata grid. */
function MiniMeta(props: { icon: ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 border border-border bg-muted/55 px-1.5 py-[5px] text-[7px] leading-none text-foreground/90">
      {props.icon}
      <span className="truncate">{props.value}</span>
    </span>
  );
}

/* The detail page's sticky header: back, breadcrumb, overflow. */
function DetailBar(props: { eyebrow: string; name: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-background/95 px-3 py-1.5">
      <span className="grid size-[18px] shrink-0 place-items-center rounded-none border border-border">
        <LucideArrowLeft className="size-[9px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[6px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {props.eyebrow}
        </span>
        <span className="block truncate text-[9px] font-bold leading-tight">
          {props.name}
        </span>
      </span>
      <LucideEllipsisVertical
        className="size-[11px] shrink-0 text-muted-foreground"
        strokeWidth={2}
      />
    </div>
  );
}

function CompanyDevice() {
  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <LandingPhone
      bar={
        <DetailBar eyebrow={t("matchVisualCompanyView")} name="Sophea Dara" />
      }
    >
      {/* Employee Detail Section — mirrors feed/employee/[employeeId] */}
      <div className="border border-border bg-card shadow-hard">
        {/* Identity Panel Section */}
        <div className="flex flex-col border-b border-border bg-muted p-2.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[6px] font-extrabold uppercase tracking-[0.24em] text-muted-foreground">
              {t("matchVisualEmployeeEyebrow")}
            </span>
            <span className="border border-border bg-card px-1.5 py-[3px] text-[5px] font-extrabold uppercase tracking-[0.18em] opacity-75">
              Apsara Talent
            </span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="grid size-12 shrink-0 place-items-center rounded-none border border-border bg-card text-[11px] font-bold">
              SD
            </span>
            <span className="min-w-0">
              <span className="mb-0.5 block text-[5px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Apsara profile
              </span>
              <span className="block text-[15px] font-bold leading-[0.95] tracking-[-0.045em]">
                Sophea Dara
              </span>
            </span>
          </div>
        </div>

        {/* Professional Focus Panel Section */}
        <div className="bg-card p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[6px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
              {t("matchVisualEmployeeEyebrow")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-none border border-category-brown-accent/20 bg-category-brown-subtle px-1.5 py-[3px] text-[6px] font-bold uppercase leading-none tracking-[0.1em] text-category-brown-accent">
              <span className="size-1 shrink-0 rounded-full bg-category-brown" />
              {t("matchVisualAvailable")}
            </span>
          </div>

          <p className="mt-3 text-[17px] font-bold leading-[0.95] tracking-[-0.05em]">
            Senior Product Designer
          </p>

          {/* Metadata Grid Section */}
          <div className="mt-3 grid grid-cols-2 gap-px">
            <MiniMeta
              icon={
                <LucideMapPin className="size-2 shrink-0" strokeWidth={2} />
              }
              value="Phnom Penh"
            />
            <MiniMeta
              icon={<LucideTimer className="size-2 shrink-0" strokeWidth={2} />}
              value="6 years"
            />
            <MiniMeta
              icon={
                <LucideBriefcase className="size-2 shrink-0" strokeWidth={2} />
              }
              value="Product"
            />
            <MiniMeta
              icon={
                <LucideGraduationCap
                  className="size-2 shrink-0"
                  strokeWidth={2}
                />
              }
              value="BA Design"
            />
          </div>

          {/* Action Section — the like lands here */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="flex flex-1 items-center justify-center gap-1 rounded-none border border-input px-2 py-1.5 text-[8px] font-semibold text-foreground">
              <LucideBookmark className="size-2.5" strokeWidth={2} />
              {t("matchVisualSave")}
            </span>
            <span className="landing-match-like landing-match-like-company flex flex-1 items-center justify-center gap-1 rounded-none bg-primary px-2 py-1.5 text-[8px] font-bold text-primary-foreground">
              <LucideHeart className="size-2.5 fill-current" strokeWidth={2} />
              {t("matchVisualLiked")}
            </span>
          </div>
        </div>
      </div>

      {/* About Card Section — the next card down the page */}
      <div className="mt-2 border border-border bg-card p-2.5 shadow-hard">
        <div className="mb-2 flex items-center gap-1.5 border-b border-border pb-1.5">
          <span className="grid size-4 shrink-0 place-items-center border border-border bg-muted/60">
            <LucideCircleUser className="size-2" strokeWidth={2} />
          </span>
          <span className="text-[8px] font-bold tracking-tight">
            {t("matchVisualAbout")}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <MiniTag label="Product" />
          <MiniTag label="Research" />
          <MiniTag label="Figma" />
        </div>
      </div>
    </LandingPhone>
  );
}

function EmployeeDevice() {
  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <LandingPhone
      bar={
        <DetailBar eyebrow={t("matchVisualEmployeeView")} name="Kiri Labs" />
      }
    >
      {/* Company Detail Section — mirrors feed/company/[companyId] */}
      <div className="border border-border bg-card shadow-hard">
        {/* Company Cover Section */}
        <div className="relative flex min-h-[104px] flex-col justify-end border-b border-border bg-muted p-2.5">
          <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
            <span className="text-[6px] font-extrabold uppercase tracking-[0.24em] text-muted-foreground">
              {t("matchVisualCompanyEyebrow")}
            </span>
            <span className="border border-border bg-card px-1.5 py-[3px] text-[5px] font-extrabold uppercase tracking-[0.18em] opacity-75">
              Apsara Talent
            </span>
          </div>
          <span className="text-[6px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Technology
          </span>
          <span className="mt-0.5 block text-[17px] font-bold leading-[0.95] tracking-[-0.05em]">
            Kiri Labs
          </span>
        </div>

        {/* Stats Row Section */}
        <div className="grid grid-cols-2 gap-px bg-card p-2.5">
          <MiniMeta
            icon={
              <LucideBriefcaseBusiness
                className="size-2 shrink-0"
                strokeWidth={2}
              />
            }
            value="Technology"
          />
          <MiniMeta
            icon={<LucideMapPin className="size-2 shrink-0" strokeWidth={2} />}
            value="Phnom Penh"
          />
          <MiniMeta
            icon={<LucideUsers className="size-2 shrink-0" strokeWidth={2} />}
            value="50+ people"
          />
          <MiniMeta
            icon={
              <LucideCalendar className="size-2 shrink-0" strokeWidth={2} />
            }
            value="Since 2018"
          />
        </div>

        {/* Action Section — the like lands here */}
        <div className="flex items-center gap-1.5 px-2.5 pb-2.5">
          <span className="flex flex-1 items-center justify-center gap-1 rounded-none border border-input px-2 py-1.5 text-[8px] font-semibold text-foreground">
            <LucideBookmark className="size-2.5" strokeWidth={2} />
            {t("matchVisualSave")}
          </span>
          <span className="landing-match-like landing-match-like-employee flex flex-1 items-center justify-center gap-1 rounded-none bg-primary px-2 py-1.5 text-[8px] font-bold text-primary-foreground">
            <LucideHeart className="size-2.5 fill-current" strokeWidth={2} />
            {t("matchVisualLiked")}
          </span>
        </div>
      </div>

      {/* Open Positions Card Section */}
      <div className="mt-2 border border-border bg-card p-2.5 shadow-hard">
        <div className="mb-2 flex items-center justify-between gap-1.5 border-b border-border pb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="grid size-4 shrink-0 place-items-center border border-border bg-muted/60">
              <LucideBriefcaseBusiness className="size-2" strokeWidth={2} />
            </span>
            <span className="text-[8px] font-bold tracking-tight">
              {t("matchVisualHiringFor")}
            </span>
          </span>
          <span className="grid size-4 place-items-center border border-border bg-muted/60 text-[7px] font-bold">
            1
          </span>
        </div>
        <MiniTag label="Senior Product Designer" />
      </div>
    </LandingPhone>
  );
}

/* ---------------------------------------------------------------------------
 * The chat beat.
 *
 * Where the match resolves to: the same phone shell running the real message
 * thread — the app's own header, its bubble treatment (primary fill for the
 * sender, a bordered card for the recipient, both on shadow-hard-sm), the
 * typing indicator and the composer. Messages reveal on scroll so the thread
 * builds rather than appearing whole.
 * ------------------------------------------------------------------------- */
function ChatDevice() {
  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <LandingPhone
      activeTab={3}
      bar={
        <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
          <span className="grid size-[18px] shrink-0 place-items-center rounded-none border border-border">
            <LucideArrowLeft className="size-[9px]" strokeWidth={2} />
          </span>
          <span className="grid size-6 shrink-0 place-items-center rounded-none border border-border bg-muted text-[8px] font-bold">
            KIRI
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[9px] font-bold leading-tight">
              Kiri Labs
            </span>
            <span className="flex items-center gap-1 text-[6px] text-muted-foreground">
              <span className="size-1 rounded-full bg-success" />
              {t("matchVisualOnline")}
            </span>
          </span>
          <LucidePhone
            className="size-[11px] shrink-0 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
      }
    >
      {/* Message Thread Section */}
      <div className="flex flex-col gap-2">
        {/* Incoming Message Section */}
        <div className="landing-chat-msg flex justify-start">
          <span className="max-w-[78%] rounded-none border border-border bg-card p-2 text-[8px] leading-relaxed shadow-hard-sm">
            {t("matchVisualChatOne")}
          </span>
        </div>

        {/* Outgoing Message Section */}
        <div className="landing-chat-msg flex justify-end">
          <span className="max-w-[78%] rounded-none border border-primary bg-primary p-2 text-[8px] leading-relaxed text-primary-foreground shadow-hard-sm">
            {t("matchVisualChatTwo")}
          </span>
        </div>

        {/* Incoming Message Section */}
        <div className="landing-chat-msg flex justify-start">
          <span className="max-w-[78%] rounded-none border border-border bg-card p-2 text-[8px] leading-relaxed shadow-hard-sm">
            {t("matchVisualChatThree")}
          </span>
        </div>

        {/* Typing Indicator Section */}
        <div className="landing-chat-typing flex justify-start">
          <span className="flex items-center gap-1 rounded-none border border-border bg-card px-2.5 py-2 shadow-hard-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.16}s` }}
                className="landing-chat-dot size-1 rounded-full bg-primary"
              />
            ))}
          </span>
        </div>
      </div>

      {/* Composer Section */}
      <div className="absolute inset-x-2.5 bottom-[52px] flex items-center gap-1.5">
        <span className="flex flex-1 items-center rounded-none border border-l-[3px] border-border bg-muted/20 px-2 py-1.5 text-[7px] text-muted-foreground shadow-hard-sm">
          {t("matchVisualChatPlaceholder")}
        </span>
        <span className="grid size-[22px] shrink-0 place-items-center rounded-none border border-primary bg-primary text-primary-foreground">
          <LucideSend className="size-[10px]" strokeWidth={2} />
        </span>
      </div>
    </LandingPhone>
  );
}

export default function LandingMatchVisual(props: ILandingMatchVisualProps) {
  /* ------------------------------- Props ------------------------------- */
  const { className } = props;

  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("landing");
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  /* ---------------------------- All States ---------------------------- */
  const matchStageRef = useRef<HTMLDivElement>(null);
  const chatStageRef = useRef<HTMLDivElement>(null);
  const [isMatchActive, setIsMatchActive] = useState(false);

  /* ----------------------------- Effects ------------------------------ */
  // The chat thread builds on entry rather than on load; without this the
  // bubbles have finished animating long before the reader scrolls to them.
  useEffect(() => {
    const stage = chatStageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stage.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /* ----------------------------- Effects ------------------------------ */
  useEffect(() => {
    const matchStage = matchStageRef.current;
    if (!matchStage) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)");

    if (
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsMatchActive(true);
      return;
    }

    if (isDesktop.matches) {
      const context = gsap.context(() => {
        const select = gsap.utils.selector(matchStage);
        const companyDevice = select(".landing-match-device-float-left");
        const employeeDevice = select(".landing-match-device-float-right");
        const companyLike = select(".landing-match-like-company");
        const employeeLike = select(".landing-match-like-employee");
        const beam = select(".landing-match-beam");
        const arrow = select(".landing-match-arrow");
        const result = select(".landing-match-result");
        const spark = select(".landing-match-spark");

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: matchStage,
            start: "top 84px",
            end: "+=1600",
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            companyDevice,
            { opacity: 0, x: -90, y: 26, rotation: -5, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: -1.6,
              scale: 1,
              duration: 0.8,
            },
            0,
          )
          .fromTo(
            employeeDevice,
            { opacity: 0, x: 90, y: 26, rotation: 5, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              y: -5,
              rotation: 1.6,
              scale: 1,
              duration: 0.8,
            },
            0.16,
          )
          .to(
            companyLike,
            {
              opacity: 1,
              scale: 1.08,
              filter: "brightness(1.18)",
              duration: 0.24,
            },
            0.82,
          )
          .to(
            companyLike,
            {
              scale: 1,
              filter: "brightness(1)",
              duration: 0.24,
            },
            1.06,
          )
          .to(
            employeeLike,
            {
              opacity: 1,
              scale: 1.08,
              filter: "brightness(1.18)",
              duration: 0.24,
            },
            1.16,
          )
          .to(
            employeeLike,
            {
              scale: 1,
              filter: "brightness(1)",
              duration: 0.24,
            },
            1.4,
          )
          .to(
            beam,
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.5,
            },
            1.55,
          )
          .fromTo(
            beam,
            { "--landing-match-beam-x": "-130%" },
            {
              "--landing-match-beam-x": "430%",
              duration: 0.72,
              ease: "power2.inOut",
            },
            1.72,
          )
          .to(
            arrow,
            {
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 0.5,
            },
            1.64,
          )
          .to(
            result,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: "back.out(1.5)",
            },
            2.08,
          )
          .to(
            spark,
            {
              opacity: 0.45,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.48,
              ease: "back.out(2)",
            },
            2.3,
          );
      }, matchStage);

      return () => context.revert();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMatchActive(entry.intersectionRatio >= 0.18);
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: [0, 0.18, 0.4],
      },
    );

    observer.observe(matchStage);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36",
        className,
      )}
    >
      {/* Landing Match Visual Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Match Visual Heading Section */}
        <div className="mb-12 grid gap-6 border-b border-border pb-10 sm:mb-16 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <span
              data-gsap="fade-up"
              className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
            >
              {t("matchVisualEyebrow")}
            </span>
            <TypographyH2
              data-gsap="split-chars"
              className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] [perspective:800px] sm:text-4xl lg:text-5xl"
            >
              {t("matchVisualHeading")}
            </TypographyH2>
          </div>
          <p
            data-gsap="blur-reveal"
            className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base md:justify-self-end"
          >
            {t("matchVisualDescription")}
          </p>
        </div>

        {/* Interactive Match Stage Section */}
        <div
          ref={matchStageRef}
          data-match-active={isMatchActive}
          className="landing-dark-panel landing-match-stage relative overflow-hidden border border-[hsl(var(--landing-panel-ink)/0.1)] px-5 py-12 sm:px-10 sm:py-16 lg:min-h-[680px] lg:px-14"
          role="img"
          aria-label={t("matchVisualAccessibleLabel")}
        >
          {/* Stage Header Section */}
          <div className="relative z-10 mb-10 flex items-center justify-between border-b border-border pb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--landing-panel-ink))]/[0.42] lg:mb-0">
            <span>{t("matchVisualMutualInterest")}</span>
            <span>Apsara Talent · Match</span>
          </div>

          {/* Mutual Match Devices Section */}
          <div className="relative z-10 grid items-center gap-8 lg:absolute lg:inset-x-14 lg:bottom-12 lg:top-20 lg:grid-cols-[1fr_180px_1fr] lg:gap-6">
            {/* Company Perspective Section */}
            <div className="landing-match-device-float-left flex justify-center lg:justify-end">
              <CompanyDevice />
            </div>

            {/* Match Connection Section */}
            <div className="landing-match-connection relative flex flex-col items-center justify-center py-2 lg:h-full">
              <div className="landing-match-beam hidden lg:block" aria-hidden />
              <span className="landing-match-arrow mb-4 grid size-12 place-items-center rounded-none border border-border bg-muted/60 text-foreground">
                <LucideArrowLeftRight className="size-5" strokeWidth={1.5} />
              </span>
              {/* Match Result Section */}
              <div className="landing-match-result relative w-full max-w-[190px] rounded-none border border-border bg-card px-4 py-5 text-center shadow-hard">
                <span className="mx-auto mb-3 grid size-10 place-items-center rounded-none border border-success-border bg-success text-success-foreground">
                  <LucideCheck className="size-5" strokeWidth={2} />
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {t("matchVisualMatchReady")}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
                  {t("matchVisualMatchReadyDescription")}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 border-t border-border pt-3 text-[10px] font-medium text-[hsl(var(--landing-panel-ink))]/[0.68]">
                  <LucideMessageCircle className="size-3.5" strokeWidth={1.6} />
                  {t("featureRealTimeChat")}
                </div>
              </div>
              <LucideSparkles className="landing-match-spark absolute right-3 top-1/4 size-4 text-muted-foreground/60 lg:right-0" />
            </div>

            {/* Employee Perspective Section */}
            <div className="landing-match-device-float-right flex justify-center lg:justify-start">
              <EmployeeDevice />
            </div>
          </div>
        </div>

        {/* Real-time Chat Section — where the match resolves to */}
        <div
          ref={chatStageRef}
          className="landing-chat-stage mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1fr_minmax(0,320px)] lg:gap-16"
        >
          <div data-gsap="fade-up">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
              {t("featureRealTimeChat")}
            </p>
            <TypographyH2 className="mt-5 max-w-lg !border-0 text-3xl font-bold !leading-[1.05] tracking-[-0.04em] sm:text-4xl">
              {t("matchVisualChatHeading")}
            </TypographyH2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("matchVisualChatDescription")}
            </p>
          </div>

          <div
            data-gsap="fade-up"
            className="landing-chat-device flex justify-center lg:justify-end"
          >
            <ChatDevice />
          </div>
        </div>
      </div>
    </section>
  );
}
