"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";
import {
  LucideSearch,
  LucideHandshake,
  LucideFileText,
  LucideBriefcase,
  LucideMessageCircle,
  LucideShield,
} from "lucide-react";

const features = [
  {
    icon: LucideSearch,
    title: "Smart Matching",
    description:
      "Our intelligent algorithm connects the right talent with the right opportunities based on skills, experience, and preferences.",
  },
  {
    icon: LucideFileText,
    title: "AI Resume Builder",
    description:
      "Create professional, standout resumes in minutes with our AI-powered resume builder tailored for the Cambodian market.",
  },
  {
    icon: LucideMessageCircle,
    title: "Real-time Messaging",
    description:
      "Connect instantly with employers or candidates through our built-in messaging system for faster hiring decisions.",
  },
  {
    icon: LucideBriefcase,
    title: "Company Profiles",
    description:
      "Showcase your company culture, open positions, and benefits to attract top-tier talent across Cambodia.",
  },
  {
    icon: LucideHandshake,
    title: "Mutual Interest",
    description:
      "When both parties express interest, we create a match — making the hiring process natural and efficient.",
  },
  {
    icon: LucideShield,
    title: "Secure & Private",
    description:
      "Your data is protected with enterprise-grade security. Control who sees your profile and information.",
  },
];

export function LandingFeatures() {
  const sectionRef = useGsapScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32">
      {/* Dotted background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            data-gsap="fade-up"
            className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3"
          >
            Features
          </span>
          <h2
            data-gsap="split-words"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              Succeed
            </span>
          </h2>
          <TypographyMuted
            data-gsap="fade-up"
            className="text-base sm:text-lg max-w-xl mx-auto"
          >
            A comprehensive platform built to streamline hiring and job seeking
            in Cambodia.
          </TypographyMuted>
        </div>

        {/* Features Grid */}
        <div
          data-gsap="stagger-children"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-7 transition-all duration-300 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:border-amber-500/30"
            >
              <div className="mb-4 inline-flex items-center justify-center size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 transition-colors group-hover:bg-amber-500/15">
                <feature.icon className="size-5" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <TypographyMuted className="!text-sm !leading-relaxed">
                {feature.description}
              </TypographyMuted>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
