"use client";

import { PixelGridField } from "@/components/utils/brand/pixel-grid-field";
import { PixelPet } from "@/components/utils/brand/pixel-pet";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import { cn } from "@/lib/utils";
import {
  LucideArrowLeftRight,
  LucideBriefcaseBusiness,
  LucideCheck,
  LucideHeart,
  LucideMapPin,
  LucideMessageCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ILandingMatchVisualProps } from "./props";

const CANDIDATE_SKILLS = ["TypeScript", "React", "Node.js"] as const;

function DossierLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pixel-label text-[10px] text-[hsl(var(--match-ink)/0.46)]">
      {children}
    </span>
  );
}

function CandidateDossier() {
  const t = useTranslations("landing");

  return (
    <article
      data-match-card="candidate"
      className="flex h-full min-h-[540px] flex-col bg-[hsl(var(--match-paper))]"
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--match-line))] px-6 py-5 sm:px-8">
        <DossierLabel>{t("matchVisualCompanyView")}</DossierLabel>
        <DossierLabel>Candidate · 0842</DossierLabel>
      </div>

      <div className="grid grid-cols-[112px_1fr] border-b border-[hsl(var(--match-line))]">
        <PixelGridField
          tone="yellow"
          compact
          animated
          className="min-h-28 border-r border-[hsl(var(--match-line))] text-2xl font-medium sm:text-3xl"
          contentClassName="grid h-full min-h-28 place-items-center"
        >
          BD
        </PixelGridField>
        <div className="flex flex-col justify-center px-6 py-3.5 sm:px-8">
          <DossierLabel>Available now</DossierLabel>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-[hsl(var(--match-ink))] sm:text-3xl">
            Bondeth
          </h3>
          <p className="mt-1 text-sm text-[hsl(var(--match-ink)/0.56)]">
            Software Engineer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-[hsl(var(--match-line))]">
        <div className="border-r border-[hsl(var(--match-line))] px-6 py-5 sm:px-8">
          <DossierLabel>Location</DossierLabel>
          <p className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--match-ink))]">
            <LucideMapPin className="size-4" strokeWidth={1.5} />
            Phnom Penh
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <DossierLabel>Match score</DossierLabel>
          <p className="pixel-numeral mt-2 text-3xl text-[hsl(var(--match-ink))]">
            94%
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 sm:px-8">
        <DossierLabel>Core capabilities</DossierLabel>
        <div className="mt-4 border-t border-[hsl(var(--match-line))]">
          {CANDIDATE_SKILLS.map((skill, index) => (
            <div
              key={skill}
              className="grid grid-cols-[36px_1fr] items-center border-b border-[hsl(var(--match-line))] py-3 text-sm text-[hsl(var(--match-ink))]"
            >
              <span className="pixel-numeral text-[10px] text-[hsl(var(--match-ink)/0.38)]">
                0{index + 1}
              </span>
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[hsl(var(--match-line))] bg-[hsl(var(--match-ink))] px-6 py-5 text-[hsl(var(--match-paper))] sm:px-8">
        <span className="text-sm font-medium">{t("matchVisualLiked")}</span>
        <LucideHeart
          data-match-like
          className="size-4 fill-current"
          strokeWidth={1.5}
        />
      </div>
    </article>
  );
}

function CompanyDossier() {
  const t = useTranslations("landing");

  return (
    <article
      data-match-card="company"
      className="flex h-full min-h-[540px] flex-col bg-[hsl(var(--match-paper))]"
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--match-line))] px-6 py-5 sm:px-8">
        <DossierLabel>{t("matchVisualEmployeeView")}</DossierLabel>
        <DossierLabel>Company · 0217</DossierLabel>
      </div>

      <div className="grid grid-cols-[112px_1fr] border-b border-[hsl(var(--match-line))]">
        <PixelGridField
          tone="yellow"
          compact
          mirror
          animated
          className="min-h-28 border-r border-[hsl(var(--match-line))]"
          contentClassName="grid h-full min-h-28 place-items-center"
        >
          <LucideBriefcaseBusiness className="size-7" strokeWidth={1.4} />
        </PixelGridField>
        <div className="flex flex-col justify-center px-6 py-3.5 sm:px-8">
          <DossierLabel>Hiring team</DossierLabel>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-[hsl(var(--match-ink))] sm:text-3xl">
            Kiri Labs
          </h3>
          <p className="mt-1 text-sm text-[hsl(var(--match-ink)/0.56)]">
            Product &amp; Technology
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-[hsl(var(--match-line))]">
        <div className="border-r border-[hsl(var(--match-line))] px-6 py-5 sm:px-8">
          <DossierLabel>Location</DossierLabel>
          <p className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--match-ink))]">
            <LucideMapPin className="size-4" strokeWidth={1.5} />
            Phnom Penh
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <DossierLabel>Team size</DossierLabel>
          <p className="pixel-numeral mt-2 text-3xl text-[hsl(var(--match-ink))]">
            42
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 sm:px-8">
        <DossierLabel>{t("matchVisualHiringFor")}</DossierLabel>
        <div className="mt-4 border border-[hsl(var(--match-line))]">
          <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div>
              <p className="text-lg font-medium tracking-[-0.02em] text-[hsl(var(--match-ink))]">
                Software Engineer
              </p>
              <p className="mt-2 text-xs text-[hsl(var(--match-ink)/0.52)]">
                Full-time · Hybrid · Phnom Penh
              </p>
            </div>
            <span className="size-3 shrink-0 bg-pixel-3" />
          </div>
          <div className="grid grid-cols-3 border-t border-[hsl(var(--match-line))]">
            {["Engineering", "Web", "Full-time"].map((tag) => (
              <span
                key={tag}
                className="border-r border-[hsl(var(--match-line))] px-3 py-3 text-center text-[10px] text-[hsl(var(--match-ink)/0.62)] last:border-r-0"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[hsl(var(--match-line))] bg-[hsl(var(--match-ink))] px-6 py-5 text-[hsl(var(--match-paper))] sm:px-8">
        <span className="text-sm font-medium">{t("matchVisualLiked")}</span>
        <LucideHeart
          data-match-like
          className="size-4 fill-current"
          strokeWidth={1.5}
        />
      </div>
    </article>
  );
}

function MatchSignal() {
  const t = useTranslations("landing");

  return (
    <PixelGridField
      tone="yellow"
      animated
      data-match-sequence
      contentClassName="landing-match-signal__content grid text-pixel-ink"
    >
      <div className="grid min-h-32 place-items-center border-b border-pixel-ink/20 md:min-h-48 md:border-b-0 md:border-r">
        <div data-match-piece="pet">
          <PixelPet
            expression="smiling"
            height={120}
            className="h-24 w-auto md:h-[120px]"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center border-b border-pixel-ink/20 px-5 py-7 sm:px-8 md:border-b-0 md:px-8 lg:px-10 xl:px-12">
        <div data-match-piece="label">
          <DossierLabel>{t("matchVisualMutualInterest")}</DossierLabel>
        </div>
        <div className="mt-4 flex min-w-0 items-center gap-3 sm:gap-4">
          <span
            data-match-piece="check"
            className="grid size-11 shrink-0 place-items-center bg-pixel-ink text-[hsl(var(--pixel-1))]"
          >
            <LucideCheck className="size-5" strokeWidth={2} />
          </span>
          <p
            data-match-piece="title"
            className="min-w-0 text-3xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-4xl lg:text-5xl"
          >
            {t("matchVisualMatchReady")}
          </p>
        </div>
        <p
          data-match-piece="copy"
          className="text-pixel-ink/68 mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
        >
          Bondeth and Kiri Labs both showed interest.{" "}
          {t("matchVisualMatchReadyDescription")}
        </p>
      </div>

      <div
        data-match-piece="chat"
        className="flex min-h-32 flex-col justify-between bg-pixel-ink px-6 py-7 text-[hsl(var(--pixel-1))] md:min-h-48"
      >
        <div data-match-chat className="flex items-center justify-between">
          <span className="pixel-label text-[10px] opacity-65">
            Connection unlocked
          </span>
          <LucideArrowLeftRight className="size-5" strokeWidth={1.5} />
        </div>
        <div data-match-chat>
          <LucideMessageCircle className="mb-3 size-5" strokeWidth={1.5} />
          <p className="text-base font-medium">{t("featureRealTimeChat")}</p>
          <p className="mt-1 text-xs opacity-65">Start the conversation →</p>
        </div>
      </div>
    </PixelGridField>
  );
}

export default function LandingMatchVisual({
  className,
}: ILandingMatchVisualProps) {
  const t = useTranslations("landing");
  const sectionRef = useGsapScrollAnimation<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={cn(
        "landing-match-editorial relative border-b border-border",
        className,
      )}
    >
      <div className="mx-auto max-w-[1600px] border-x border-[hsl(var(--match-line))]">
        <div className="grid lg:grid-cols-[7fr_3fr]">
          <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
            <span
              data-gsap="fade-up"
              className="pixel-label text-[hsl(var(--match-ink)/0.46)]"
            >
              {t("matchVisualEyebrow")} · 01
            </span>
            <TypographyH2
              data-gsap="split-words"
              className="mt-5 max-w-4xl text-4xl font-normal !leading-[1.02] tracking-[-0.045em] text-[hsl(var(--match-ink))] [perspective:800px] sm:text-5xl lg:text-7xl"
            >
              {t("matchVisualHeading")}
            </TypographyH2>
          </div>
          <div className="flex items-end border-t border-[hsl(var(--match-line))] bg-[hsl(var(--match-ink)/0.035)] px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:p-10">
            <p
              data-gsap="blur-reveal"
              className="max-w-md text-base leading-relaxed text-[hsl(var(--match-ink)/0.64)]"
            >
              {t("matchVisualDescription")}
            </p>
          </div>
        </div>

        <div
          className="border-t border-[hsl(var(--match-line))]"
          role="img"
          aria-label={t("matchVisualAccessibleLabel")}
        >
          <MatchSignal />
          <div className="grid border-t border-[hsl(var(--match-line))] lg:grid-cols-2">
            <CandidateDossier />
            <div className="border-t border-[hsl(var(--match-line))] lg:border-l lg:border-t-0">
              <CompanyDossier />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
