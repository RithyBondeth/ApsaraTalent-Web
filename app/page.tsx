"use client";

import Header from "@/components/header";
import LandingHero from "@/components/landing/landing-hero";
import LandingFeatures from "@/components/landing/landing-features";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import LandingCta from "@/components/landing/landing-cta";
import LandingAngkorWat from "@/components/landing/landing-angkor-wat";
import LandingFooter from "@/components/landing/landing-footer";
import { useLanguageStore } from "@/stores/languages/language-store";

export default function IndexPage() {
  const language = useLanguageStore((s) => s.language);

  return (
    <div className="relative bg-background">
      {/* Header */}
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40" />

      {/* Section 1: Hero */}
      <LandingHero key={`hero-${language}`} />

      {/* Section 2: 3D Angkor Wat */}
      <LandingAngkorWat key={`angkor-${language}`} />

      {/* Section 3: Features */}
      <LandingFeatures key={`features-${language}`} />

      {/* Section 4: How It Works */}
      <LandingHowItWorks key={`how-${language}`} />

      {/* Section 5: Final CTA */}
      <LandingCta key={`cta-${language}`} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
