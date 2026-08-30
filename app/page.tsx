"use client";

import Header from "@/components/landing/landing-header";
import LandingHero from "@/components/landing/landing-hero";
import LandingMarquee from "@/components/landing/landing-marquee";
import LandingFeatures from "@/components/landing/landing-features";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import LandingCta from "@/components/landing/landing-cta";
import LandingMatchVisual from "@/components/landing/landing-match-visual";
import LandingFeatureTour from "@/components/landing/landing-feature-tour";
import LandingFooter from "@/components/landing/landing-footer";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import { useLanguageStore } from "@/stores/languages/language-store";

export default function IndexPage() {
  /* ----------------------------------- Utils ---------------------------------- */
  const language = useLanguageStore((s) => s.language);

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <div className="landing-scope relative min-h-screen bg-background text-foreground">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header Section */}
      <Header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl" />

      {/* Section 1: Hero */}
      <LandingHero key={`hero-${language}`} />

      {/* Section 2: Mutual Match Visualization */}
      <LandingMatchVisual key={`match-visual-${language}`} />

      {/* Section 3: Feature Marquee Ribbon */}
      <LandingMarquee key={`marquee-${language}`} />

      {/* Section 4: Features */}
      <LandingFeatures key={`features-${language}`} />

      {/* Section 5: Product Tour — scheduling and the resume builder */}
      <LandingFeatureTour key={`tour-${language}`} />

      {/* Section 6: How It Works */}
      <LandingHowItWorks key={`how-${language}`} />

      {/* Section 7: Final CTA */}
      <LandingCta key={`cta-${language}`} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
