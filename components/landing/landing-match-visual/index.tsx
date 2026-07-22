"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import {
  LucideArrowLeftRight,
  LucideBriefcaseBusiness,
  LucideCheck,
  LucideHeart,
  LucideMapPin,
  LucideMessageCircle,
  LucideSparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DeviceChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-match-device relative w-full max-w-[280px] border border-white/[0.18] bg-[hsl(var(--auth-paper))] p-2.5 shadow-[0_28px_80px_hsl(var(--auth-paper)/0.42)]">
      <div className="mb-2 flex h-4 items-center justify-center">
        <span className="h-1 w-10 rounded-full bg-white/[0.18]" />
      </div>
      <div className="overflow-hidden rounded-[14px] bg-[hsl(var(--auth-ink))] text-[hsl(var(--auth-paper))]">
        {children}
      </div>
    </div>
  );
}

function CompanyDevice() {
  const t = useTranslations("landing");

  return (
    <DeviceChrome>
      <div className="flex items-center justify-between border-b border-[hsl(var(--auth-paper)/0.1)] px-4 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--auth-paper)/0.48)]">
            {t("matchVisualCompanyView")}
          </p>
          <p className="mt-0.5 text-xs font-semibold">Kiri Labs</p>
        </div>
        <span className="grid size-7 place-items-center rounded-full border border-[hsl(var(--auth-paper)/0.14)]">
          <LucideBriefcaseBusiness className="size-3.5" strokeWidth={1.6} />
        </span>
      </div>

      <div className="p-4">
        <div className="landing-profile-cover relative mb-10 h-20 overflow-visible border border-[hsl(var(--auth-paper)/0.1)]">
          <span className="absolute -bottom-7 left-3 grid size-14 place-items-center rounded-full border-4 border-[hsl(var(--auth-ink))] bg-[hsl(var(--auth-paper))] text-base font-semibold text-[hsl(var(--auth-ink))]">
            SD
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-tight">Sophea Dara</h3>
          <p className="mt-1 text-[11px] text-[hsl(var(--auth-paper)/0.56)]">
            Senior Product Designer
          </p>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-[hsl(var(--auth-paper)/0.46)]">
            <LucideMapPin className="size-3" strokeWidth={1.6} />
            Phnom Penh, Cambodia
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {["Product", "Research", "Figma"].map((skill) => (
            <span
              key={skill}
              className="border border-[hsl(var(--auth-paper)/0.12)] px-2 py-1 text-[9px] text-[hsl(var(--auth-paper)/0.62)]"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="landing-match-like landing-match-like-company flex items-center justify-center gap-2 bg-[hsl(var(--auth-paper))] px-3 py-3 text-xs font-semibold text-[hsl(var(--auth-ink))]">
          <LucideHeart className="size-4 fill-current" strokeWidth={1.6} />
          {t("matchVisualLiked")}
        </div>
      </div>
    </DeviceChrome>
  );
}

function EmployeeDevice() {
  const t = useTranslations("landing");

  return (
    <DeviceChrome>
      <div className="flex items-center justify-between border-b border-[hsl(var(--auth-paper)/0.1)] px-4 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--auth-paper)/0.48)]">
            {t("matchVisualEmployeeView")}
          </p>
          <p className="mt-0.5 text-xs font-semibold">Sophea Dara</p>
        </div>
        <span className="grid size-7 place-items-center rounded-full border border-[hsl(var(--auth-paper)/0.14)]">
          <span className="text-[9px] font-semibold">SD</span>
        </span>
      </div>

      <div className="p-4">
        <div className="landing-company-cover relative mb-10 h-20 overflow-visible border border-[hsl(var(--auth-paper)/0.1)]">
          <span className="absolute -bottom-7 left-3 grid size-14 place-items-center rounded-full border-4 border-[hsl(var(--auth-ink))] bg-[hsl(var(--auth-paper))] text-[11px] font-bold text-[hsl(var(--auth-ink))]">
            KIRI
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-tight">Kiri Labs</h3>
          <p className="mt-1 text-[11px] text-[hsl(var(--auth-paper)/0.56)]">
            Product &amp; Technology
          </p>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-[hsl(var(--auth-paper)/0.46)]">
            <LucideMapPin className="size-3" strokeWidth={1.6} />
            Phnom Penh, Cambodia
          </p>
        </div>

        <div className="mb-5 border-y border-[hsl(var(--auth-paper)/0.1)] py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--auth-paper)/0.42)]">
            {t("matchVisualHiringFor")}
          </p>
          <p className="mt-1.5 text-xs font-medium">Senior Product Designer</p>
        </div>

        <div className="landing-match-like landing-match-like-employee flex items-center justify-center gap-2 bg-[hsl(var(--auth-paper))] px-3 py-3 text-xs font-semibold text-[hsl(var(--auth-ink))]">
          <LucideHeart className="size-4 fill-current" strokeWidth={1.6} />
          {t("matchVisualLiked")}
        </div>
      </div>
    </DeviceChrome>
  );
}

export default function LandingMatchVisual() {
  const sectionRef = useGsapScrollAnimation<HTMLElement>();
  const matchStageRef = useRef<HTMLDivElement>(null);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const t = useTranslations("landing");

  useEffect(() => {
    const matchStage = matchStageRef.current;
    if (!matchStage) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const isDesktop = window.matchMedia("(min-width: 1024px)");

    if (prefersReducedMotion.matches) {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36"
    >
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 border-b border-border pb-10 md:grid-cols-[1fr_0.72fr] md:items-end sm:mb-16">
          <div>
            <span
              data-gsap="fade-up"
              className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
            >
              {t("matchVisualEyebrow")}
            </span>
            <TypographyH2
              data-gsap="split-chars"
              className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl [perspective:800px]"
            >
              {t("matchVisualHeading")}
            </TypographyH2>
          </div>
          <p
            data-gsap="blur-reveal"
            className="max-w-lg text-sm leading-relaxed text-muted-foreground md:justify-self-end sm:text-base"
          >
            {t("matchVisualDescription")}
          </p>
        </div>

        <div
          ref={matchStageRef}
          data-match-active={isMatchActive}
          className="landing-dark-panel landing-match-stage relative overflow-hidden border border-white/10 px-5 py-12 sm:px-10 sm:py-16 lg:min-h-[680px] lg:px-14"
          role="img"
          aria-label={t("matchVisualAccessibleLabel")}
        >
          <div className="landing-dark-grid pointer-events-none absolute inset-0" />

          <div className="relative z-10 mb-10 flex items-center justify-between border-b border-white/[0.12] pb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/[0.42] lg:mb-0">
            <span>{t("matchVisualMutualInterest")}</span>
            <span>Apsara Talent · Match</span>
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:absolute lg:inset-x-14 lg:bottom-12 lg:top-20 lg:grid-cols-[1fr_180px_1fr] lg:gap-6">
            <div className="landing-match-device-float-left flex justify-center lg:justify-end">
              <CompanyDevice />
            </div>

            <div className="landing-match-connection relative flex flex-col items-center justify-center py-2 lg:h-full">
              <div className="landing-match-beam hidden lg:block" aria-hidden />
              <span className="landing-match-arrow mb-4 grid size-12 place-items-center rounded-full border border-white/[0.16] bg-white/[0.06] text-white/[0.72] backdrop-blur-sm">
                <LucideArrowLeftRight className="size-5" strokeWidth={1.5} />
              </span>
              <div className="landing-match-result relative w-full max-w-[190px] border border-white/[0.18] bg-white/[0.07] px-4 py-5 text-center backdrop-blur-xl">
                <span className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-white text-[hsl(var(--auth-paper))]">
                  <LucideCheck className="size-5" strokeWidth={2} />
                </span>
                <p className="text-sm font-semibold text-white">
                  {t("matchVisualMatchReady")}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-white/[0.48]">
                  {t("matchVisualMatchReadyDescription")}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/[0.12] pt-3 text-[10px] font-medium text-white/[0.68]">
                  <LucideMessageCircle className="size-3.5" strokeWidth={1.6} />
                  {t("featureRealTimeChat")}
                </div>
              </div>
              <LucideSparkles className="landing-match-spark absolute right-3 top-1/4 size-4 text-white/30 lg:right-0" />
            </div>

            <div className="landing-match-device-float-right flex justify-center lg:justify-start">
              <EmployeeDevice />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
