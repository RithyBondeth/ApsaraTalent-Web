"use client";

import {
  LucideHelpCircle,
  LucideMessageCircle,
  LucideMail,
  LucideSmartphone,
  LucideBookOpen,
  LucideUsers,
  LucideChevronDown,
} from "lucide-react";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  StaticBullet,
  StaticCard,
  StaticPageShell,
  StaticSection,
} from "@/components/static-content/static-page";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useId, useState } from "react";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const answerId = useId();

  return (
    <div
      className="static-page-faq border-t border-border last:border-b"
      data-open={open}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
      >
        <span>{question}</span>
        <LucideChevronDown className="static-page-faq-chevron size-4 shrink-0 text-muted-foreground transition-transform duration-300" />
      </button>
      <div id={answerId} className="static-page-faq-answer">
        <div className="overflow-hidden">
          <p className="border-t border-border/60 pb-5 pt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Content Types & Data ----------------------- */
type TTocItem = { id: string; label: string };
type TFaqEntry = { q: string; a: string };
type TContactEntry = {
  title: string;
  description: string;
  action: string;
};

interface ISupportStrings {
  back: string;
  pageTitle: string;
  subtitle: string;
  tocHeading: string;
  toc: TTocItem[];
  faqTitle: string;
  faqIntro: string;
  faqs: TFaqEntry[];
  contactTitle: string;
  contactIntro: string;
  contacts: TContactEntry[];
  mobileTitle: string;
  mobileIntro: string;
  mobileBullets: string[];
  communityTitle: string;
  communityIntro: string;
  communityBullets: string[];
  resourcesTitle: string;
  resourcesIntro: string;
  resourcesBullets: string[];
}

const en: ISupportStrings = {
  back: "Back",
  pageTitle: "Support",
  subtitle:
    "Need help? Find answers to common questions, get in touch with our team, or explore resources to resolve any issues.",
  tocHeading: "Contents",
  toc: [
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact Us" },
    { id: "mobile-support", label: "Mobile App Support" },
    { id: "community", label: "Community" },
    { id: "resources", label: "Resources" },
  ],
  faqTitle: "Frequently Asked Questions",
  faqIntro: "Quick answers to the most common questions about Apsara Talent.",
  faqs: [
    {
      q: "How do I create an account?",
      a: "You can sign up using your email, or through social login with Google, Facebook, LinkedIn, or GitHub. Visit the Sign Up page to get started.",
    },
    {
      q: "Is Apsara Talent free to use?",
      a: "Yes! Creating a profile, browsing jobs, and using basic matching features are completely free for job seekers. Employers can post jobs and access standard features at no cost.",
    },
    {
      q: "How does the AI matching work?",
      a: "Our Apsara Agentic AI Assistant analyzes your skills, experience, preferences, and behavior patterns to suggest the most compatible matches. The more complete your profile, the better the recommendations.",
    },
    {
      q: "Is my data safe on the platform?",
      a: "Absolutely. We use end-to-end encryption, AES-256 for data at rest, and JWT-based authentication. Visit our Safety page to learn more about our security practices.",
    },
    {
      q: "How do I reset my password?",
      a: "Click 'Forgot Password' on the login page. We will send a verification code to your registered email. Follow the instructions to set a new password.",
    },
    {
      q: "Can I use Apsara Talent on my phone?",
      a: "Yes! Our mobile app is available on both iOS (App Store) and Android (Google Play). You get full access to matching, messaging, profile management, and push notifications.",
    },
    {
      q: "How do I delete my account?",
      a: "Go to Settings in your account and select 'Delete Account'. You can also download your data before deletion. This action is permanent and cannot be undone.",
    },
    {
      q: "What is the Apsara Agentic AI Assistant?",
      a: "It is an intelligent AI companion built into the platform that helps with matching, resume building, interview preparation, and provides personalized career insights. It augments human decision-making without replacing it.",
    },
  ],
  contactTitle: "Contact Us",
  contactIntro:
    "Can not find what you are looking for? Reach out to our support team through any of these channels.",
  contacts: [
    {
      title: "Email Support",
      description:
        "Send us a detailed message and our team will respond within 24 hours.",
      action: "support@apsaratalent.com",
    },
    {
      title: "In-App Chat",
      description:
        "Use the chat feature within the app to get real-time assistance from our support team.",
      action: "Available in app",
    },
    {
      title: "Report a Problem",
      description:
        "Found a bug or experiencing an issue? Use the Report a Problem feature in your account settings.",
      action: "Settings \u2192 Report a Problem",
    },
  ],
  mobileTitle: "Mobile App Support",
  mobileIntro:
    "Having trouble with the Apsara Talent mobile app? Here are some common solutions.",
  mobileBullets: [
    "Make sure you have the latest version of the app installed from the App Store or Google Play",
    "Clear the app cache if you experience slow loading or display issues",
    "Check your internet connection \u2014 some features require a stable connection",
    "Enable push notifications in your device settings to receive match and message alerts",
    "If the app crashes, try force-closing and reopening it, or reinstall if the issue persists",
    "For login issues on mobile, try using the same social login method you used during registration",
  ],
  communityTitle: "Community",
  communityIntro:
    "Join the Apsara Talent community to connect with other users, share experiences, and stay updated.",
  communityBullets: [
    "Follow us on social media for platform updates, tips, and job market insights",
    "Join discussions with other job seekers and employers on the platform feed",
    "Share feedback and feature requests \u2014 we actively listen to our community",
    "Participate in Apsara Talent events and webinars for professional development",
  ],
  resourcesTitle: "Resources",
  resourcesIntro:
    "Explore these resources to get the most out of your Apsara Talent experience.",
  resourcesBullets: [
    "Learn page \u2014 Guides, tutorials, and best practices for job seekers and employers",
    "Safety page \u2014 Information about our security measures and privacy controls",
    "Privacy Policy \u2014 How we collect, use, and protect your personal data",
    "Terms of Service \u2014 The rules and guidelines for using the platform",
  ],
};

const km: ISupportStrings = {
  back: "\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799",
  pageTitle: "\u1787\u17C6\u178F\u17BD\u1799",
  subtitle:
    "\u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A\u1787\u17C6\u178F\u17BD\u1799? \u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1785\u1798\u17D2\u179B\u17BE\u1799\u1785\u17C6\u1796\u17C4\u17C7\u179F\u17C6\u178E\u17BD\u179A\u1785\u17C2\u1780\u179A\u17C6\u179B\u17C2\u1780\u17D4",
  tocHeading: "\u1798\u17B6\u178F\u17B7\u1780\u17B6",
  toc: [
    {
      id: "faq",
      label:
        "\u179F\u17C6\u178E\u17BD\u179A\u1787\u17B6\u17C6\u1784\u179F\u17BD\u179A",
    },
    {
      id: "contact",
      label: "\u1791\u17B6\u1780\u17CB\u1791\u1784\u1799\u17BE\u1784",
    },
    {
      id: "mobile-support",
      label:
        "\u1787\u17C6\u178F\u17BD\u1799\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791",
    },
    { id: "community", label: "\u179F\u17A0\u1782\u1798\u178F\u17CD" },
    { id: "resources", label: "\u1792\u178F\u1792\u17B6\u178F" },
  ],
  faqTitle:
    "\u179F\u17C6\u178E\u17BD\u179A\u1787\u17B6\u17C6\u1784\u179F\u17BD\u179A",
  faqIntro:
    "\u1785\u1798\u17D2\u179B\u17BE\u1799\u179A\u17A0\u17D0\u179F\u1785\u17C6\u1796\u17C4\u17C7\u179F\u17C6\u178E\u17BD\u179A\u178A\u17C2\u179B\u179F\u17BD\u179A\u1787\u17B6\u17C6\u1784\u1785\u17D2\u179A\u17BE\u178F\u17A2\u17C6\u1796\u17B8 Apsara Talent\u17D4",
  faqs: [
    {
      q: "\u178F\u17BE\u1794\u1784\u17D2\u1780\u17BE\u178F\u1782\u178E\u178F\u17B8\u1799\u17C9\u17B6\u1784\u1798\u17C9\u17C1\u1785?",
      a: "\u17A2\u17D2\u178F\u1780\u17A2\u17B6\u1785\u1785\u17BB\u17C7\u1788\u17D2\u1798\u17C4\u17C7\u1787\u17B6\u1798\u17BD\u1799\u17A2\u17CA\u17B8\u1798\u17C2\u179B \u17AC\u178F\u17B6\u1798\u179A\u1799\u17C8 Social Login \u1787\u17B6\u1798\u17BD\u1799 Google, Facebook, LinkedIn \u17AC GitHub\u17D4",
    },
    {
      q: "Apsara Talent \u17A5\u178F\u1782\u17B7\u178F\u1790\u17D2\u179B\u17C3\u178A\u17C2\u179A \u17AC\u1791\u17C1?",
      a: "\u1794\u17B6\u1791! \u1780\u17B6\u179A\u1794\u1784\u17D2\u1780\u17BE\u178F\u1796\u17D2\u179A\u17BC\u17A0\u17D2\u179C\u17B6\u179B\u17CB \u179A\u1780\u1798\u17BE\u179B\u1780\u17B6\u179A\u1784\u17B6\u179A \u178F\u17B7\u1784\u1794\u17D2\u179A\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1787\u17B6\u1798\u17BC\u179B\u178A\u17D2\u178B\u17B6\u178F\u17A5\u178F\u1782\u17B7\u178F\u1790\u17D2\u179B\u17C3\u17D4",
    },
    {
      q: "\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784 AI \u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u1799\u17C9\u17B6\u1784\u1798\u17C9\u17C1\u1785?",
      a: "Apsara Agentic AI Assistant \u179C\u17B7\u1797\u17B6\u1782\u1787\u17C6\u178F\u17B6\u1789 \u1794\u178F\u1796\u17B7\u179F\u17C4\u1792\u178F\u17CD \u178F\u17B7\u1784\u1785\u17C6\u178E\u1784\u17CB\u1785\u17C6\u178E\u17BC\u179B\u1785\u17B7\u178F\u17D2\u178F\u178A\u17BE\u1798\u17D2\u1794\u17B8\u178E\u17C2\u178F\u17B6\u17C6\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u179B\u17D2\u17A2\u1794\u17C6\u1795\u17BB\u178F\u17D4",
    },
    {
      q: "\u178A\u17B6\u178F\u17B6\u179A\u1794\u179F\u17CB\u1781\u17D2\u1789\u17BB\u17C6\u1798\u17B6\u178F\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u178A\u17C2\u179A \u17AC\u1791\u17C1?",
      a: "\u1794\u17B6\u1791! \u1799\u17BE\u1784\u1794\u17D2\u179A\u17BE\u1780\u17B6\u179A\u17A2\u17C3\u178F\u1780\u17D2\u179A\u17B8\u1794\u1795\u17D2\u1791\u17C1\u179A\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1791\u17C5\u1797\u17D2\u1787\u17B6\u1794\u17CB, AES-256 \u178F\u17B7\u1784\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB JWT\u17D4",
    },
    {
      q: "\u178F\u17BE\u1780\u17C6\u178E\u178F\u17CB\u1796\u17B6\u1780\u17D2\u1799\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB\u17A1\u17BE\u1784\u179C\u17B7\u1789\u1799\u17C9\u17B6\u1784\u1798\u17C9\u17C1\u1785?",
      a: "\u1785\u17BB\u1785 '\u1797\u17D2\u179B\u17C1\u1785\u1796\u17B6\u1780\u17D2\u1799\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB' \u178F\u17C5\u1791\u17C6\u1796\u17D0\u179A\u1785\u17BC\u179B\u17D4 \u1799\u17BE\u1784\u178F\u17B9\u1784\u1795\u17D2\u1789\u17BE\u179B\u17C1\u1781\u1780\u17BC\u178A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1791\u17C5\u17A2\u17CA\u17B8\u1798\u17C2\u179B\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780\u17D4",
    },
    {
      q: "\u1781\u17D2\u1789\u17BB\u17C6\u17A2\u17B6\u1785\u1794\u17D2\u179A\u17BE Apsara Talent \u178F\u17C5\u179B\u17BE\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791\u1794\u17B6\u178F\u178A\u17C2\u179A \u17AC\u1791\u17C1?",
      a: "\u1794\u17B6\u1791! \u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791\u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u1798\u17B6\u178F\u178F\u17C5\u179B\u17BE iOS (App Store) \u178F\u17B7\u1784 Android (Google Play)\u17D4",
    },
    {
      q: "\u178F\u17BE\u179B\u17BB\u1794\u1782\u178E\u178F\u17B8\u1799\u17C9\u17B6\u1784\u1798\u17C9\u17C1\u1785?",
      a: "\u1785\u17BC\u179B\u1791\u17C5\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB \u17A0\u17BE\u1799\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F '\u179B\u17BB\u1794\u1782\u178E\u178F\u17B8'\u17D4 \u17A2\u17D2\u178F\u1780\u17A2\u17B6\u1785\u1791\u17B6\u1789\u1799\u1780\u178A\u17B6\u178F\u17B6\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780\u1798\u17BB\u178F\u1796\u17C1\u179B\u179B\u17BB\u1794\u17D4",
    },
    {
      q: "\u17A2\u17D2\u179C\u17B8\u1787\u17B6 Apsara Agentic AI Assistant?",
      a: "\u179C\u17B6\u1787\u17B6\u178A\u17C3\u1782\u17BC AI \u178A\u17C2\u179B\u1794\u1784\u17D2\u1780\u17BE\u178F\u1780\u17D2\u178F\u17BB\u1784\u179C\u17C1\u1791\u17B7\u1780\u17B6 \u1787\u17BD\u1799\u1780\u17B6\u179A\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784 \u1794\u1784\u17D2\u1780\u17BE\u178F CV \u178F\u17D2\u179A\u17C0\u1798\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD \u178F\u17B7\u1784\u1780\u17B6\u179A\u1799\u179B\u17CB\u178A\u17B9\u1784\u17A2\u17B6\u1787\u17B8\u1796\u17D4",
    },
  ],
  contactTitle: "\u1791\u17B6\u1780\u17CB\u1791\u1784\u1799\u17BE\u1784",
  contactIntro:
    "\u179A\u1780\u1798\u17B7\u178F\u17A2\u17D2\u179C\u17B8\u178A\u17C2\u179B\u17A2\u17D2\u178F\u1780\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780? \u1791\u17B6\u1780\u17CB\u1791\u1784\u1780\u17D2\u179A\u17BB\u1798\u1787\u17C6\u178F\u17BD\u1799\u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u17D4",
  contacts: [
    {
      title:
        "\u1787\u17C6\u178F\u17BD\u1799\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
      description:
        "\u1795\u17D2\u1789\u17BE\u179F\u17B6\u179A\u179B\u1798\u17D2\u17A2\u17B7\u178F \u1780\u17D2\u179A\u17BB\u1798\u1799\u17BE\u1784\u178F\u17B9\u1784\u1786\u17D2\u179B\u17BE\u1799\u178F\u1794\u1780\u17D2\u178F\u17BB\u1784 24 \u1798\u17C9\u17C4\u1784\u17D4",
      action: "support@apsaratalent.com",
    },
    {
      title:
        "\u1787\u17C6\u178F\u17BD\u1799\u1780\u17D2\u178F\u17BB\u1784\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8",
      description:
        "\u1794\u17D2\u179A\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A\u1787\u17C6\u178F\u17BD\u1799\u1780\u17D2\u178F\u17BB\u1784\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1791\u1791\u17BD\u179B\u1787\u17C6\u178F\u17BD\u1799\u1797\u17D2\u179B\u17B6\u1798\u17D7\u17D4",
      action:
        "\u1798\u17B6\u178F\u1780\u17D2\u178F\u17BB\u1784\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8",
    },
    {
      title:
        "\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1794\u1789\u17D2\u17A0\u17B6",
      description:
        "\u179A\u1780\u1783\u17BE\u1789\u1780\u17C6\u17A0\u17BB\u179F? \u1794\u17D2\u179A\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A\u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1794\u1789\u17D2\u17A0\u17B6\u1780\u17D2\u178F\u17BB\u1784\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB\u17D4",
      action:
        "\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB \u2192 \u179A\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1794\u1789\u17D2\u17A0\u17B6",
    },
  ],
  mobileTitle:
    "\u1787\u17C6\u178F\u17BD\u1799\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791",
  mobileIntro:
    "\u1798\u17B6\u178F\u1794\u1789\u17D2\u17A0\u17B6\u1787\u17B6\u1798\u17BD\u1799\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791? \u178F\u17C5\u178F\u17B8\u1787\u17B6\u178A\u17C6\u178E\u17C4\u17C7\u179F\u17D2\u179A\u17B6\u1799\u1787\u17B6\u1784\u17D4",
  mobileBullets: [
    "\u1792\u17B6\u178F\u17B6\u17A2\u17B6\u1790\u17B6\u17A2\u17D2\u178F\u1780\u1798\u17B6\u178F\u1780\u17C6\u178E\u17C2\u1790\u17D2\u1798\u17B8\u1794\u17C6\u1795\u17BB\u178F\u1796\u17B8 App Store \u17AC Google Play",
    "\u179F\u1798\u17D2\u17A2\u17B6\u178F cache \u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1794\u17BE\u179F\u17B7\u178F\u1787\u17B6\u179C\u17B6\u1795\u17D2\u1791\u17BB\u1780\u1799\u17BA\u178F",
    "\u1796\u17B7\u178F\u17B7\u178F\u17D2\u1799\u1780\u17B6\u179A\u1797\u17D2\u1787\u17B6\u1794\u17CB\u17A2\u17CA\u17B8\u178F\u1792\u17BA\u178E\u17C3\u178F\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780 \u2014 \u1798\u17BB\u1781\u1784\u17B6\u179A\u1798\u17BD\u1799\u1785\u17C6\u178F\u17BD\u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A\u1797\u17D2\u1787\u17B6\u1794\u17CB\u179F\u17D2\u1790\u17B7\u179A",
    "\u1794\u17BE\u1780\u1780\u17B6\u179A\u1787\u17BC\u178F\u178A\u17C6\u178E\u17B9\u1784\u1780\u17D2\u178F\u17BB\u1784\u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB\u17A7\u1794\u1780\u179A\u178E\u17CD\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1791\u1791\u17BD\u179B\u1780\u17B6\u179A\u1787\u17BC\u178F\u178A\u17C6\u178E\u17B9\u1784",
    "\u1794\u17BE\u179F\u17B7\u178F\u1787\u17B6\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u1782\u17B6\u17C6\u1784 \u179F\u17B6\u1780\u179B\u17D2\u1794\u1784\u1794\u17B7\u1791\u17A0\u17BE\u1799\u178A\u17C6\u17A1\u17BE\u1784\u179C\u17B7\u1789",
    "\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1794\u1789\u17D2\u17A0\u17B6\u1780\u17B6\u179A\u1785\u17BC\u179B \u179F\u17B6\u1780\u179B\u17D2\u1794\u1784\u1794\u17D2\u179A\u17BE Social Login \u178A\u17C2\u179B\u17A2\u17D2\u178F\u1780\u1794\u17B6\u178F\u1794\u17D2\u179A\u17BE\u1796\u17C1\u179B\u1785\u17BB\u17C7\u1788\u17D2\u1798\u17C4\u17C7",
  ],
  communityTitle: "\u179F\u17A0\u1782\u1798\u178F\u17CD",
  communityIntro:
    "\u1785\u17BC\u179B\u179A\u17BD\u1798\u179F\u17A0\u1782\u1798\u178F\u17CD Apsara Talent \u178A\u17BE\u1798\u17D2\u1794\u17B8\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1787\u17B6\u1798\u17BD\u1799\u17A2\u17D2\u178F\u1780\u1794\u17D2\u179A\u17BE\u1795\u17D2\u179F\u17C1\u1784\u17D7\u17D4",
  communityBullets: [
    "\u178F\u17B6\u1798\u178A\u17B6\u178F\u1799\u17BE\u1784\u178F\u17C5\u179B\u17BE\u1794\u178E\u17D2\u178F\u17B6\u1789\u179F\u1784\u17D2\u1782\u1798\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1796\u17D0\u178F\u17CC\u1798\u17B6\u178F\u1790\u17D2\u1798\u17B8\u17D7",
    "\u1785\u17BC\u179B\u179A\u17BD\u1798\u1780\u17B6\u179A\u1796\u17B7\u1797\u17B6\u1780\u17D2\u179F\u17B6\u1787\u17B6\u1798\u17BD\u1799\u17A2\u17D2\u178F\u1780\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1780\u17B6\u179A\u1784\u17B6\u179A \u178F\u17B7\u1784\u178F\u17B7\u1799\u17C4\u1787\u1780\u178F\u17C5\u179B\u17BE Feed",
    "\u1785\u17C2\u1780\u179A\u17C6\u179B\u17C2\u1780\u1798\u178F\u17B7\u1794\u17D2\u179A\u178F\u17B7\u1780\u1798\u17D2\u1798 \u178F\u17B7\u1784\u179F\u17C6\u178E\u17BE\u1798\u17BB\u1781\u1784\u17B6\u179A \u2014 \u1799\u17BE\u1784\u179F\u17D2\u178A\u17B6\u1794\u17CB\u179F\u17A0\u1782\u1798\u178F\u17CD\u179A\u1794\u179F\u17CB\u1799\u17BE\u1784",
    "\u1785\u17BC\u179B\u179A\u17BD\u1798\u1780\u17B7\u1785\u17D2\u1785\u1780\u1798\u17D2\u1798 Apsara Talent \u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1780\u17B6\u179A\u17A2\u1797\u17B7\u179C\u178C\u17D2\u178D\u178F\u17CD\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1787\u17B8\u179C\u17C8",
  ],
  resourcesTitle: "\u1792\u178F\u1792\u17B6\u178F",
  resourcesIntro:
    "\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1792\u178F\u1792\u17B6\u178F\u1791\u17B6\u17C6\u1784\u178F\u17C1\u17C7\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1791\u1791\u17BD\u179B\u17A2\u178F\u17D2\u1790\u1794\u17D2\u179A\u1799\u17C4\u1787\u178F\u17CD\u1785\u17D2\u179A\u17BE\u178F\u1794\u17C6\u1795\u17BB\u178F\u17D4",
  resourcesBullets: [
    "\u1791\u17C6\u1796\u17D0\u179A\u179F\u17D2\u179C\u17C2\u1784\u1799\u179B\u17CB \u2014 \u1780\u17B6\u179A\u178E\u17C2\u178E\u17B6\u17C6 \u1798\u17C1\u179A\u17C0\u178F \u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u17A2\u17D2\u178F\u1780\u179F\u17D2\u179C\u17C2\u1784\u179A\u1780\u1780\u17B6\u179A\u1784\u17B6\u179A \u178F\u17B7\u1784\u178F\u17B7\u1799\u17C4\u1787\u1780",
    "\u1791\u17C6\u1796\u17D0\u179A\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 \u2014 \u1796\u17D0\u178F\u17CC\u1798\u17B6\u178F\u17A2\u17C6\u1796\u17B8\u179C\u17B7\u1792\u17B6\u178F\u1780\u17B6\u179A\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796 \u178F\u17B7\u1784\u1797\u17B6\u1796\u17AF\u1780\u1787\u178F",
    "\u1782\u17C4\u179B\u178F\u17B6\u1798\u17C4\u179B\u1797\u17B6\u1796\u17AF\u1780\u1787\u178F \u2014 \u179A\u1794\u17C0\u1794\u178A\u17C2\u179B\u1799\u17BE\u1784\u1794\u17D2\u179A\u1798\u17BC\u179B \u1794\u17D2\u179A\u17BE \u178F\u17B7\u1784\u1780\u17B6\u179A\u1796\u17B6\u179A\u178A\u17B6\u178F\u17B6\u179F\u17D2\u179C\u17B6\u1799\u179A\u1794\u179F\u17CB\u17A2\u17D2\u178F\u1780",
    "\u179B\u1780\u17D2\u1781\u1781\u178E\u17D2\u178C\u17A7\u1794\u1799\u17C4\u1782 \u2014 \u1780\u178F\u17B7\u1780\u17B6 \u178F\u17B7\u1784\u1780\u17B6\u179A\u178E\u17C2\u178F\u17B6\u17C6\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u179C\u17C1\u1791\u17B7\u1780\u17B6",
  ],
};

const content: Record<string, ISupportStrings> = { en, km };

const contactIcons = [
  <LucideMail key="0" />,
  <LucideMessageCircle key="1" />,
  <LucideHelpCircle key="2" />,
];

/* -------------------------- Main Component -------------------------- */
export function SupportContent({
  sessionRole,
}: {
  sessionRole?: string | null;
}) {
  /* ------------------------------ Utils ----------------------------- */
  const { language } = useLanguageStore();
  const t = content[language] ?? content.en;

  /* ---------------------------- Render UI --------------------------- */
  return (
    <StaticPageShell
      sessionRole={sessionRole}
      pageNumber="04"
      title={t.pageTitle}
      subtitle={t.subtitle}
      tocHeading={t.tocHeading}
      toc={t.toc}
    >
      {/* FAQ Section */}
      <StaticSection
        id="faq"
        number="01"
        icon={<LucideHelpCircle />}
        title={t.faqTitle}
      >
        <TypographyP>{t.faqIntro}</TypographyP>
        <div className="mt-1 flex flex-col gap-2">
          {t.faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </StaticSection>

      {/* Contact Us Section */}
      <StaticSection
        id="contact"
        number="02"
        icon={<LucideMail />}
        title={t.contactTitle}
      >
        <TypographyP>{t.contactIntro}</TypographyP>
        <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {t.contacts.map((c, i) => (
            <StaticCard
              key={i}
              icon={contactIcons[i]}
              title={c.title}
              description={c.description}
              footer={
                <span className="text-xs font-semibold text-foreground">
                  {c.action}
                </span>
              }
            />
          ))}
        </div>
      </StaticSection>

      {/* Mobile App Support Section */}
      <StaticSection
        id="mobile-support"
        number="03"
        icon={<LucideSmartphone />}
        title={t.mobileTitle}
      >
        <TypographyP>{t.mobileIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.mobileBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
      </StaticSection>

      {/* Community Section */}
      <StaticSection
        id="community"
        number="04"
        icon={<LucideUsers />}
        title={t.communityTitle}
      >
        <TypographyP>{t.communityIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.communityBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
      </StaticSection>

      {/* Resources Section */}
      <StaticSection
        id="resources"
        number="05"
        icon={<LucideBookOpen />}
        title={t.resourcesTitle}
      >
        <TypographyP>{t.resourcesIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.resourcesBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
      </StaticSection>
    </StaticPageShell>
  );
}
