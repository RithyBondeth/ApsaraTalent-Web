"use client";

import Link from "next/link";
import {
  LucideArrowLeft,
  LucideBookOpen,
  LucideRocket,
  LucideUsers,
  LucideBriefcase,
  LucideFileText,
  LucideSparkles,
  LucideLightbulb,
  LucideTarget,
} from "lucide-react";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useLanguageStore } from "@/stores/languages/language-store";

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */
function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <span className="text-primary [&>svg]:size-4">{icon}</span>
        </div>
        <TypographyH2 className="text-lg font-bold tracking-tight">
          {title}
        </TypographyH2>
      </div>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed pl-0">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 size-1.5 rounded-full bg-primary/60 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function GuideCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="text-primary [&>svg]:size-4">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </span>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
        {step}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Content helpers
───────────────────────────────────────────────────────────── */
type TocItem = { id: string; label: string };
type TitleDesc = { title: string; description: string };

interface LearnStrings {
  back: string;
  pageTitle: string;
  subtitle: string;
  tocHeading: string;
  toc: TocItem[];
  gettingStartedTitle: string;
  gettingStartedIntro: string;
  steps: TitleDesc[];
  jobSeekersTitle: string;
  jobSeekersIntro: string;
  jobSeekersBullets: string[];
  employersTitle: string;
  employersIntro: string;
  employersBullets: string[];
  aiTitle: string;
  aiIntro: string;
  aiBullets: string[];
  guidesTitle: string;
  guides: TitleDesc[];
}

const en: LearnStrings = {
  back: "Back",
  pageTitle: "Learn",
  subtitle:
    "Guides, tutorials, and resources to help you get the most out of Apsara Talent \u2014 whether you are a job seeker or an employer.",
  tocHeading: "Contents",
  toc: [
    { id: "getting-started", label: "Getting Started" },
    { id: "for-job-seekers", label: "For Job Seekers" },
    { id: "for-employers", label: "For Employers" },
    { id: "using-ai", label: "Using AI Features" },
    { id: "guides", label: "Guides & Tutorials" },
  ],
  gettingStartedTitle: "Getting Started",
  gettingStartedIntro:
    "New to Apsara Talent? Follow these steps to set up your account and start connecting with opportunities or talent.",
  steps: [
    {
      title: "Create Your Account",
      description:
        "Sign up with your email, Google, Facebook, LinkedIn, or GitHub account. Choose whether you are a job seeker or employer.",
    },
    {
      title: "Complete Your Profile",
      description:
        "Add your skills, experience, education, and preferences. A complete profile increases your visibility and matching accuracy.",
    },
    {
      title: "Explore & Connect",
      description:
        "Browse the feed, use smart matching, and start conversations with potential employers or candidates.",
    },
    {
      title: "Download the Mobile App",
      description:
        "Get the Apsara Talent app on iOS or Android to stay connected on the go with push notifications and instant messaging.",
    },
  ],
  jobSeekersTitle: "For Job Seekers",
  jobSeekersIntro:
    "Make the most of your job search with these powerful tools and strategies available on Apsara Talent.",
  jobSeekersBullets: [
    "Build a standout profile \u2014 add a professional photo, detailed skills, and a compelling bio",
    "Use the AI Resume Builder to create polished, ATS-optimized resumes in minutes",
    "Enable smart matching to receive personalized job recommendations",
    "Set your preferences for location, salary range, and job type",
    "Respond to messages promptly \u2014 fast replies improve your ranking",
    "Keep your profile updated as you gain new skills and experience",
  ],
  employersTitle: "For Employers",
  employersIntro:
    "Find and hire the best talent in Cambodia with these tools designed for recruiters and hiring managers.",
  employersBullets: [
    "Create a detailed company profile that showcases your culture and values",
    "Post clear, well-structured job listings with skill requirements",
    "Use AI-powered matching to discover candidates you might have missed",
    "Schedule interviews directly through the platform",
    "Track your hiring pipeline with the analytics dashboard",
    "Communicate with candidates via real-time messaging",
  ],
  aiTitle: "Using AI Features",
  aiIntro:
    "Apsara Talent integrates the Apsara Agentic AI Assistant across the entire platform. Here is how to leverage it.",
  aiBullets: [
    "Smart Matching \u2014 AI analyzes skills, experience, and preferences to suggest the best matches",
    "Resume Builder \u2014 Get AI-generated suggestions for wording, formatting, and content optimization",
    "Interview Insights \u2014 Receive preparation tips and common questions tailored to each role",
    "Market Trends \u2014 Ask the AI about salary benchmarks, in-demand skills, and hiring patterns in Cambodia",
    "Proactive Alerts \u2014 Enable notifications to get instant updates when high-match opportunities appear",
  ],
  guidesTitle: "Guides & Tutorials",
  guides: [
    {
      title: "Optimizing Your Profile",
      description:
        "Step-by-step guide to creating a profile that stands out and attracts the right opportunities.",
    },
    {
      title: "Writing Effective Job Posts",
      description:
        "Best practices for writing job descriptions that attract qualified candidates.",
    },
    {
      title: "Mastering Smart Matching",
      description:
        "How the AI matching algorithm works and how to improve your match score.",
    },
    {
      title: "Mobile App Tips",
      description:
        "Get the most out of the Apsara Talent iOS and Android apps with these power-user tips.",
    },
    {
      title: "AI Resume Builder Guide",
      description:
        "Create professional resumes with AI assistance \u2014 from templates to final export.",
    },
    {
      title: "Interview Preparation",
      description:
        "Tools and resources to prepare for interviews and make a great impression.",
    },
  ],
};

const km: LearnStrings = {
  back: "\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799",
  pageTitle: "\u179F\u17D2\u179C\u17C2\u1784\u1799\u179B\u17CB",
  subtitle:
    "\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6 \u1798\u17C1\u179A\u17C0\u178F \u1793\u17B7\u1784\u1792\u1793\u1792\u17B6\u1793\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1787\u17BD\u1799\u17A2\u17D2\u178F\u1780 Apsara Talent\u17D4",
  tocHeading: "\u1798\u17B6\u178F\u17B7\u1780\u17B6",
  toc: [
    {
      id: "getting-started",
      label: "\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798",
    },
    {
      id: "for-job-seekers",
      label:
        "\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u17A2\u17D2\u178F\u1780\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1780\u17B6\u179A\u1784\u17B6\u179A",
    },
    {
      id: "for-employers",
      label:
        "\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u178F\u17B7\u1799\u17C4\u1787\u1780",
    },
    {
      id: "using-ai",
      label:
        "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A AI",
    },
    {
      id: "guides",
      label:
        "\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6 \u178F\u17B7\u1784\u1798\u17C1\u179A\u17C0\u178F",
    },
  ],
  gettingStartedTitle: "\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798",
  gettingStartedIntro:
    "\u1790\u17D2\u1798\u17B8\u178F\u17C5 Apsara Talent? \u17A2\u178F\u17BB\u179C\u178F\u17D2\u178F\u1787\u17C6\u17A0\u17B6\u178F\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1794\u1784\u17D2\u1780\u17BE\u178F\u1782\u178E\u178F\u17B8\u17D4",
  steps: [
    {
      title: "\u1794\u1784\u17D2\u1780\u17BE\u178F\u1782\u178E\u178F\u17B8",
      description:
        "\u1785\u17BB\u17C7\u1788\u17D2\u1798\u17C4\u17C7\u1787\u17B6\u1798\u17BD\u1799 Google, Facebook, LinkedIn \u17AC GitHub\u17D4",
    },
    {
      title:
        "\u1794\u17C6\u1796\u17C1\u1789\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB",
      description:
        "\u1794\u178F\u17D2\u1790\u17C2\u1798\u1787\u17C6\u178F\u17B6\u1789 \u1794\u178F\u1796\u17B7\u179F\u17C4\u1792\u178F\u17CD \u178F\u17B7\u1784\u1785\u17C6\u178E\u1784\u17CB\u1785\u17C6\u178E\u17BC\u179B\u1785\u17B7\u178F\u17D2\u178F\u17D4",
    },
    {
      title:
        "\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780 \u178F\u17B7\u1784\u178F\u1797\u17D2\u1787\u17B6\u1794\u17CB",
      description:
        "\u179A\u1780\u1798\u17BE\u179B Feed \u1794\u17D2\u179A\u17BE\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1786\u17D2\u179B\u17B6\u178F\u179C\u17C3\u17D4",
    },
    {
      title:
        "\u178F\u17B6\u1789\u1799\u1780\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791",
      description:
        "\u1791\u17B6\u1789\u1799\u1780 Apsara Talent \u178F\u17C5\u179B\u17BE iOS \u17AC Android\u17D4",
    },
  ],
  jobSeekersTitle:
    "\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u17A2\u17D2\u178F\u1780\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1780\u17B6\u179A\u1784\u17B6\u179A",
  jobSeekersIntro:
    "\u1791\u17B6\u1789\u1794\u17B6\u178F\u17A2\u178F\u17D2\u1790\u1794\u17D2\u179A\u1799\u17C4\u1787\u178F\u17CD\u1785\u17D2\u179A\u17BE\u178F\u1794\u17C6\u1795\u17BB\u178F\u1796\u17B8\u1780\u17B6\u179A\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1780\u17B6\u179A\u1784\u17B6\u179A\u17D4",
  jobSeekersBullets: [
    "\u1794\u1784\u17D2\u1780\u17BE\u178F\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB\u178A\u17C2\u179B\u179B\u17C1\u1785\u1792\u17D2\u179B\u17C4 \u2014 \u179A\u17BC\u1794\u1790\u178F\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1787\u17B8\u179C\u17C8 \u1787\u17C6\u178F\u17B6\u1789\u179B\u1798\u17D2\u17A2\u17B7\u178F",
    "\u1794\u17D2\u179A\u17BE AI Resume Builder \u178A\u17BE\u1798\u17D2\u1794\u17B8\u1794\u1784\u17D2\u1780\u17BE\u178F CV \u179C\u17B7\u1787\u17D2\u1787\u17B6\u1787\u17B8\u179C\u17C8",
    "\u1794\u17BE\u1780\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1786\u17D2\u179B\u17B6\u178F\u179C\u17C3\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1791\u1791\u17BD\u179B\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6\u1780\u17B6\u179A\u1784\u17B6\u179A",
    "\u1780\u17C6\u178E\u178F\u17CB\u1785\u17C6\u178E\u1784\u17CB\u1785\u17C6\u178E\u17BC\u179B\u1785\u17B7\u178F\u17D2\u178F\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1791\u17B8\u178F\u17B6\u17C6\u1784 \u1794\u17D2\u179A\u17B6\u1780\u17CB\u1781\u17C2 \u178F\u17B7\u1784\u1794\u17D2\u179A\u1797\u17C1\u1791\u1780\u17B6\u179A\u1784\u17B6\u179A",
    "\u1786\u17D2\u179B\u17BE\u1799\u178F\u1794\u179F\u17B6\u179A\u1797\u17D2\u179B\u17B6\u1798\u17D7 \u2014 \u1780\u17B6\u179A\u1786\u17D2\u179B\u17BE\u1799\u178F\u1794\u179B\u17BE\u178F\u1792\u17D2\u179C\u17BE\u17B1\u17D2\u1799\u1785\u17C6\u178E\u17B6\u178F\u17CB\u1790\u17D2\u178F\u17B6\u1780\u17CB\u1780\u17BE\u178F\u17A1\u17BE\u1784",
    "\u179A\u1780\u17D2\u179F\u17B6\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB\u17B1\u17D2\u1799\u1791\u17B6\u178F\u17CB\u179F\u1798\u17D0\u1799\u178F\u17C5\u1796\u17C1\u179B\u17A2\u17D2\u178F\u1780\u1791\u1791\u17BD\u179B\u1787\u17C6\u178F\u17B6\u1789\u1790\u17D2\u1798\u17B8",
  ],
  employersTitle:
    "\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u178F\u17B7\u1799\u17C4\u1787\u1780",
  employersIntro:
    "\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780 \u178F\u17B7\u1784\u1787\u17BD\u179B\u1791\u17C1\u1796\u1780\u17C4\u179F\u179B\u17D2\u1799\u179B\u17D2\u17A2\u1794\u17C6\u1795\u17BB\u178F\u178F\u17C5\u1780\u1798\u17D2\u1796\u17BB\u1787\u17B6\u17D4",
  employersBullets: [
    "\u1794\u1784\u17D2\u1780\u17BE\u178F\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB\u1780\u17D2\u179A\u17BB\u1798\u17A0\u17CA\u17BB\u178F\u179B\u1798\u17D2\u17A2\u17B7\u178F\u178A\u17C2\u179B\u1794\u1784\u17D2\u17A0\u17B6\u1789\u179C\u1794\u17D2\u1794\u1792\u1798\u17CC",
    "\u1794\u17D2\u179A\u1780\u17B6\u179F\u1780\u17B6\u179A\u1784\u17B6\u179A\u1785\u17D2\u1794\u17B6\u179F\u17CB\u179B\u17B6\u179F\u17CB\u1787\u17B6\u1798\u17BD\u1799\u178F\u1798\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A\u1787\u17C6\u178F\u17B6\u1789",
    "\u1794\u17D2\u179A\u17BE\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784 AI \u178A\u17BE\u1798\u17D2\u1794\u17B8\u179A\u1780\u1794\u17C1\u1780\u17D2\u1781\u1787\u178F",
    "\u1780\u17C6\u178E\u178F\u17CB\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD\u178A\u17C4\u1799\u1795\u17D2\u1791\u17B6\u179B\u17CB\u178F\u17B6\u1798\u179A\u1799\u17C8\u179C\u17C1\u1791\u17B7\u1780\u17B6",
    "\u178F\u17B6\u1798\u178A\u17B6\u178F\u1780\u17B6\u179A\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F\u1787\u17B6\u1798\u17BD\u1799\u1795\u17D2\u1791\u17B6\u17C6\u1784\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179C\u17B7\u1797\u17B6\u1782",
    "\u1791\u17C6\u178F\u17B6\u1780\u17CB\u1791\u17C6\u178F\u1784\u1787\u17B6\u1798\u17BD\u1799\u1794\u17C1\u1780\u17D2\u1781\u1787\u178F\u178F\u17B6\u1798\u179A\u1799\u17C8\u1780\u17B6\u179A\u1795\u17D2\u1789\u17BE\u179F\u17B6\u179A\u1797\u17D2\u179B\u17B6\u1798\u17D7",
  ],
  aiTitle:
    "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A AI",
  aiIntro:
    "Apsara Talent \u179A\u17BD\u1798\u1794\u1789\u17D2\u1785\u17BC\u179B Apsara Agentic AI Assistant \u178F\u17C5\u1791\u17BC\u1791\u17B6\u17C6\u1784\u179C\u17C1\u1791\u17B7\u1780\u17B6\u17D4",
  aiBullets: [
    "\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1786\u17D2\u179B\u17B6\u178F\u179C\u17C3 \u2014 AI \u179C\u17B7\u1797\u17B6\u1782\u1787\u17C6\u178F\u17B6\u1789 \u1794\u178F\u1796\u17B7\u179F\u17C4\u1792\u178F\u17CD \u178F\u17B7\u1784\u1785\u17C6\u178E\u1784\u17CB\u1785\u17C6\u178E\u17BC\u179B\u1785\u17B7\u178F\u17D2\u178F",
    "\u17A7\u1794\u1780\u179A\u178E\u17CD\u1794\u1784\u17D2\u1780\u17BE\u178F CV \u2014 \u1791\u1791\u17BD\u179B\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6\u1796\u17B8 AI \u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1780\u17B6\u179A\u179F\u179A\u179F\u17C1\u179A \u178F\u17B7\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB",
    "\u1780\u17B6\u179A\u1799\u179B\u17CB\u178A\u17B9\u1784\u17A2\u17C6\u1796\u17B8\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD \u2014 \u1782\u178F\u17D2\u179B\u17BE\u17C7\u178F\u17D2\u179A\u17C0\u1798\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u178F\u17BD\u178F\u17B6\u1791\u17B8\u178F\u17B7\u1798\u17BD\u1799\u17D7",
    "\u178F\u17B7\u178F\u17D2\u178F\u17B6\u1780\u17B6\u179A\u1791\u17B8\u1795\u17D2\u179F\u17B6\u179A \u2014 \u179F\u17BD\u179A AI \u17A2\u17C6\u1796\u17B8\u179F\u17D2\u178F\u1784\u17CB\u178A\u17B6\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1781\u17C2 \u1787\u17C6\u178F\u17B6\u1789\u178A\u17C2\u179B\u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A",
    "\u1780\u17B6\u179A\u1787\u17BC\u178F\u178A\u17C6\u178E\u17B9\u1784\u179F\u1780\u1798\u17D2\u1798 \u2014 \u1791\u1791\u17BD\u179B\u1796\u17D0\u178F\u17CC\u1798\u17B6\u178F\u1797\u17D2\u179B\u17B6\u1798\u17D7\u1796\u17C1\u179B\u1798\u17B6\u178F\u17A2\u1780\u17B6\u179F\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1781\u17D2\u1796\u179F\u17CB",
  ],
  guidesTitle:
    "\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6 \u178F\u17B7\u1784\u1798\u17C1\u179A\u17C0\u178F",
  guides: [
    {
      title:
        "\u1794\u1784\u17D2\u1780\u17BE\u178F\u1794\u17D2\u179A\u179F\u17B7\u1791\u17D2\u1792\u1797\u17B6\u1796\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB",
      description:
        "\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6\u1798\u17BD\u1799\u1787\u17C6\u17A0\u17B6\u178F\u1798\u17BD\u1799\u1787\u17C6\u17A0\u17B6\u178F\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1794\u1784\u17D2\u1780\u17BE\u178F\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB\u17D4",
    },
    {
      title:
        "\u1780\u17B6\u179A\u179F\u179A\u179F\u17C1\u179A\u1794\u17D2\u179A\u1780\u17B6\u179F\u1780\u17B6\u179A\u1784\u17B6\u179A",
      description:
        "\u179C\u17B7\u1792\u17B8\u179B\u17D2\u17A2\u1794\u17C6\u1795\u17BB\u178F\u178A\u17BE\u1798\u17D2\u1794\u17B8\u179F\u179A\u179F\u17C1\u179A\u1780\u17B6\u179A\u1796\u17B7\u1796\u178E\u17CC\u178F\u17B6\u1780\u17B6\u179A\u1784\u17B6\u179A\u17D4",
    },
    {
      title:
        "\u179F\u17D2\u179C\u17C2\u1784\u1799\u179B\u17CB\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1786\u17D2\u179B\u17B6\u178F\u179C\u17C3",
      description:
        "\u179A\u1794\u17C0\u1794\u178A\u17C2\u179B\u1780\u17D2\u1794\u17BD\u178F\u178A\u17C4\u17C7\u179F\u17D2\u179A\u17B6\u1799 AI \u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u17D4",
    },
    {
      title:
        "\u1782\u178F\u17D2\u179B\u17BE\u17C7\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791",
      description:
        "\u1791\u1791\u17BD\u179B\u17A2\u178F\u17D2\u1790\u1794\u17D2\u179A\u1799\u17C4\u1787\u178F\u17CD\u1785\u17D2\u179A\u17BE\u178F\u1794\u17C6\u1795\u17BB\u178F\u1796\u17B8 Apsara Talent iOS \u178F\u17B7\u1784 Android\u17D4",
    },
    {
      title:
        "\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6 AI Resume Builder",
      description:
        "\u1794\u1784\u17D2\u1780\u17BE\u178F CV \u179C\u17B7\u1787\u17D2\u1787\u17B6\u1787\u17B8\u179C\u17C8\u1787\u17B6\u1798\u17BD\u1799\u1787\u17C6\u178F\u17BD\u1799\u1796\u17B8 AI\u17D4",
    },
    {
      title:
        "\u1780\u17B6\u179A\u178F\u17D2\u179A\u17C0\u1798\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD",
      description:
        "\u17A7\u1794\u1780\u179A\u178E\u17CD \u178F\u17B7\u1784\u1792\u178F\u1792\u17B6\u178F\u178A\u17BE\u1798\u17D2\u1794\u17B8\u178F\u17D2\u179A\u17C0\u1798\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD\u17D4",
    },
  ],
};

const content: Record<string, LearnStrings> = { en, km };

const guideIcons = [
  <LucideTarget key="0" />,
  <LucideFileText key="1" />,
  <LucideSparkles key="2" />,
  <LucideRocket key="3" />,
  <LucideFileText key="4" />,
  <LucideLightbulb key="5" />,
];

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export function LearnContent() {
  const { language } = useLanguageStore();
  const t = content[language] ?? content.en;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LucideArrowLeft className="size-3.5" />
            {t.back}
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold">{t.pageTitle}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:flex lg:gap-12">
        {/* Sticky TOC Sidebar (Desktop) */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {t.tocHeading}
            </span>
            {t.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-10 min-w-0">
          {/* Hero Header */}
          <div className="flex flex-col gap-4">
            <TypographyH1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.pageTitle}
            </TypographyH1>
            <TypographyP className="text-muted-foreground max-w-2xl">
              {t.subtitle}
            </TypographyP>
          </div>

          {/* Getting Started */}
          <Section
            id="getting-started"
            icon={<LucideRocket />}
            title={t.gettingStartedTitle}
          >
            <TypographyP>{t.gettingStartedIntro}</TypographyP>
            <div className="flex flex-col gap-5 mt-2">
              {t.steps.map((step, i) => (
                <StepCard
                  key={i}
                  step={i + 1}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </Section>

          {/* For Job Seekers */}
          <Section
            id="for-job-seekers"
            icon={<LucideUsers />}
            title={t.jobSeekersTitle}
          >
            <TypographyP>{t.jobSeekersIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.jobSeekersBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* For Employers */}
          <Section
            id="for-employers"
            icon={<LucideBriefcase />}
            title={t.employersTitle}
          >
            <TypographyP>{t.employersIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.employersBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Using AI Features */}
          <Section id="using-ai" icon={<LucideSparkles />} title={t.aiTitle}>
            <TypographyP>{t.aiIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.aiBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Guides & Tutorials */}
          <Section id="guides" icon={<LucideBookOpen />} title={t.guidesTitle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {t.guides.map((g, i) => (
                <GuideCard
                  key={i}
                  icon={guideIcons[i]}
                  title={g.title}
                  description={g.description}
                />
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
