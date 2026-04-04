import Header from "@/components/header";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { AngkorWatWrapper } from "@/components/utils/animations/angkor-wat-wrapper";
import { Button } from "@/components/ui/button";
import { LucideArrowRight, LucideSparkles } from "lucide-react";
import Link from "next/link";

/*-------------------------------------------- Render UI --------------------------------------------*/
export default function IndexPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Header Section */}
      <Header className="absolute top-0 left-0 right-0 z-20" />

      {/* Main Content */}
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center pt-28 pb-8 sm:pt-32 lg:pt-0 lg:pb-0 z-10">
          <div className="w-full max-w-2xl px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col items-start gap-5 sm:gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both">
                <LucideSparkles className="size-3.5 text-primary" />
                <TypographySmall className="text-xs text-primary font-medium">
                  Cambodia&apos;s Premier Talent Platform
                </TypographySmall>
              </div>

              {/* Heading */}
              <TypographyH1 className="!leading-[1.15] text-4xl sm:text-5xl lg:text-[3.4rem] animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-100 fill-mode-both">
                Empowering Connections Between{" "}
                <span className="text-primary">Talent</span> and{" "}
                <span className="text-primary">Opportunity</span>
              </TypographyH1>

              {/* Description */}
              <TypographyMuted className="!leading-relaxed text-base sm:text-lg max-w-[520px] animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both">
                Whether you&apos;re a freelancer seeking new opportunities or a
                professional advancing your career, our platform connects you
                with the right opportunities.
                <span className="tablet-md:hidden">
                  {" "}For businesses and employers, find top-tier talent to
                  drive success and innovation.
                </span>
              </TypographyMuted>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                <Link href="/signup/option">
                  <Button size="lg" className="rounded-full px-7 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
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

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
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

        {/* Right: 3D Angkor Wat Scene */}
        <div className="w-full lg:w-1/2 relative h-[350px] sm:h-[420px] md:h-[480px] lg:h-auto lg:min-h-[100dvh]">
          {/* Gradient overlay to blend 3D scene with background */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-background/40 to-transparent lg:via-background/20" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
          <AngkorWatWrapper />
        </div>
      </div>
    </div>
  );
}
