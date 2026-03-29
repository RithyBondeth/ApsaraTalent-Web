"use client";

import { useLanguageStore } from "@/stores/languages/language-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* --------------------------------- Helpers -------------------------------- */
// ── Brand Suffix ──────────────────────────────────────────
const BRAND = "Apsara Talent";

// ── Static Route → Bilingual Title Map ───────────────────
const TITLES: Record<string, { en: string; km: string }> = {
  // ── Root Route ──────────────────────────────────────────
  "/": { en: BRAND, km: BRAND },

  // ── Auth Routes ─────────────────────────────────────────
  "/login": { en: "Sign In", km: "ចូលប្រើ" },
  "/login/phone-number": { en: "Phone Sign In", km: "ចូលតាមទូរស័ព្ទ" },
  "/login/phone-number/phone-otp": { en: "Verify OTP", km: "ផ្ទៀងផ្ទាត់ OTP" },
  "/signup": { en: "Sign Up", km: "ចុះឈ្មោះ" },
  "/signup/option": { en: "Choose Account Type", km: "ជ្រើសប្រភេទគណនី" },
  "/signup/employee": { en: "Employee Sign Up", km: "ចុះឈ្មោះជានិយោជិត" },
  "/signup/company": { en: "Company Sign Up", km: "ចុះឈ្មោះជាក្រុមហ៊ុន" },
  "/forgot-password": { en: "Forgot Password", km: "ភ្លេចពាក្យសម្ងាត់" },
  "/reset-password": { en: "Reset Password", km: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ" },

  // ── Main App Routes ────────────────────────────────────────
  "/dashboard": { en: "Dashboard", km: "ផ្ទាំងគ្រប់គ្រង" },
  "/feed": { en: "Feed", km: "ព័ត៌មានថ្មី" },
  "/search/employee": { en: "Find Talent", km: "ស្វែងរក" },
  "/search/company": { en: "Find Companies", km: "ស្វែងរក" },
  "/profile/employee": { en: "My Profile", km: "ទំព័ររបស់ខ្ញុំ" },
  "/profile/company": { en: "Company Profile", km: "ប្រវត្តិរូបក្រុមហ៊ុន" },
  "/favorite": { en: "Favorite", km: "រក្សាទុក" },
  "/matching": { en: "Matching", km: "ការផ្គូផ្គង" },
  "/notification": { en: "Notifications", km: "ការជូនដំណឹង" },
  "/message": { en: "Messages", km: "សារ" },
  "/setting": { en: "Settings", km: "ការកំណត់" },
  "/resume-builder": { en: "Resume Builder", km: "បង្កើត CV ដោយ AI" },
  "/resume-builder/edit": { en: "Edit Resume", km: "កែ CV" },

  // ── Legal Routes ──────────────────────────────────────────
  "/privacy": { en: "Privacy Policy", km: "គោលការណ៍ភាពឯកជន" },
  "/terms": { en: "Terms of Service", km: "លក្ខខណ្ឌនៃការប្រើប្រាស់" },
};

// ── PrefixBbased Matches For Dynamic Routes ───────────────────
const PREFIX_TITLES: Array<{ prefix: string; en: string; km: string }> = [
  {
    prefix: "/feed/employee/",
    en: "Talent Profile",
    km: "ប្រវត្តិរូបអ្នកមានទេព្យោ",
  },
  {
    prefix: "/feed/company/",
    en: "Company Profile",
    km: "ប្រវត្តិរូបក្រុមហ៊ុន",
  },
  {
    prefix: "/login/email-verification/",
    en: "Verify Email",
    km: "ផ្ទៀងផ្ទាត់អ៊ីមែល",
  },
];

// ── Resolve Title ──────────────────────────────────────────
function resolveTitle(pathname: string, lang: "en" | "km"): string {
  const exact = TITLES[pathname];
  if (exact) return exact[lang];

  const prefix = PREFIX_TITLES.find((p) => pathname.startsWith(p.prefix));
  if (prefix) return prefix[lang];

  return BRAND;
}

export function TitleSync() {
  /* ----------------------------- API Integration ---------------------------- */
  const { language } = useLanguageStore();
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const lang = (language ?? "en") as "en" | "km";
    const pageTitle = resolveTitle(pathname, lang);
    document.title = pageTitle === BRAND ? BRAND : `${pageTitle} — ${BRAND}`;
  }, [language, pathname]);

  /* -------------------------------- Render UI -------------------------------- */
  return null;
}
