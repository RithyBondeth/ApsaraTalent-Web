"use client";

import Link from "next/link";
import {
  LucideArrowLeft,
  LucideShieldCheck,
  LucideLock,
  LucideEye,
  LucideUserCheck,
  LucideAlertTriangle,
  LucideServer,
  LucideCheckCircle,
} from "lucide-react";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
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

/* ─────────────────────────────────────────────────────────────
   Content types & data
───────────────────────────────────────────────────────────── */
type TocItem = { id: string; label: string };

interface SafetyStrings {
  back: string;
  pageTitle: string;
  subtitle: string;
  tocHeading: string;
  toc: TocItem[];
  commitmentTitle: string;
  commitmentIntro: string;
  commitmentBullets: string[];
  dataTitle: string;
  dataIntro: string;
  dataBullets: string[];
  privacyTitle: string;
  privacyIntro: string;
  privacyBullets: string[];
  identityTitle: string;
  identityIntro: string;
  identityBullets: string[];
  reportingTitle: string;
  reportingIntro: string;
  reportingBullets: string[];
  aiSafetyTitle: string;
  aiSafetyIntro: string;
  aiSafetyBullets: string[];
  aiSafetyNote: string;
}

const en: SafetyStrings = {
  back: "Back",
  pageTitle: "Safety",
  subtitle:
    "Your safety is our priority. Learn about the measures we take to protect your data, identity, and experience on Apsara Talent.",
  tocHeading: "Contents",
  toc: [
    { id: "commitment", label: "Our Commitment" },
    { id: "data-protection", label: "Data Protection" },
    { id: "privacy", label: "Privacy Controls" },
    { id: "identity", label: "Identity Verification" },
    { id: "reporting", label: "Reporting & Moderation" },
    { id: "ai-safety", label: "AI Safety" },
  ],
  commitmentTitle: "Our Safety Commitment",
  commitmentIntro:
    "At Apsara Talent, we believe everyone deserves a safe and respectful environment. Our platform is built with multiple layers of protection to ensure your experience is secure.",
  commitmentBullets: [
    "Zero tolerance policy for harassment, fraud, and discriminatory behavior",
    "Continuous monitoring and proactive threat detection across the platform",
    "Dedicated safety team reviewing reports and enforcing community guidelines",
    "Regular security audits and penetration testing by independent experts",
    "Compliance with international data protection standards",
  ],
  dataTitle: "Data Protection",
  dataIntro:
    "We use industry-standard security practices to protect your personal information across all Apsara Talent products \u2014 web, mobile, and AI assistant.",
  dataBullets: [
    "End-to-end encryption for all messages and sensitive data in transit",
    "AES-256 encryption for data at rest in our secure cloud infrastructure",
    "JWT-based authentication with short-lived tokens and secure refresh mechanisms",
    "Role-based access control ensuring users only access what they are authorized to see",
    "Automated backup and disaster recovery systems to prevent data loss",
    "SOC 2 Type II compliance for enterprise-grade security assurance",
  ],
  privacyTitle: "Privacy Controls",
  privacyIntro:
    "You are in control of your data. Apsara Talent provides granular privacy settings so you decide who sees your information.",
  privacyBullets: [
    "Control profile visibility \u2014 choose who can view your profile and contact you",
    "Manage data sharing preferences for matching and recommendations",
    "Download or delete your data at any time through your account settings",
    "Opt out of analytics and tracking with a single toggle",
    "Transparent cookie policy with user consent management",
  ],
  identityTitle: "Identity Verification",
  identityIntro:
    "We work to ensure that every user on the platform is who they claim to be, creating a trustworthy environment for both job seekers and employers.",
  identityBullets: [
    "Email verification required for all accounts",
    "Social login verification through trusted providers (Google, Facebook, LinkedIn, GitHub)",
    "Company verification process for employer accounts to prevent impersonation",
    "Suspicious activity detection and automatic account protection",
    "Two-factor authentication available for enhanced account security",
  ],
  reportingTitle: "Reporting & Moderation",
  reportingIntro:
    "If something does not feel right, we make it easy to report issues and take swift action to protect the community.",
  reportingBullets: [
    "One-tap reporting for inappropriate content, messages, or profiles",
    "Dedicated moderation team that reviews reports within 24 hours",
    "Automatic content filtering to block spam, scams, and harmful material",
    "User blocking and muting tools for personal safety",
    "Transparent enforcement actions with clear appeal processes",
  ],
  aiSafetyTitle: "AI Safety",
  aiSafetyIntro:
    "The Apsara Agentic AI Assistant is built with safety guardrails to ensure fair, unbiased, and transparent recommendations.",
  aiSafetyBullets: [
    "Bias detection and mitigation in matching algorithms to ensure fair treatment",
    "Human oversight on all AI-driven decisions \u2014 AI recommends, humans decide",
    "Transparent reasoning \u2014 every AI suggestion includes an explanation",
    "No use of protected characteristics (race, gender, religion) in matching decisions",
    "Regular fairness audits and model evaluations to prevent algorithmic harm",
    "User feedback loops to continuously improve AI accuracy and safety",
  ],
  aiSafetyNote:
    "Our AI systems are designed to assist and augment human judgment, never to make autonomous decisions about people\u2019s careers or opportunities.",
};

const km: SafetyStrings = {
  back: "\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799",
  pageTitle: "\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796",
  subtitle: "\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780\u1787\u17B6\u17A2\u1791\u17B7\u1797\u17B6\u1796\u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u17D4 \u179F\u17D2\u179C\u17C2\u1784\u1799\u179B\u17CB\u17A2\u17C6\u1796\u17B8\u179C\u17B7\u1792\u17B6\u178F\u1780\u17B6\u179A\u1780\u17B6\u179A\u1796\u17B6\u179A\u178A\u17B6\u178F\u17B6 \u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E \u178F\u17B7\u1784\u1794\u178F\u1796\u17B7\u179F\u17C4\u1792\u178F\u17CD\u17D4",
  tocHeading: "\u1798\u17B6\u178F\u17B7\u1780\u17B6",
  toc: [
    { id: "commitment", label: "\u1780\u17B6\u179A\u1794\u17D2\u178F\u17C1\u1787\u17D2\u1789\u17B6" },
    { id: "data-protection", label: "\u1780\u17B6\u179A\u1780\u17B6\u179A\u1796\u17B6\u179A\u178A\u17B6\u178F\u17B6" },
    { id: "privacy", label: "\u1780\u17B6\u179A\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1797\u17B6\u1796\u17AF\u1780\u1787\u178F" },
    { id: "identity", label: "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E" },
    { id: "reporting", label: "\u1780\u17B6\u179A\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD" },
    { id: "ai-safety", label: "\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 AI" },
  ],
  commitmentTitle: "\u1780\u17B6\u179A\u1794\u17D2\u178F\u17C1\u1787\u17D2\u1789\u17B6\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796",
  commitmentIntro: "\u178F\u17C5 Apsara Talent \u1799\u17BE\u1784\u1787\u17C6\u178F\u17BE\u1790\u17B6\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u178F\u17B6\u179F\u1798\u17B6\u1787\u17B7\u1780\u179F\u1798\u178F\u17D2\u1790\u1780\u17B7\u1785\u17D2\u1785\u1798\u17BD\u1799\u178A\u17C2\u179B\u1798\u17B6\u178F\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 \u178F\u17B7\u1784\u1780\u17B6\u179A\u1780\u17D2\u179A\u17B6\u179A\u1796\u17D4",
  commitmentBullets: [
    "\u1782\u17C4\u179B\u178F\u17B6\u1798\u17C4\u179B\u179F\u17BC\u178F\u17D2\u1799\u1785\u17C6\u1796\u17C4\u17C7\u1780\u17B6\u179A\u1794\u17C0\u179A\u17A2\u17C6\u1796\u17BE\u179A\u17A0\u17B7\u1784\u17D2\u179F\u17B6 \u1780\u17B6\u179A\u1794\u17C4\u1780\u1794\u17D2\u179A\u17B6\u179F\u17CB \u178F\u17B7\u1784\u17A5\u179A\u17B7\u1799\u17B6\u1794\u1790\u179A\u178E\u17B6",
    "\u1780\u17B6\u179A\u178F\u17B7\u178F\u178F\u17B6\u1784\u1794\u178F\u17CB\u1794\u1793\u17D2\u178F \u178F\u17B7\u1784\u1780\u17B6\u179A\u179A\u1780\u1783\u17BE\u1789\u1782\u17D2\u179A\u17C4\u17C7\u1790\u17D2\u178F\u17B6\u1780\u17CB\u179F\u1780\u1798\u17D2\u1798\u178F\u17C5\u1791\u17BC\u1791\u17B6\u17C6\u1784\u179C\u17C1\u1791\u17B7\u1780\u17B6",
    "\u1780\u17D2\u179A\u17BB\u1798\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1797\u17D2\u1793\u17B6\u1780\u17CB\u1797\u17C1\u1793\u17B7\u1784\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD \u178F\u17B7\u1784\u17A2\u178F\u17BB\u179C\u178F\u17D2\u178F\u1780\u17B6\u179A\u178E\u17C2\u178F\u17B6\u17C6\u179F\u17A0\u1782\u1798\u178F\u17CD",
    "\u1780\u17B6\u179A\u178F\u178F\u179C\u178F\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1787\u17B6\u179A\u17C0\u1799\u17D7 \u178A\u17C4\u1799\u17A2\u17D2\u178F\u1780\u1787\u17C6\u178F\u17B6\u1789\u17AF\u1780\u179A\u17B6\u1787\u17D2\u1799",
    "\u1780\u17B6\u179A\u17A2\u178F\u17BB\u1794\u178F\u17D2\u178F\u17B7\u178F\u17B6\u1798\u179F\u17D2\u178F\u1784\u17CB\u178A\u17B6\u1780\u17B6\u179A\u1796\u17B6\u179A\u178A\u17B6\u178F\u17B6\u17A2\u178F\u17D2\u178F\u179A\u1787\u17B6\u178F\u17B7",
  ],
  dataTitle: "\u1780\u17B6\u179A\u1780\u17B6\u179A\u1796\u17B6\u179A\u178A\u17B6\u178F\u17B6",
  dataIntro: "\u1799\u17BE\u1784\u1794\u17D2\u179A\u17BE\u179C\u17B7\u1792\u17B6\u178F\u1780\u17B6\u179A\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u179F\u17D2\u178F\u1784\u17CB\u178A\u17B6\u17A7\u179F\u17D2\u179F\u17B6\u17A0\u1780\u1798\u17D2\u1798\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1780\u17B6\u179A\u1796\u17B6\u179A\u1796\u17D0\u178F\u17CC\u1798\u17B6\u178F\u179F\u17D2\u179C\u17B6\u1799\u17D4",
  dataBullets: [
    "\u1780\u17B6\u179A\u17A2\u17C3\u178F\u1780\u17D2\u179A\u17B8\u1794\u1795\u17D2\u1791\u17C1\u179A\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1791\u17C5\u1797\u17D2\u1787\u17B6\u1794\u17CB\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u179F\u17B6\u179A \u178F\u17B7\u1784\u178A\u17B6\u178F\u17B6\u179A\u179F\u17BE\u1794",
    "\u1780\u17B6\u179A\u17A2\u17C3\u178F\u1780\u17D2\u179A\u17B8\u1794 AES-256 \u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u178A\u17B6\u178F\u17B6\u178A\u17C2\u179B\u179A\u1780\u17D2\u179F\u17B6\u1791\u17BB\u1780",
    "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB JWT \u1787\u17B6\u1798\u17BD\u1799 token \u17A2\u17B6\u1799\u17BB\u1781\u17D2\u179B\u17B8 \u178F\u17B7\u1784\u1799\u178F\u17D2\u178F\u1780\u17B6\u179A refresh \u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796",
    "\u1780\u17B6\u179A\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1780\u17B6\u179A\u1785\u17BC\u179B\u178A\u17C6\u178E\u17BE\u179A\u178A\u17C4\u1799\u1795\u17D2\u17A2\u17C2\u1780\u179B\u17BE\u178F\u17BD\u178F\u17B6\u1791\u17B8",
    "\u1794\u17D2\u179A\u1796\u17D0\u178F\u17D2\u1792 backup \u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7 \u178F\u17B7\u1784\u1794\u17D2\u179A\u1796\u17D0\u178F\u17D2\u1792\u179F\u179A\u17D2\u1782\u17D2\u179A\u17C4\u17C7\u1790\u17D2\u178F\u17B6\u1780\u17CB\u17A2\u17B6\u179F\u17C6\u178F\u179A\u17D2\u1782",
    "SOC 2 Type II \u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1780\u17B6\u179A\u1792\u17B6\u178F\u17B6\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1780\u1798\u17D2\u179A\u17B7\u178F\u179F\u17A0\u1782\u17D2\u179A\u17B6\u179F",
  ],
  privacyTitle: "\u1780\u17B6\u179A\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1797\u17B6\u1796\u17AF\u1780\u1787\u178F",
  privacyIntro: "\u17A2\u17D2\u178F\u1780\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u178A\u17B6\u178F\u17B6\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780\u17D4 Apsara Talent \u1795\u17D2\u178F\u179B\u17CB\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB\u1797\u17B6\u1796\u17AF\u1780\u1787\u178F\u179B\u1798\u17D2\u17A2\u17B7\u178F\u17D4",
  privacyBullets: [
    "\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1797\u17B6\u1796\u1798\u17BE\u179B\u1783\u17BE\u1789\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB \u2014 \u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F\u17A2\u17D2\u178F\u1780\u178E\u17B6\u17A2\u17B6\u1785\u1798\u17BE\u179B \u178F\u17B7\u1784\u1791\u17B6\u1780\u17CB\u1791\u1784\u17A2\u17D2\u178F\u1780",
    "\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1780\u17B6\u179A\u1785\u17C2\u1780\u179A\u17C6\u179B\u17C2\u1780\u178A\u17B6\u178F\u17B6\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784 \u178F\u17B7\u1784\u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6",
    "\u1791\u17B6\u1789\u1799\u1780 \u17AC\u179B\u17BB\u1794\u178A\u17B6\u178F\u17B6\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780\u1793\u17C5\u1796\u17C1\u179B\u178E\u17B6\u1798\u17BD\u1799\u178F\u17B6\u1798\u179A\u1799\u17C8\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB\u1782\u178E\u178F\u17B8",
    "\u1794\u178A\u17B7\u179F\u17C1\u1792\u1780\u17B6\u179A\u179C\u17B7\u1797\u17B6\u1782 \u178F\u17B7\u1784\u1780\u17B6\u179A\u178F\u17B6\u1798\u178A\u17B6\u178F\u1787\u17B6\u1798\u17BD\u1799\u1780\u17B6\u179A\u1794\u17B7\u1791/\u1794\u17BE\u1780\u178F\u17C2\u1798\u17BD\u1799",
    "\u1782\u17C4\u179B\u178F\u17B6\u1798\u17C4\u179B\u1781\u17BC\u1782\u17B8\u178A\u17C2\u179B\u1798\u17B7\u178F\u178F\u1798\u17D2\u179B\u17B6\u1797\u17B6\u1796\u1787\u17B6\u1798\u17BD\u1799\u1780\u17B6\u179A\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1780\u17B6\u179A\u1799\u179B\u17CB\u1796\u17D2\u179A\u1798\u17A2\u17D2\u178F\u1780\u1794\u17D2\u179A\u17BE",
  ],
  identityTitle: "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E",
  identityIntro: "\u1799\u17BE\u1784\u1792\u17D2\u179C\u17BE\u1780\u17B6\u179A\u178A\u17BE\u1798\u17D2\u1794\u17B8\u17A2\u17D2\u178F\u1780\u1794\u17D2\u179A\u17BE\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u178F\u17B6\u179F\u1798\u17B6\u1787\u17B7\u1780\u178F\u17C5\u179B\u17BE\u179C\u17C1\u1791\u17B7\u1780\u17B6\u1787\u17B6\u17A2\u17D2\u178F\u1780\u178A\u17C2\u179B\u1796\u17DD\u1780\u17C1\u17A2\u17C7\u1796\u17B6\u1780\u17CB\u1793\u17C4\u17C7\u17D4",
  identityBullets: [
    "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u17A2\u17CA\u17B8\u1798\u17C2\u179B\u1785\u17B6\u17C6\u1794\u17B6\u1785\u17CB\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1782\u178E\u178F\u17B8\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB",
    "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB Social Login \u178F\u17B6\u1798\u179A\u1799\u17C8 Google, Facebook, LinkedIn, GitHub",
    "\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1780\u17D2\u179A\u17BB\u1798\u17A0\u17CA\u17BB\u178F\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1782\u178E\u178F\u17B8\u178F\u17B7\u1799\u17C4\u1787\u1780",
    "\u1780\u17B6\u179A\u179A\u1780\u1783\u17BE\u1789\u179F\u1780\u1798\u17D2\u1798\u1797\u17B6\u1796\u1798\u17B7\u178F\u179F\u17BB\u179A\u1782\u17D2\u179A\u1794\u17CB \u178F\u17B7\u1784\u1780\u17B6\u179A\u1780\u17B6\u179A\u1796\u17B6\u179A\u1782\u178E\u178F\u17B8\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7",
    "\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1796\u17B8\u179A\u1787\u17C6\u17A0\u17B6\u178F\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1782\u178E\u178F\u17B8\u1780\u17BE\u178F\u17A1\u17BE\u1784",
  ],
  reportingTitle: "\u1780\u17B6\u179A\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD",
  reportingIntro: "\u1794\u17BE\u179F\u17B7\u178F\u1787\u17B6\u1798\u17B6\u178F\u17A2\u17D2\u179C\u17B8\u178A\u17C2\u179B\u1798\u17B7\u178F\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C \u1799\u17BE\u1784\u1792\u17D2\u179C\u17BE\u17B1\u17D2\u1799\u1784\u17B6\u1799\u1780\u17D2\u178F\u17BB\u1784\u1780\u17B6\u179A\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u17D4",
  reportingBullets: [
    "\u1780\u17B6\u179A\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u178A\u17C4\u1799\u1785\u17BB\u1785\u178F\u17C2\u1798\u17BD\u1799\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1798\u17B6\u178F\u17B7\u1780\u17B6\u1798\u17B7\u178F\u179F\u1798\u179A\u1798\u17D2\u1799 \u179F\u17B6\u179A \u17AC\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB",
    "\u1780\u17D2\u179A\u17BB\u1798\u178F\u17B7\u178F\u178F\u17B6\u1784\u178A\u17C2\u179B\u1796\u17B7\u178F\u17B7\u178F\u17D2\u1799\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1780\u17D2\u178F\u17BB\u1784 24 \u1798\u17C9\u17C4\u1784",
    "\u1780\u17B6\u179A\u178F\u1798\u17D2\u179A\u1784\u1798\u17B6\u178F\u17B7\u1780\u17B6\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u178A\u17BE\u1798\u17D2\u1794\u17B8\u179A\u17B6\u179A\u17B6\u17C6\u1784 spam \u1780\u17D2\u179B\u17C2\u1784 \u178F\u17B7\u1784\u179F\u1798\u17D2\u1797\u17B6\u179A\u17C8\u1782\u17D2\u179A\u17C4\u17C7\u1790\u17D2\u178F\u17B6\u1780\u17CB",
    "\u17A7\u1794\u1780\u179A\u178E\u17CD\u179A\u17B6\u179A\u17B6\u17C6\u1784 \u178F\u17B7\u1784\u1794\u17B7\u1791\u179F\u1798\u17D2\u179B\u17C1\u1784\u17A2\u17D2\u178F\u1780\u1794\u17D2\u179A\u17BE\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1795\u17D2\u1791\u17B6\u179B\u17CB\u1781\u17D2\u179B\u17BD\u178F",
    "\u179F\u1780\u1798\u17D2\u1798\u1797\u17B6\u1796\u17A2\u178F\u17BB\u179C\u178F\u17D2\u178F\u178A\u17C2\u179B\u1798\u17B7\u178F\u178F\u1798\u17D2\u179B\u17B6\u1797\u17B6\u1796\u1787\u17B6\u1798\u17BD\u1799\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u17A2\u17C2\u179B\u1785\u17D2\u1794\u17B6\u179F\u17CB",
  ],
  aiSafetyTitle: "\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 AI",
  aiSafetyIntro: "Apsara Agentic AI Assistant \u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u178F\u1794\u1784\u17D2\u1780\u17BE\u178F\u1787\u17B6\u1798\u17BD\u1799\u1780\u17B6\u179A\u1780\u17B6\u179A\u1796\u17B6\u179A\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1792\u17B6\u178F\u17B6\u1780\u17B6\u179A\u178E\u17C2\u178F\u17B6\u17C6\u1799\u17BB\u178F\u17D2\u178F\u17B7\u1792\u1798\u17CC \u1798\u17B7\u178F\u179B\u17C6\u17A2\u17C0\u1784 \u178F\u17B7\u1784\u178F\u1798\u17D2\u179B\u17B6\u1797\u17B6\u1796\u17D4",
  aiSafetyBullets: [
    "\u1780\u17B6\u179A\u179A\u1780\u1783\u17BE\u1789 \u178F\u17B7\u1784\u1780\u17B6\u179A\u1780\u17B6\u178F\u17CB\u1794\u178F\u17D2\u1790\u17C2\u1798\u179B\u17C6\u17A2\u17C0\u1784\u1780\u17D2\u178F\u17BB\u1784\u1780\u17D2\u1794\u17BD\u178F\u178A\u17C4\u17C7\u179F\u17D2\u179A\u17B6\u1799\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784",
    "\u1798\u178F\u17BB\u179F\u17D2\u179F\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB\u178F\u17C5\u179B\u17BE\u1780\u17B6\u179A\u179F\u1798\u17D2\u179A\u17C1\u1785\u1785\u17B7\u178F\u17D2\u178F\u179A\u1794\u179F\u17CB AI \u2014 AI \u178E\u17C2\u178F\u17B6\u17C6 \u1798\u178F\u17BB\u179F\u17D2\u179F\u179F\u1798\u17D2\u179A\u17C1\u1785\u1785\u17B7\u178F\u17D2\u178F",
    "\u17A0\u17C1\u178F\u17BB\u1795\u179B\u178F\u1798\u17D2\u179B\u17B6\u1797\u17B6\u1796 \u2014 \u179A\u17B6\u179B\u17CB\u1780\u17B6\u179A\u178E\u17C2\u178F\u17B6\u17C6\u1796\u17B8 AI \u1798\u1780\u1787\u17B6\u1798\u17BD\u1799\u1780\u17B6\u179A\u1796\u178F\u17D2\u1799\u179B\u17CB",
    "\u1798\u17B7\u178F\u1794\u17D2\u179A\u17BE\u179B\u1780\u17D2\u1781\u178E\u17C8\u178A\u17C2\u179B\u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A\u1796\u17B6\u179A (\u1796\u17BC\u1787 \u1797\u17C1\u1791 \u179F\u17B6\u179F\u178F\u17B6) \u1780\u17D2\u178F\u17BB\u1784\u1780\u17B6\u179A\u179F\u1798\u17D2\u179A\u17C1\u1785\u1785\u17B7\u178F\u17D2\u178F\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784",
    "\u1780\u17B6\u179A\u178F\u178F\u179C\u178F\u1799\u17BB\u178F\u17D2\u178F\u17B7\u1792\u1798\u17CC\u1787\u17B6\u179A\u17C0\u1799\u17D7 \u178F\u17B7\u1784\u1780\u17B6\u179A\u179C\u17B6\u1799\u178F\u1798\u17D2\u179B\u17C3\u1798\u17C9\u17BC\u178A\u17C2\u179B\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1780\u17B6\u179A\u1796\u17B6\u179A\u17A2\u17C3\u178F\u1780\u17D2\u179A\u17B8\u1794\u17A0\u17B6\u178F\u17B7",
    "\u179A\u1784\u17D2\u179C\u1784\u17CB\u1798\u178F\u17B7\u1794\u17D2\u179A\u178F\u17B7\u1780\u1798\u17D2\u1798\u17A2\u17D2\u178F\u1780\u1794\u17D2\u179A\u17BE\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1780\u17C2\u179B\u1798\u17D2\u17A2\u1797\u17B6\u1796\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C \u178F\u17B7\u1784\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 AI",
  ],
  aiSafetyNote: "\u1794\u17D2\u179A\u1796\u17D0\u178F\u17D2\u1792 AI \u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u178F\u179A\u1785\u178F\u17B6\u1781\u17BE\u1784\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1787\u17BD\u1799 \u178F\u17B7\u1784\u1794\u178F\u17D2\u1790\u17C2\u1798\u1780\u17B6\u179A\u179C\u17B7\u178F\u17B7\u1789\u17D2\u1789\u17B6\u178E\u179A\u1794\u179F\u17CB\u1798\u178F\u17BB\u179F\u17D2\u179F \u1798\u17B7\u178F\u1798\u17C2\u178F\u1787\u17C6\u178F\u17BD\u179F\u179C\u17B6\u1791\u17C1\u17D4",
};

const content: Record<string, SafetyStrings> = { en, km };

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export function SafetyContent() {
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

          {/* Our Commitment */}
          <Section
            id="commitment"
            icon={<LucideShieldCheck />}
            title={t.commitmentTitle}
          >
            <TypographyP>{t.commitmentIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.commitmentBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Data Protection */}
          <Section
            id="data-protection"
            icon={<LucideServer />}
            title={t.dataTitle}
          >
            <TypographyP>{t.dataIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.dataBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Privacy Controls */}
          <Section id="privacy" icon={<LucideEye />} title={t.privacyTitle}>
            <TypographyP>{t.privacyIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.privacyBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Identity Verification */}
          <Section
            id="identity"
            icon={<LucideUserCheck />}
            title={t.identityTitle}
          >
            <TypographyP>{t.identityIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.identityBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* Reporting & Moderation */}
          <Section
            id="reporting"
            icon={<LucideAlertTriangle />}
            title={t.reportingTitle}
          >
            <TypographyP>{t.reportingIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.reportingBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </Section>

          {/* AI Safety */}
          <Section
            id="ai-safety"
            icon={<LucideLock />}
            title={t.aiSafetyTitle}
          >
            <TypographyP>{t.aiSafetyIntro}</TypographyP>
            <ul className="flex flex-col gap-2 mt-1">
              {t.aiSafetyBullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <LucideCheckCircle className="size-4 text-emerald-500 shrink-0" />
              <TypographySmall className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t.aiSafetyNote}
              </TypographySmall>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
