import Header from "@/components/header";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { AngkorWatWrapper } from "@/components/utils/animations/angkor-wat-wrapper";
import { Button } from "@/components/ui/button";
import { LucideArrowRight, LucideSparkles } from "lucide-react";
import Link from "next/link";

export default function IndexPage() {
  /* --------------------------------- Render UI -------------------------------- */
  return (
    <div className="relative h-[100dvh] min-h-0 overflow-hidden overscroll-none bg-background">
      {/* Header Section */}
      <Header className="absolute top-0 left-0 right-0 z-20" />

      {/* Mobile Section: use 3D model as full-page background */}
      <div className="absolute inset-0 z-[1] pointer-events-none lg:hidden">
        <div className="absolute inset-0 opacity-70">
          <AngkorWatWrapper />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/40 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/65 via-transparent to-background/50" />
      </div>

      {/* Atmosphere Background Section (matched with 3D scene tones) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-24 top-16 h-[380px] w-[380px] rounded-full bg-amber-500/25 blur-[120px] dark:bg-amber-400/20" />
        <div className="absolute right-[-120px] top-[-40px] h-[460px] w-[460px] rounded-full bg-indigo-500/20 blur-[150px] dark:bg-indigo-400/25" />
        <div className="absolute right-[18%] bottom-[-140px] h-[420px] w-[420px] rounded-full bg-amber-400/15 blur-[140px] dark:bg-amber-300/10" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1920px] flex-col lg:flex-row">
        {/* Left: Text Content */}
        <div className="z-10 flex h-full min-h-0 w-full items-center justify-center pb-6 pt-32 sm:pb-8 sm:pt-36 lg:w-[48%] xl:w-[45%] 2xl:w-[43%] lg:items-start lg:justify-start lg:pb-0 lg:pt-28 xl:pt-32">
          <div className="w-full max-w-2xl px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
            <div className="flex flex-col items-start gap-4 sm:gap-5">
              {/* Badge Section */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both">
                <LucideSparkles className="size-3.5 text-primary" />
                <TypographySmall className="text-xs text-primary font-medium">
                  Cambodia&apos;s Premier Talent Platform
                </TypographySmall>
              </div>

              {/* Heading Section */}
              <TypographyH1 className="!leading-[1.12] text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] 2xl:text-[3.6rem] animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-100 fill-mode-both">
                Empowering Connections Between{" "}
                <span className="text-primary">Talent</span> and{" "}
                <span className="text-primary">Opportunity</span>
              </TypographyH1>

              {/* Description Section */}
              <TypographyMuted className="!leading-relaxed text-base sm:text-lg 2xl:text-[1.16rem] max-w-[620px] animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both">
                Whether you&apos;re a freelancer seeking new opportunities or a
                professional advancing your career, our platform connects you
                with the right opportunities.
                <span className="tablet-md:hidden">
                  {" "}
                  For businesses and employers, find top-tier talent to drive
                  success and innovation.
                </span>
              </TypographyMuted>

              {/* CTA Buttons Section */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                <Link href="/signup/option">
                  <Button
                    size="lg"
                    className="rounded-full px-7 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  >
                    Get Started
                    <LucideArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-7"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Stats Section */}
              <div className="flex items-center gap-6 2xl:gap-8 pt-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">
                    1K+
                  </span>
                  <TypographyMuted className="text-xs">
                    Active Users
                  </TypographyMuted>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">
                    500+
                  </span>
                  <TypographyMuted className="text-xs">
                    Companies
                  </TypographyMuted>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">
                    98%
                  </span>
                  <TypographyMuted className="text-xs">
                    Satisfaction
                  </TypographyMuted>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: 3D Angkor Wat Scene */}
        <div className="relative hidden h-full w-full lg:block lg:w-[52%] xl:w-[55%] 2xl:w-[57%]">
          <div className="pointer-events-none absolute -right-12 top-16 h-[420px] w-[420px] rounded-full bg-amber-400/20 blur-[140px] dark:bg-amber-300/15" />
          <div className="pointer-events-none absolute right-28 bottom-10 h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-[140px] dark:bg-indigo-400/20" />
          <div className="absolute inset-0 -translate-x-[6%] xl:-translate-x-[8%] 2xl:-translate-x-[10%]">
            <AngkorWatWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}
