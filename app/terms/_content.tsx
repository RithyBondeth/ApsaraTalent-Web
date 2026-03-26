"use client";

import Link from "next/link";
import {
  LucideAlertTriangle,
  LucideArrowLeft,
  LucideCalendar,
  LucideFileText,
  LucideGavel,
  LucideLock,
  LucideMail,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideUser,
  LucideUserCheck,
  LucideUsers,
  LucideX,
} from "lucide-react";
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
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed">
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
   Bilingual content
───────────────────────────────────────────────────────────── */
const content = {
  en: {
    back: "Back",
    pageTitle: "Terms of Service",
    lastUpdated: "Last updated: March 24, 2026",
    tocHeading: "Contents",
    intro:
      "These Terms of Service govern your access to and use of Apsara Talent — a talent-matching platform connecting skilled professionals with companies across Cambodia. By creating an account or using any part of the platform, you agree to these terms.",
    callout:
      "Please read these terms carefully before using Apsara Talent. If you do not agree, you may not access or use the platform.",

    toc: [
      { id: "acceptance", label: "Acceptance of Terms" },
      { id: "eligibility", label: "Eligibility" },
      { id: "account-types", label: "Account Types" },
      { id: "registration", label: "Account Registration" },
      { id: "acceptable-use", label: "Acceptable Use" },
      { id: "prohibited", label: "Prohibited Conduct" },
      { id: "content", label: "User Content" },
      { id: "ai-features", label: "AI Features" },
      { id: "ip", label: "Intellectual Property" },
      { id: "privacy", label: "Privacy" },
      { id: "disclaimers", label: "Disclaimers" },
      { id: "liability", label: "Limitation of Liability" },
      { id: "termination", label: "Termination" },
      { id: "governing-law", label: "Governing Law" },
      { id: "changes", label: "Changes to Terms" },
      { id: "contact", label: "Contact Us" },
    ],

    s1: {
      title: "Acceptance of Terms",
      p1: 'By registering for an account, clicking "I agree," or otherwise accessing or using Apsara Talent, you confirm that you have read, understood, and agreed to be bound by these Terms of Service and our',
      privacyLink: "Privacy Policy",
      p1suffix: ", which is incorporated herein by reference.",
      p2: "If you are accepting these terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these terms.",
    },

    s2: {
      title: "Eligibility",
      intro: "To use Apsara Talent, you must:",
      bullets: [
        "Be at least 18 years of age.",
        "Have the legal capacity to enter into a binding contract.",
        "Not be prohibited from using the platform under applicable law.",
        "Not have had a previous account terminated by Apsara Talent for violations of these terms.",
      ],
      note: "By using the platform, you represent and warrant that all of the above conditions are met.",
    },

    s3: {
      title: "Account Types",
      intro: "Apsara Talent offers two distinct account types:",
      type1Title: "👤 Employee / Freelancer Account",
      type1:
        "For individuals seeking employment, freelance work, or internship opportunities. You will create a professional profile showcasing your skills, experience, education, and availability. Your profile is visible to registered Company accounts for the purpose of talent discovery.",
      type2Title: "🏢 Company / Employer Account",
      type2:
        "For businesses and organisations seeking to hire or engage talent. You will create a company profile including your industry, open positions, company values, and benefits. Your profile is visible to registered Employee accounts for the purpose of talent discovery.",
      note: "Each user may maintain only one account per account type. Creating multiple accounts to circumvent restrictions is prohibited.",
    },

    s4: {
      title: "Account Registration",
      intro: "When registering an account you agree to:",
      bullets: [
        "Provide accurate, current, and complete information about yourself or your company.",
        "Maintain and promptly update your information to keep it accurate.",
        "Keep your password confidential and not share it with any third party.",
        "Notify us immediately if you suspect unauthorised access to your account.",
        "Accept responsibility for all activities that occur under your account.",
      ],
      note: "You may register using an email address and password, or via social login through Google, Facebook, LinkedIn, or GitHub. By using social login, you also agree to the terms of those respective providers.",
    },

    s5: {
      title: "Acceptable Use",
      intro:
        "You agree to use Apsara Talent only for its intended purpose of professional talent matching and for lawful purposes consistent with these terms. Specifically, you agree to:",
      bullets: [
        "Keep your profile information truthful, accurate, and professional.",
        "Use the messaging feature only to communicate in good faith about legitimate employment or hiring opportunities.",
        "Respect other users' privacy and treat all parties with professionalism.",
        "Comply with all applicable Cambodian laws and regulations.",
      ],
    },

    s6: {
      title: "Prohibited Conduct",
      intro: "The following conduct is strictly prohibited on Apsara Talent:",
      bullets: [
        "Impersonating another person, company, or entity.",
        "Posting false, misleading, or fraudulent job listings or candidate profiles.",
        "Harassment, discrimination, or abusive behaviour toward other users via the messaging system or any other feature.",
        "Sending unsolicited commercial messages (spam) through the platform.",
        "Scraping, crawling, or harvesting user data from the platform using automated tools.",
        "Attempting to reverse-engineer, decompile, or compromise the security of the platform.",
        "Using the platform to distribute malware, phishing content, or any other malicious material.",
        "Circumventing or attempting to circumvent any access controls or security features.",
        "Creating accounts for the purpose of manipulating search rankings or the matching algorithm.",
      ],
      note: "Violations may result in immediate account suspension or permanent termination, and may be reported to relevant authorities.",
    },

    s7: {
      title: "User Content",
      p1: "You retain ownership of all content you submit to Apsara Talent, including your profile information, photos, resume, cover letter, and messages.",
      p2: "By submitting content, you grant Apsara Talent a worldwide, non-exclusive, royalty-free licence to store, display, and process your content solely for the purpose of operating and improving the platform. We do not claim ownership of your content.",
      p3: "You are solely responsible for the content you submit and represent that:",
      bullets: [
        "You own the content or have the right to share it.",
        "The content does not infringe any third party's intellectual property, privacy, or other rights.",
        "The content is accurate and not misleading.",
      ],
    },

    s8: {
      title: "AI Features (Resume Builder)",
      intro:
        "Apsara Talent provides an AI-powered Resume Builder feature designed to assist you in drafting and formatting your professional resume.",
      bullets: [
        "AI-generated content is provided as a starting point and may contain errors, inaccuracies, or outdated information. You are responsible for reviewing and verifying all AI-generated content before using it.",
        "Do not rely solely on AI-generated content for important decisions. Always review the output critically.",
        "By using the AI Resume Builder, your profile data is processed by our AI systems to generate suggestions.",
        "Apsara Talent does not guarantee any specific outcomes (e.g. job offers) resulting from use of the Resume Builder.",
      ],
    },

    s9: {
      title: "Intellectual Property",
      p1: "All elements of the Apsara Talent platform — including the brand name, logo, software, design, code, and proprietary algorithms — are the intellectual property of Apsara Talent and are protected by applicable intellectual property laws.",
      p2: "You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the platform for its intended purpose. You may not copy, modify, distribute, sell, or create derivative works from any part of the platform without our prior written consent.",
    },

    s10: {
      title: "Privacy",
      p1: "Your use of Apsara Talent is also governed by our",
      privacyLink: "Privacy Policy",
      p1suffix:
        ", which is incorporated into these Terms of Service by reference. By using the platform, you consent to the collection and use of your information as described in the Privacy Policy.",
    },

    s11: {
      title: "Disclaimers",
      p1intro:
        "Apsara Talent is a platform that facilitates connections between job seekers and employers. We are not a recruitment agency, staffing firm, or employer. We do not make or participate in hiring decisions.",
      p1strong: "platform",
      bullets: [
        "We do not guarantee that any job seeker will find employment, or that any company will find suitable candidates through the platform.",
        "We do not verify the accuracy of user-provided information, including job titles, skills, or company details. Users are encouraged to conduct their own due diligence.",
        'The platform is provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement.',
        "We do not guarantee uninterrupted, error-free service and reserve the right to perform maintenance that may temporarily affect availability.",
      ],
    },

    s12: {
      title: "Limitation of Liability",
      intro:
        "To the maximum extent permitted by applicable law, Apsara Talent and its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, including but not limited to:",
      bullets: [
        "Loss of employment opportunities or business.",
        "Reliance on inaccurate information provided by other users.",
        "Unauthorised access to your account resulting from your failure to maintain password security.",
        "Any conduct or content of third parties on the platform.",
      ],
      note: "Our total aggregate liability to you for any claim shall not exceed the amount you paid us (if any) in the twelve months prior to the event giving rise to the claim.",
    },

    s13: {
      title: "Termination",
      byYou:
        "By you: You may delete your account at any time through your profile settings. Upon deletion, your data will be handled as described in our Privacy Policy.",
      byYouStrong: "By you:",
      byUs: "By us: We reserve the right to suspend or terminate your account at any time, with or without notice, for any of the following reasons:",
      byUsStrong: "By us:",
      bullets: [
        "Violation of these Terms of Service.",
        "Fraudulent, deceptive, or harmful behaviour.",
        "Inactivity for an extended period.",
        "Legal obligation or regulatory requirement.",
      ],
      note: "Upon termination, your right to access the platform immediately ceases. Provisions of these terms that by their nature should survive termination will remain in effect.",
    },

    s14: {
      title: "Governing Law",
      p1strong: "Kingdom of Cambodia",
      p1: ", without regard to conflict-of-law principles.",
      p1prefix:
        "These Terms of Service shall be governed by and construed in accordance with the laws of the",
      p2: "Any disputes arising from or relating to these terms or your use of Apsara Talent shall be subject to the exclusive jurisdiction of the competent courts of Phnom Penh, Cambodia. You waive any objection to the jurisdiction or venue of such courts.",
    },

    s15: {
      title: "Changes to Terms",
      p1: 'We may modify these Terms of Service at any time. We will provide notice of material changes by updating the "Last updated" date and, where appropriate, notifying registered users by email or in-app notification.',
      p2: "Your continued use of Apsara Talent after the effective date of any updated terms constitutes your acceptance of those changes. If you do not agree to the updated terms, you must stop using the platform and delete your account.",
    },

    s16: {
      title: "Contact Us",
      intro:
        "If you have questions or concerns about these Terms of Service, please contact us:",
      address: "Phnom Penh, Cambodia",
    },
  },

  km: {
    back: "ត្រឡប់",
    pageTitle: "លក្ខខណ្ឌនៃការប្រើប្រាស់",
    lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: ២៤ មីនា ២០២៦",
    tocHeading: "មាតិកា",
    intro:
      "លក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះគ្រប់គ្រងការចូលប្រើ និងការប្រើប្រាស់ Apsara Talent — វេទិកាផ្គូផ្គងទេព្យោសម្បទាដែលភ្ជាប់អ្នកជំនាញជំនាញជាមួយក្រុមហ៊ុននៅទូទាំងប្រទេសកម្ពុជា។ តាមរយៈការបង្កើតគណនី ឬការប្រើប្រាស់ផ្នែកណាមួយនៃវេទិកា អ្នកយល់ព្រមនឹងលក្ខខណ្ឌទាំងនេះ។",
    callout:
      "សូមអានលក្ខខណ្ឌទាំងនេះដោយប្រុងប្រយ័ត្នមុនប្រើ Apsara Talent។ ប្រសិនបើអ្នកមិនយល់ព្រម អ្នកមិនអាចចូលប្រើ ឬប្រើប្រាស់វេទិកាឡើយ។",

    toc: [
      { id: "acceptance", label: "ការទទួលស្គាល់លក្ខខណ្ឌ" },
      { id: "eligibility", label: "លក្ខណៈសម្បត្តិ" },
      { id: "account-types", label: "ប្រភេទគណនី" },
      { id: "registration", label: "ការចុះឈ្មោះគណនី" },
      { id: "acceptable-use", label: "ការប្រើប្រាស់ត្រឹមត្រូវ" },
      { id: "prohibited", label: "អាកប្បកិរិយាហាមឃាត់" },
      { id: "content", label: "មាតិការបស់អ្នកប្រើ" },
      { id: "ai-features", label: "មុខងារ AI" },
      { id: "ip", label: "កម្មសិទ្ធិបញ្ញា" },
      { id: "privacy", label: "ភាពឯកជន" },
      { id: "disclaimers", label: "ការបដិសេធ" },
      { id: "liability", label: "ការកំណត់ការទទួលខុសត្រូវ" },
      { id: "termination", label: "ការបញ្ចប់" },
      { id: "governing-law", label: "ច្បាប់គ្រប់គ្រង" },
      { id: "changes", label: "ការផ្លាស់ប្តូរលក្ខខណ្ឌ" },
      { id: "contact", label: "ទំនាក់ទំនងពួកយើង" },
    ],

    s1: {
      title: "ការទទួលស្គាល់លក្ខខណ្ឌ",
      p1: 'តាមរយៈការចុះឈ្មោះគណនី ចុច "ខ្ញុំយល់ព្រម" ឬការចូលប្រើ ឬប្រើប្រាស់ Apsara Talent តាមរបៀបផ្សេង អ្នកបញ្ជាក់ថាអ្នកបានអាន យល់ និងយល់ព្រមជាប់ចំណងដោយលក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះ និង',
      privacyLink: "គោលការណ៍ភាពឯកជន",
      p1suffix: "របស់យើង ដែលត្រូវបានបញ្ចូលនៅទីនេះជាឯកសារយោង",
      p2: "ប្រសិនបើអ្នកទទួលស្គាល់លក្ខខណ្ឌទាំងនេះក្នុងនាមក្រុមហ៊ុន ឬអង្គភាពផ្លូវច្បាប់ផ្សេង អ្នកតំណាងថាអ្នកមានសិទ្ធិអំណាចក្នុងការចាប់ចំណងអង្គភាពនោះដោយលក្ខខណ្ឌទាំងនេះ",
    },

    s2: {
      title: "លក្ខណៈសម្បត្តិ",
      intro: "ដើម្បីប្រើ Apsara Talent អ្នកត្រូវ:",
      bullets: [
        "មានអាយុយ៉ាងហោចណាស់ ១៨ ឆ្នាំ",
        "មានសមត្ថភាពផ្លូវច្បាប់ក្នុងការចូលទៅក្នុងកិច្ចសន្យាដែលជាប់ចំណង",
        "មិនត្រូវបានហាមឃាត់ពីការប្រើប្រាស់វេទិកាក្រោមច្បាប់ដែលអនុវត្ត",
        "មិនធ្លាប់ត្រូវបានបញ្ចប់គណនីពីមុនដោយ Apsara Talent ដោយសារការរំលោភលក្ខខណ្ឌទាំងនេះ",
      ],
      note: "តាមរយៈការប្រើប្រាស់វេទិកា អ្នកតំណាង និងធានាថាលក្ខខណ្ឌទាំងអស់ខាងលើបានបំពេញ",
    },

    s3: {
      title: "ប្រភេទគណនី",
      intro: "Apsara Talent ផ្តល់ប្រភេទគណនីពីរប្រភេទ:",
      type1Title: "👤 គណនីនិយោជិត / Freelancer",
      type1:
        "សម្រាប់បុគ្គលដែលស្វែងរកការងារ ការងារ Freelance ឬឱកាសហាត់ការ។ អ្នកនឹងបង្កើតប្រវត្តិរូបវិជ្ជាជីវៈដែលបង្ហាញជំនាញ បទពិសោធ ការសិក្សា និងភាពទំនេររបស់អ្នក។ ប្រវត្តិរូបរបស់អ្នកអាចមើលឃើញដោយគណនីក្រុមហ៊ុនដែលបានចុះឈ្មោះ ដើម្បីស្វែងរកទេព្យោសម្បទា",
      type2Title: "🏢 គណនីក្រុមហ៊ុន / និយោជក",
      type2:
        "សម្រាប់អាជីវកម្ម និងអង្គភាពដែលស្វែងរកជ្រើសរើស ឬចូលរួមជាមួយទេព្យោសម្បទា។ អ្នកនឹងបង្កើតប្រវត្តិរូបក្រុមហ៊ុន រួមមានឧស្សាហកម្ម មុខតំណែងការងារ តម្លៃ និងអត្ថប្រយោជន៍ក្រុមហ៊ុន។ ប្រវត្តិរូបរបស់អ្នកអាចមើលឃើញដោយគណនីនិយោជិតដែលបានចុះឈ្មោះ ដើម្បីស្វែងរកទេព្យោសម្បទា",
      note: "អ្នកប្រើប្រាស់នីមួយៗអាចរក្សាគណនីតែមួយប្រភេទប៉ុណ្ណោះ។ ការបង្កើតគណនីច្រើនដើម្បីរំលងការដាក់កំហិតត្រូវបានហាមឃាត់",
    },

    s4: {
      title: "ការចុះឈ្មោះគណនី",
      intro: "នៅពេលចុះឈ្មោះគណនី អ្នកយល់ព្រម:",
      bullets: [
        "ផ្តល់ព័ត៌មានដែលត្រឹមត្រូវ បច្ចុប្បន្ន និងពេញលេញអំពីខ្លួនអ្នក ឬក្រុមហ៊ុនរបស់អ្នក",
        "រក្សា និងធ្វើបច្ចុប្បន្នភាពព័ត៌មានរបស់អ្នកភ្លាមៗ ដើម្បីរក្សាឱ្យវាត្រឹមត្រូវ",
        "រក្សាជាសម្ងាត់ពាក្យសម្ងាត់ហើយមិនចែករំលែកជាមួយភាគីទីបីណាមួយ",
        "ជូនដំណឹងពួកយើងភ្លាមៗ ប្រសិនបើអ្នកសង្ស័យការចូលប្រើដោយគ្មានការអនុញ្ញាតចំពោះគណនីរបស់អ្នក",
        "ទទួលខុសត្រូវចំពោះសកម្មភាពទាំងអស់ដែលកើតឡើងក្រោមគណនីរបស់អ្នក",
      ],
      note: "អ្នកអាចចុះឈ្មោះដោយប្រើអ៊ីមែល និងពាក្យសម្ងាត់ ឬតាម Social Login ដែលភ្ជាប់ Google, Facebook, LinkedIn ឬ GitHub។ តាមរយៈការប្រើ Social Login អ្នកក៏យល់ព្រមនឹងលក្ខខណ្ឌរបស់អ្នកផ្តល់ទាំងនោះផងដែរ",
    },

    s5: {
      title: "ការប្រើប្រាស់ត្រឹមត្រូវ",
      intro:
        "អ្នកយល់ព្រមប្រើ Apsara Talent តែសម្រាប់គោលបំណងផ្គូផ្គងទេព្យោសម្បទាវិជ្ជាជីវៈ និងគោលបំណងស្របច្បាប់ស្របនឹងលក្ខខណ្ឌទាំងនេះ។ ជាពិសេស អ្នកយល់ព្រម:",
      bullets: [
        "រក្សាព័ត៌មានប្រវត្តិរូបរបស់អ្នកឱ្យពិតប្រាកដ ត្រឹមត្រូវ និងជាវិជ្ជាជីវៈ",
        "ប្រើមុខងារផ្ញើសារតែដើម្បីទំនាក់ទំនងដោយស្មោះត្រង់អំពីឱកាសការងារ ឬការជ្រើសរើសសម្ភារៈស្របច្បាប់",
        "គោរពភាពឯកជនរបស់អ្នកប្រើប្រាស់ផ្សេង ហើយចាត់ទុកគ្រប់ភាគីជាវិជ្ជាជីវៈ",
        "អនុលោមតាមច្បាប់ និងបទប្បញ្ញត្តិកម្ពុជាដែលអនុវត្ត",
      ],
    },

    s6: {
      title: "អាកប្បកិរិយាហាមឃាត់",
      intro:
        "អាកប្បកិរិយាខាងក្រោមត្រូវបានហាមឃាត់យ៉ាងតឹងរ៉ឹងនៅ Apsara Talent:",
      bullets: [
        "ក្លែងបន្លំជាបុគ្គល ក្រុមហ៊ុន ឬអង្គភាពផ្សេង",
        "ចុះផ្សាយការផ្សាយការងារ ឬប្រវត្តិរូបបេក្ខជនក្លែងបន្លំ បញ្ចោតបំភ្លៃ ឬក្លែងក្លាយ",
        "ការបៀតបៀន ការរើសអើង ឬអាកប្បកិរិយាបំពានចំពោះអ្នកប្រើប្រាស់ផ្សេងតាមប្រព័ន្ធផ្ញើសារ ឬមុខងារផ្សេង",
        "ការផ្ញើសារពាណិជ្ជកម្មដែលមិនបានស្នើសុំ (Spam) តាមរយៈវេទិកា",
        "ការ Scrape, Crawl ឬប្រមូលទិន្នន័យអ្នកប្រើប្រាស់ពីវេទិកាដោយប្រើឧបករណ៍ស្វ័យប្រវត្ដ",
        "ការព្យាយាម Reverse-Engineer, Decompile ឬប្រកួតប្រជែងទៅនឹងសុវត្ថិភាពវេទិកា",
        "ការប្រើប្រាស់វេទិកាដើម្បីចែកចាយ Malware, Phishing ឬសម្ភារៈព្យាបាទ",
        "ការរំលង ឬព្យាយាមរំលងការគ្រប់គ្រងការចូលប្រើ ឬមុខងារសុវត្ថិភាព",
        "ការបង្កើតគណនីដើម្បី操纵 ចំណាត់ថ្នាក់ការស្វែងរក ឬក្បួន Matching",
      ],
      note: "ការរំលោភអាចនាំឱ្យផ្អាក ឬបញ្ចប់គណនីភ្លាមៗ ហើយអាចត្រូវបានរាយការណ៍ទៅអាជ្ញាធរពាក់ព័ន្ធ",
    },

    s7: {
      title: "មាតិការបស់អ្នកប្រើ",
      p1: "អ្នករក្សាម្ចាស់កម្មសិទ្ធិលើមាតិកាទាំងអស់ដែលអ្នកដាក់ជូន Apsara Talent រួមមានព័ត៌មានប្រវត្តិរូប រូបភាព Resume, Cover Letter និងសារ",
      p2: "តាមរយៈការដាក់ជូនមាតិកា អ្នកផ្តល់ Apsara Talent នូវអាជ្ញាបណ្ណទូទាំងពិភពលោក មិនផ្តាច់មុខ មិនគិតថ្លៃ ដើម្បីរក្សាទុក បង្ហាញ និងដំណើរការមាតិការបស់អ្នក តែសម្រាប់គោលបំណងដំណើរការ និងធ្វើឱ្យប្រសើរវេទិកា។ យើងមិនទាមទារម្ចាស់កម្មសិទ្ធិលើមាតិការបស់អ្នកឡើយ",
      p3: "អ្នកទទួលខុសត្រូវតែម្នាក់ចំពោះមាតិកាដែលអ្នកដាក់ជូន ហើយតំណាងថា:",
      bullets: [
        "អ្នកជាម្ចាស់មាតិកា ឬមានសិទ្ធិក្នុងការចែករំលែកវា",
        "មាតិកាមិនរំលោភកម្មសិទ្ធិបញ្ញា ភាពឯកជន ឬសិទ្ធិផ្សេងៗរបស់ភាគីទីបីឡើយ",
        "មាតិកាមានភាពត្រឹមត្រូវ និងមិនបញ្ចោតបំភ្លៃ",
      ],
    },

    s8: {
      title: "មុខងារ AI (Resume Builder)",
      intro:
        "Apsara Talent ផ្តល់មុខងារ AI Resume Builder ដែលរចនាឡើងដើម្បីជួយអ្នកក្នុងការបង្ហាញ និងធ្វើទ្រង់ទ្រាយ Resume វិជ្ជាជីវៈរបស់អ្នក",
      bullets: [
        "មាតិកាដែលបង្កើតដោយ AI ត្រូវបានផ្តល់ជាចំណុចចាប់ផ្ដើម ហើយអាចមានកំហុស ភាពមិនត្រឹមត្រូវ ឬព័ត៌មានហួសសម័យ។ អ្នកទទួលខុសត្រូវក្នុងការពិនិត្យ និងផ្ទៀងផ្ទាត់មាតិកាដែល AI បង្កើតទាំងអស់មុនប្រើ",
        "កុំពឹងផ្អែកតែលើមាតិកា AI សម្រាប់ការសម្រេចចិត្តសំខាន់ៗ។ តែងតែពិនិត្យ Output ជាមួយការទស្សនៈរិះគន់",
        "តាមរយៈការប្រើ AI Resume Builder ទិន្នន័យប្រវត្តិរូបរបស់អ្នកត្រូវបានដំណើរការដោយប្រព័ន្ធ AI របស់យើង ដើម្បីបង្កើតការណែនាំ",
        "Apsara Talent មិនធានាលទ្ធផលជាក់លាក់ណាមួយ (ឧ. ការផ្តល់ការងារ) ដែលបណ្តាលពីការប្រើ Resume Builder",
      ],
    },

    s9: {
      title: "កម្មសិទ្ធិបញ្ញា",
      p1: "ធាតុទាំងអស់នៃវេទិកា Apsara Talent — រួមមានឈ្មោះម៉ាក ស្លាក Software ការរចនា Code និងក្បួន Proprietary — ជាកម្មសិទ្ធិបញ្ញារបស់ Apsara Talent ហើយត្រូវបានការពារដោយច្បាប់កម្មសិទ្ធិបញ្ញាដែលអនុវត្ត",
      p2: "អ្នកត្រូវបានផ្តល់អាជ្ញាបណ្ណមានកំណត់ មិនផ្តាច់មុខ មិនអាចផ្ទេរ អាចដករំលង ដើម្បីចូលប្រើ និងប្រើប្រាស់វេទិកាសម្រាប់គោលបំណងដែលបានកំណត់។ អ្នកមិនអាចចម្លង កែប្រែ ចែកចាយ លក់ ឬបង្កើតស្នាដៃដឺរីវ៉ាទីវ ពីផ្នែកណាមួយនៃវេទិកាដោយគ្មានការយល់ព្រមជាលាយលក្ខណ៍អក្សររបស់យើង",
    },

    s10: {
      title: "ភាពឯកជន",
      p1: "ការប្រើប្រាស់ Apsara Talent របស់អ្នកក៏ត្រូវបានគ្រប់គ្រងដោយ",
      privacyLink: "គោលការណ៍ភាពឯកជន",
      p1suffix:
        "របស់យើង ដែលត្រូវបានបញ្ចូលក្នុងលក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះជាឯកសារយោង។ តាមរយៈការប្រើប្រាស់វេទិកា អ្នកយល់ព្រមនឹងការប្រមូល និងការប្រើប្រាស់ព័ត៌មានរបស់អ្នកដូចបានពិពណ៌នានៅក្នុងគោលការណ៍ភាពឯកជន",
    },

    s11: {
      title: "ការបដិសេធ",
      p1intro:
        "Apsara Talent ជាវេទិកាដែលជួយសម្រួលការតភ្ជាប់រវាងអ្នកស្វែងរកការងារ និងនិយោជក។ យើងមិនមែនជាភ្នាក់ងារជ្រើសរើស ក្រុមហ៊ុន Staffing ឬនិយោជកឡើយ។ យើងមិនធ្វើ ឬចូលរួមក្នុងការសម្រេចចិត្តជ្រើសរើស",
      p1strong: "វេទិកា",
      bullets: [
        "យើងមិនធានាថាអ្នកស្វែងរកការងារណាម្នាក់នឹងរកបានការងារ ឬក្រុមហ៊ុនណាមួយនឹងរកបានបេក្ខជនដែលសមស្របតាមរយៈវេទិកា",
        "យើងមិនផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវនៃព័ត៌មានដែលអ្នកប្រើប្រាស់ផ្តល់ រួមមានចំណងជើងការងារ ជំនាញ ឬព័ត៌មានក្រុមហ៊ុន។ អ្នកប្រើប្រាស់ត្រូវបានលើកទឹកចិត្តឱ្យធ្វើការ Due Diligence ផ្ទាល់ខ្លួន",
        'វេទិកាត្រូវបានផ្តល់ "ដូចដែលវា" និង "ដូចដែលមាន" ដោយគ្មានការធានាណាមួយ ដោយពង្រាយ ឬស្ម័គ្រចិត្ត',
        "យើងមិនធានាការ Service ដែលមិនមានការរំខាន ឬគ្មានកំហុស ហើយរក្សាសិទ្ធិក្នុងការធ្វើ Maintenance ដែលអាចប៉ះពាល់ភ្លោះពេលខ្លះ",
      ],
    },

    s12: {
      title: "ការកំណត់ការទទួលខុសត្រូវ",
      intro:
        "ក្នុងវិសាលភាពអតិបរមាដែលបានអនុញ្ញាតដោយច្បាប់ Apsara Talent និងមន្ត្រី បុគ្គលិក និងសម្ព័ន្ធរបស់ខ្លួន នឹងមិនទទួលខុសត្រូវចំពោះការខូចខាតដោយប្រយោល ចៃដន្យ ពិសេស ជាបន្ត ឬជំនាត់ ដែលបណ្តាលពីការប្រើប្រាស់ ឬអសមត្ថភាពក្នុងការប្រើប្រាស់វេទិកា រួមមានប៉ុន្តែមិនកំណត់ចំពោះ:",
      bullets: [
        "ការបាត់បង់ឱកាសការងារ ឬអាជីវកម្ម",
        "ការពឹងផ្អែកលើព័ត៌មានមិនត្រឹមត្រូវដែលផ្តល់ដោយអ្នកប្រើប្រាស់ផ្សេង",
        "ការចូលប្រើដោយគ្មានការអនុញ្ញាតចំពោះគណនីរបស់អ្នក ដែលបណ្តាលពីការខកខានរក្សាសុវត្ថិភាពពាក្យសម្ងាត់",
        "អាកប្បកិរិយា ឬមាតិកាណាមួយរបស់ភាគីទីបីនៅលើវេទិកា",
      ],
      note: "ការទទួលខុសត្រូវសរុបរបស់យើងចំពោះការទាមទារណាមួយ នឹងមិនលើសពីចំនួនដែលអ្នកបានបង់យើង (ប្រសិនបើមាន) ក្នុងអំឡុង ១២ ខែមុនព្រឹត្តិការណ៍ដែលបង្ករការទាមទារ",
    },

    s13: {
      title: "ការបញ្ចប់",
      byYou:
        "ដោយអ្នក: អ្នកអាចលុបគណនីរបស់អ្នកនៅពេលណាក៏បាន តាមរយៈការកំណត់ប្រវត្តិរូបរបស់អ្នក។ បន្ទាប់ពីការលុប ទិន្នន័យរបស់អ្នកនឹងត្រូវបានដោះស្រាយដូចបានពិពណ៌នានៅក្នុងគោលការណ៍ភាពឯកជន",
      byYouStrong: "ដោយអ្នក:",
      byUs: "ដោយយើង: យើងរក្សាសិទ្ធិក្នុងការផ្អាក ឬបញ្ចប់គណនីរបស់អ្នកនៅពេលណាក៏បាន ជាមួយ ឬគ្មានការជូនដំណឹង ដោយសារហេតុផលណាមួយខាងក្រោម:",
      byUsStrong: "ដោយយើង:",
      bullets: [
        "ការរំលោភលក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះ",
        "អាកប្បកិរិយាក្លែងបន្លំ បំភ្លៃ ឬបង្ករគ្រោះថ្នាក់",
        "ភាពដល់ជើងម្ខាងយូរ",
        "កាតព្វកិច្ចផ្លូវច្បាប់ ឬតម្រូវការបទប្បញ្ញត្តិ",
      ],
      note: "នៅពេលបញ្ចប់ សិទ្ធិរបស់អ្នកក្នុងការចូលប្រើវេទិកាបញ្ចប់ភ្លាមៗ។ បទប្បញ្ញត្តិនៃលក្ខខណ្ឌទាំងនេះ ដែលតាមធម្មជាតិគួរតែរស់រានក្រោយការបញ្ចប់ នឹងនៅតែมีeffect",
    },

    s14: {
      title: "ច្បាប់គ្រប់គ្រង",
      p1strong: "ព្រះរាជាណាចក្រកម្ពុជា",
      p1: "ដោយគ្មានការពិចារណាចំពោះគោលការណ៍ជម្លោះច្បាប់",
      p1prefix:
        "លក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះត្រូវបានគ្រប់គ្រង និងបកស្រាយស្របតាមច្បាប់នៃ",
      p2: "វិវាទណាមួយដែលបណ្តាល ឬទាក់ទងនឹងលក្ខខណ្ឌទាំងនេះ ឬការប្រើប្រាស់ Apsara Talent របស់អ្នក នឹងស្ថិតក្រោម Jurisdiction ផ្តាច់មុខនៃតុលាការដែលមានសមត្ថកិច្ចនៃភ្នំពេញ ប្រទេសកម្ពុជា។ អ្នកលះបង់ការជំទាស់ណាមួយចំពោះ Jurisdiction ឬទីកន្លែងនៃតុលាការបែបនេះ",
    },

    s15: {
      title: "ការផ្លាស់ប្តូរលក្ខខណ្ឌ",
      p1: 'យើងអាចកែប្រែលក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះនៅពេលណាក៏បាន។ យើងនឹងផ្តល់ការជូនដំណឹងអំពីការផ្លាស់ប្តូរសំខាន់ដោយធ្វើបច្ចុប្បន្នភាពកាលបរិច្ឆេទ "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ" ហើយទីកន្លែងដែលសមស្រប ជូនដំណឹងដល់អ្នកប្រើប្រាស់ដែលបានចុះឈ្មោះតាមអ៊ីមែល ឬការជូនដំណឹងក្នុងកម្មវិធី',
      p2: "ការប្រើប្រាស់ Apsara Talent ជានិច្ចរបស់អ្នកក្រោយពេលមានប្រសិទ្ធភាពនៃលក្ខខណ្ឌដែលបានធ្វើបច្ចុប្បន្នភាព ស្មើនឹងការទទួលស្គាល់ការផ្លាស់ប្តូររបស់អ្នក។ ប្រសិនបើអ្នកមិនយល់ព្រមនឹងលក្ខខណ្ឌដែលបានធ្វើបច្ចុប្បន្នភាព អ្នកត្រូវឈប់ប្រើប្រាស់វេទិកា ហើយលុបគណនីរបស់អ្នក",
    },

    s16: {
      title: "ទំនាក់ទំនងពួកយើង",
      intro:
        "ប្រសិនបើអ្នកមានសំណួរ ឬការព្រួយបារម្ភអំពីលក្ខខណ្ឌនៃការប្រើប្រាស់ទាំងនេះ សូមទំនាក់ទំនងពួកយើង:",
      address: "ភ្នំពេញ, កម្ពុជា",
    },
  },
};

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export function TermsContent() {
  const { language, setLanguage } = useLanguageStore();
  const c = content[language];

  return (
    <div className="min-h-screen bg-background animate-page-in">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/setting"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LucideArrowLeft className="size-4" />
            {c.back}
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold truncate">{c.pageTitle}</span>

          {/* Language toggle */}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                language === "en"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("km")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                language === "km"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ខ្មែរ
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:flex lg:gap-12">
        {/* ── Sticky TOC sidebar (desktop) ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {c.tocHeading}
            </p>
            {c.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary/50 pl-3"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col gap-10 min-w-0">
          {/* Hero header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LucideCalendar className="size-3.5" />
              <span>{c.lastUpdated}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{c.pageTitle}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              {c.intro}
            </p>

            {/* Callout */}
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-3">
              <LucideAlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {c.callout}
              </p>
            </div>
          </div>

          {/* ─── 1. Acceptance ─── */}
          <Section
            id="acceptance"
            icon={<LucideFileText />}
            title={c.s1.title}
          >
            <p>
              {c.s1.p1}{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                {c.s1.privacyLink}
              </Link>
              {c.s1.p1suffix}
            </p>
            <p>{c.s1.p2}</p>
          </Section>

          {/* ─── 2. Eligibility ─── */}
          <Section
            id="eligibility"
            icon={<LucideUserCheck />}
            title={c.s2.title}
          >
            <p>{c.s2.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s2.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
            <p>{c.s2.note}</p>
          </Section>

          {/* ─── 3. Account types ─── */}
          <Section
            id="account-types"
            icon={<LucideUsers />}
            title={c.s3.title}
          >
            <p>{c.s3.intro}</p>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-2">
                <p className="font-semibold text-foreground">{c.s3.type1Title}</p>
                <p>{c.s3.type1}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-2">
                <p className="font-semibold text-foreground">{c.s3.type2Title}</p>
                <p>{c.s3.type2}</p>
              </div>
            </div>
            <p>{c.s3.note}</p>
          </Section>

          {/* ─── 4. Registration ─── */}
          <Section id="registration" icon={<LucideUser />} title={c.s4.title}>
            <p>{c.s4.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s4.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
            <p>{c.s4.note}</p>
          </Section>

          {/* ─── 5. Acceptable use ─── */}
          <Section
            id="acceptable-use"
            icon={<LucideShieldCheck />}
            title={c.s5.title}
          >
            <p>{c.s5.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s5.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
          </Section>

          {/* ─── 6. Prohibited ─── */}
          <Section id="prohibited" icon={<LucideX />} title={c.s6.title}>
            <p>{c.s6.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s6.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
            <p>{c.s6.note}</p>
          </Section>

          {/* ─── 7. Content ─── */}
          <Section id="content" icon={<LucideFileText />} title={c.s7.title}>
            <p>{c.s7.p1}</p>
            <p>{c.s7.p2}</p>
            <p>{c.s7.p3}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s7.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
          </Section>

          {/* ─── 8. AI features ─── */}
          <Section
            id="ai-features"
            icon={<LucideShieldCheck />}
            title={c.s8.title}
          >
            <p>{c.s8.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s8.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
          </Section>

          {/* ─── 9. IP ─── */}
          <Section id="ip" icon={<LucideLock />} title={c.s9.title}>
            <p>{c.s9.p1}</p>
            <p>{c.s9.p2}</p>
          </Section>

          {/* ─── 10. Privacy ─── */}
          <Section id="privacy" icon={<LucideLock />} title={c.s10.title}>
            <p>
              {c.s10.p1}{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                {c.s10.privacyLink}
              </Link>
              {c.s10.p1suffix}
            </p>
          </Section>

          {/* ─── 11. Disclaimers ─── */}
          <Section
            id="disclaimers"
            icon={<LucideAlertTriangle />}
            title={c.s11.title}
          >
            <p>{c.s11.p1intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s11.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
          </Section>

          {/* ─── 12. Liability ─── */}
          <Section id="liability" icon={<LucideGavel />} title={c.s12.title}>
            <p>{c.s12.intro}</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s12.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
            <p>{c.s12.note}</p>
          </Section>

          {/* ─── 13. Termination ─── */}
          <Section id="termination" icon={<LucideX />} title={c.s13.title}>
            <p>
              <strong className="text-foreground">{c.s13.byYouStrong}</strong>{" "}
              {c.s13.byYou.replace(c.s13.byYouStrong, "").trim()}
            </p>
            <p>
              <strong className="text-foreground">{c.s13.byUsStrong}</strong>{" "}
              {c.s13.byUs.replace(c.s13.byUsStrong, "").trim()}
            </p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {c.s13.bullets.map((t, i) => (
                <Bullet key={i}>{t}</Bullet>
              ))}
            </ul>
            <p>{c.s13.note}</p>
          </Section>

          {/* ─── 14. Governing law ─── */}
          <Section
            id="governing-law"
            icon={<LucideGavel />}
            title={c.s14.title}
          >
            <p>
              {c.s14.p1prefix}{" "}
              <strong className="text-foreground">{c.s14.p1strong}</strong>
              {", "}
              {c.s14.p1}
            </p>
            <p>{c.s14.p2}</p>
          </Section>

          {/* ─── 15. Changes ─── */}
          <Section id="changes" icon={<LucideRefreshCw />} title={c.s15.title}>
            <p>{c.s15.p1}</p>
            <p>{c.s15.p2}</p>
          </Section>

          {/* ─── 16. Contact ─── */}
          <Section id="contact" icon={<LucideMail />} title={c.s16.title}>
            <p>{c.s16.intro}</p>
            <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-1.5">
              <p className="font-semibold text-foreground">Apsara Talent</p>
              <p>
                📧{" "}
                <a
                  href="mailto:legal@apsaratalent.com"
                  className="text-primary hover:underline"
                >
                  legal@apsaratalent.com
                </a>
              </p>
              <p>
                🌐{" "}
                <a
                  href="https://apsaratalent.com"
                  className="text-primary hover:underline"
                >
                  apsaratalent.com
                </a>
              </p>
              <p>📍 {c.s16.address}</p>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
