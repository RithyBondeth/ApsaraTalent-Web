"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGsapScrollAnimation } from "@/hooks/utils/use-gsap-animation";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up as a job seeker or company. Build your profile with skills, experience, and what you're looking for.",
  },
  {
    number: "02",
    title: "Discover & Match",
    description:
      "Browse through curated profiles. Like the ones that catch your eye — when the feeling is mutual, it's a match.",
  },
  {
    number: "03",
    title: "Connect & Grow",
    description:
      "Start a conversation, schedule interviews, and build the professional relationship that drives your success.",
  },
];

export function LandingHowItWorks() {
  const sectionRef = useGsapScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Dotted background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08] [background-image:radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/8 blur-[180px] dark:bg-amber-400/5" />
        <div className="absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/6 blur-[140px] dark:bg-indigo-400/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span
            data-gsap="fade-up"
            className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3"
          >
            How It Works
          </span>
          <h2
            data-gsap="split-words"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 [perspective:800px]"
          >
            Three Simple{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-300">
              Steps
            </span>
          </h2>
          <TypographyMuted data-gsap="fade-up" className="text-base sm:text-lg max-w-lg mx-auto">
            Getting started with Apsara Talent is easy. Here&apos;s how it
            works.
          </TypographyMuted>
        </div>

        {/* Steps */}
        <div data-gsap="stagger-children" className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center md:text-left">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-amber-400/40 to-amber-400/10 dark:from-amber-500/30 dark:to-amber-500/5" />
              )}

              {/* Step number */}
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 dark:from-amber-400/10 dark:to-amber-500/5 dark:border-amber-400/15 mb-5">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <TypographyMuted className="!text-sm !leading-relaxed max-w-xs mx-auto md:mx-0">
                {step.description}
              </TypographyMuted>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
