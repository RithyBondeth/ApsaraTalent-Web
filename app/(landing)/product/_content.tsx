"use client";

import {
  LucideSmartphone,
  LucideGlobe,
  LucideBrain,
  LucideSearch,
  LucideFileText,
  LucideMessageSquare,
  LucideUsers,
  LucideBriefcase,
  LucideDownload,
  LucideMonitor,
} from "lucide-react";
import { Bot as LucideSparkles } from "lucide-react";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  StaticBullet,
  StaticCard,
  StaticNote,
  StaticPageArtworkSlot,
  StaticPageShell,
  StaticSection,
} from "@/components/static-content/static-page";
import { useLanguageStore } from "@/stores/languages/language-store";

/* -------------------------- Content & Data -------------------------- */
const content = {
  en: {
    back: "Back",
    pageTitle: "Our Products",
    subtitle:
      "Apsara Talent gives you everything you need to connect talent with opportunity — on the web, on mobile, and powered by AI.",
    tocHeading: "Contents",
    toc: [
      { id: "mobile-app", label: "Mobile App" },
      { id: "web-platform", label: "Web Platform" },
      { id: "agentic-ai", label: "Apsara Agentic AI" },
      { id: "key-features", label: "Key Features" },
    ],
    mobileTitle: "Mobile App — iOS & Android",
    mobileIntro:
      "Take Apsara Talent with you everywhere. Our native mobile app is available on both the App Store and Google Play, giving you full access to the platform on the go.",
    mobileBullets: [
      "Browse and apply to jobs directly from your phone",
      "Receive instant push notifications for matches and messages",
      "Real-time messaging with employers and candidates",
      "Manage your profile, resume, and preferences on the go",
      "Quick swipe-based matching for effortless discovery",
      "Offline-ready profile viewing and saved jobs",
    ],
    mobileDownload:
      "Download for free on the App Store (iOS) and Google Play (Android).",
    webTitle: "Web Platform",
    webIntro:
      "The Apsara Talent web experience is built for power users — recruiters managing pipelines, professionals crafting resumes, and teams collaborating on hiring decisions.",
    webBullets: [
      "Full-featured dashboard with analytics and insights",
      "AI-powered resume builder with real-time suggestions",
      "Advanced search with filters for skills, location, and experience",
      "Comprehensive company profiles and job postings",
      "Interview scheduling and management tools",
      "Real-time messaging powered by Socket.io",
    ],
    aiTitle: "Apsara Agentic AI Assistant",
    aiIntro:
      "Meet your intelligent hiring companion. The Apsara Agentic AI Assistant goes beyond simple automation — it reasons, plans, and acts on your behalf to streamline every step of the talent lifecycle.",
    aiBullets: [
      "Smart candidate-job matching using deep skill analysis",
      "Automated resume screening and ranking",
      "Intelligent interview scheduling based on availability",
      "Personalized job recommendations tailored to your career goals",
      "AI-generated resume drafts and optimization suggestions",
      "Proactive alerts for high-compatibility matches",
      "Natural language Q&A about candidates, roles, and market trends",
    ],
    aiNote:
      "The Apsara Agentic AI is designed to augment human decision-making, not replace it. Every recommendation comes with clear reasoning so you stay in control.",
    featuresTitle: "Key Features Across All Products",
    features: [
      {
        title: "Smart Matching",
        description:
          "AI algorithms connect the right talent with the right opportunities based on skills, experience, and preferences.",
      },
      {
        title: "AI Resume Builder",
        description:
          "Create professional, ATS-friendly resumes with AI-powered suggestions and beautiful templates.",
      },
      {
        title: "Real-time Messaging",
        description:
          "Communicate instantly with candidates or employers through our integrated chat system.",
      },
      {
        title: "Company Profiles",
        description:
          "Showcase your company culture, open roles, and team to attract top Cambodian talent.",
      },
      {
        title: "Interview Management",
        description:
          "Schedule, track, and manage interviews seamlessly across mobile and web.",
      },
      {
        title: "Intelligent Insights",
        description:
          "Dashboards and analytics to help you understand hiring trends and optimize your strategy.",
      },
    ],
  },
  km: {
    back: "ត្រឡប់ក្រោយ",
    pageTitle: "ផលិតផលរបស់យើង",
    subtitle:
      "Apsara Talent ផ្តល់ឱ្យអ្នកនូវអ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីតភ្ជាប់ទេពកោសល្យជាមួយឱកាស — នៅលើគេហទំព័រ នៅលើទូរសព្ទ និងដំណើរការដោយ AI។",
    tocHeading: "មាតិកា",
    toc: [
      { id: "mobile-app", label: "កម្មវិធីទូរសព្ទ" },
      { id: "web-platform", label: "គេហទំព័រ" },
      { id: "agentic-ai", label: "Apsara Agentic AI" },
      { id: "key-features", label: "មុខងារសំខាន់ៗ" },
    ],
    mobileTitle: "កម្មវិធីទូរសព្ទ — iOS & Android",
    mobileIntro:
      "យក Apsara Talent ជាមួយអ្នកគ្រប់ទីកន្លែង។ កម្មវិធីទូរសព្ទរបស់យើងមាននៅលើ App Store និង Google Play ផ្តល់ឱ្យអ្នកនូវការចូលប្រើពេញលេញនៅលើវេទិកានៅពេលធ្វើដំណើរ។",
    mobileBullets: [
      "រកមើល និងដាក់ពាក្យសុំការងារដោយផ្ទាល់ពីទូរសព្ទរបស់អ្នក",
      "ទទួលការជូនដំណឹងភ្លាមៗសម្រាប់ការផ្គូផ្គង និងសារ",
      "ការផ្ញើសារភ្លាមៗជាមួយនិយោជក និងបេក្ខជន",
      "គ្រប់គ្រង Profile ប្រវត្តិរូប និងចំណង់ចំណូលចិត្តនៅពេលធ្វើដំណើរ",
      "ការផ្គូផ្គងដោយ Swipe សម្រាប់ការស្វែងរកដោយងាយស្រួល",
      "មើល Profile និងការងារដែលបានរក្សាទុកដោយមិនចាំបាច់ភ្ជាប់អ៊ីនធឺណិត",
    ],
    mobileDownload:
      "ទាញយកដោយឥតគិតថ្លៃនៅលើ App Store (iOS) និង Google Play (Android)។",
    webTitle: "គេហទំព័រ",
    webIntro:
      "បទពិសោធន៍គេហទំព័រ Apsara Talent ត្រូវបានបង្កើតឡើងសម្រាប់អ្នកប្រើប្រាស់ជំនាញ — អ្នកជ្រើសរើសបុគ្គលិកដែលគ្រប់គ្រងការជ្រើសរើស អ្នកជំនាញដែលបង្កើត CV និងក្រុមដែលសហការគ្នាលើការសម្រេចចិត្តជ្រើសរើស។",
    webBullets: [
      "ផ្ទាំងគ្រប់គ្រងពេញលេញជាមួយការវិភាគ និងការយល់ដឹង",
      "ឧបករណ៍បង្កើត CV ដំណើរការដោយ AI ជាមួយការណែនាំក្នុងពេលវេលាជាក់ស្តែង",
      "ការស្វែងរកកម្រិតខ្ពស់ជាមួយតម្រងសម្រាប់ជំនាញ ទីតាំង និងបទពិសោធន៍",
      "ព្រូហ្វាល់ក្រុមហ៊ុន និងការប្រកាសការងារពេញលេញ",
      "ឧបករណ៍កំណត់កាលវិភាគ និងគ្រប់គ្រងការសម្ភាសន៍",
      "ការផ្ញើសារភ្លាមៗដំណើរការដោយ Socket.io",
    ],
    aiTitle: "Apsara Agentic AI Assistant",
    aiIntro:
      "ជួបជាមួយដៃគូជ្រើសរើសបុគ្គលិកដែលមានបញ្ញា។ Apsara Agentic AI Assistant ទៅហួសពីស្វ័យប្រវត្តិកម្មសាមញ្ញ — វាគិត វាគ្រោង និងធ្វើសកម្មភាពជំនួសអ្នកដើម្បីសម្រួលរាល់ជំហាននៃវដ្តជីវិតទេពកោសល្យ។",
    aiBullets: [
      "ការផ្គូផ្គងបេក្ខជន-ការងារដែលឆ្លាតវៃដោយប្រើការវិភាគជំនាញស៊ីជម្រៅ",
      "ការពិនិត្យ និងចាត់ថ្នាក់ CV ដោយស្វ័យប្រវត្តិ",
      "ការកំណត់កាលវិភាគសម្ភាសន៍ដោយឆ្លាតវៃផ្អែកលើភាពទំនេរ",
      "ការណែនាំការងារផ្ទាល់ខ្លួនដែលសមស្របនឹងគោលដៅអាជីពរបស់អ្នក",
      "សេចក្តីព្រាង CV និងការណែនាំការបង្កើនប្រសិទ្ធភាពដែលបង្កើតដោយ AI",
      "ការជូនដំណឹងសកម្មសម្រាប់ការផ្គូផ្គងដែលមានភាពឆបគ្នាខ្ពស់",
      "សំណួរ-ចម្លើយជាភាសាធម្មជាតិអំពីបេក្ខជន តួនាទី និងនិន្នាការទីផ្សារ",
    ],
    aiNote:
      "Apsara Agentic AI ត្រូវបានរចនាឡើងដើម្បីបន្ថែមការសម្រេចចិត្តរបស់មនុស្ស មិនមែនជំនួសវាទេ។ រាល់ការណែនាំមកជាមួយហេតុផលច្បាស់លាស់ដើម្បីឱ្យអ្នកនៅតែមានការគ្រប់គ្រង។",
    featuresTitle: "មុខងារសំខាន់ៗនៅគ្រប់ផលិតផល",
    features: [
      {
        title: "ការផ្គូផ្គងឆ្លាតវៃ",
        description:
          "ក្បួនដោះស្រាយ AI តភ្ជាប់ទេពកោសល្យត្រឹមត្រូវជាមួយឱកាសត្រឹមត្រូវផ្អែកលើជំនាញ បទពិសោធន៍ និងចំណង់ចំណូលចិត្ត។",
      },
      {
        title: "ឧបករណ៍បង្កើត CV ដោយ AI",
        description:
          "បង្កើត CV វិជ្ជាជីវៈដែលឆបគ្នានឹង ATS ជាមួយការណែនាំពី AI និងគំរូស្រស់ស្អាត។",
      },
      {
        title: "ការផ្ញើសារភ្លាមៗ",
        description:
          "ទំនាក់ទំនងភ្លាមៗជាមួយបេក្ខជន ឬនិយោជកតាមរយៈប្រព័ន្ធជជែកដែលរួមបញ្ចូលរបស់យើង។",
      },
      {
        title: "ព្រូហ្វាល់ក្រុមហ៊ុន",
        description:
          "បង្ហាញវប្បធម៌ក្រុមហ៊ុន តួនាទីបើកចំហ និងក្រុមរបស់អ្នកដើម្បីទាក់ទាញទេពកោសល្យកំពូលកម្ពុជា។",
      },
      {
        title: "គ្រប់គ្រងការសម្ភាសន៍",
        description:
          "\u1780\u17C6\u178E\u178F\u17CB\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782 \u178F\u17B6\u1798\u178A\u17B6\u178F \u178F\u17B7\u1784\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u1780\u17B6\u179A\u179F\u1798\u17D2\u1797\u17B6\u179F\u178F\u17CD\u1799\u17C9\u17B6\u1784\u179A\u179B\u17BC\u178F\u1791\u17B6\u17C6\u1784\u178F\u17C5\u179B\u17BE\u1791\u17BC\u179A\u179F\u1796\u17D2\u1791 \u178F\u17B7\u1784\u1782\u17C1\u17A0\u1791\u17C6\u1796\u17D0\u179A\u17D4",
      },
      {
        title: "ការយល់ដឹងឆ្លាតវៃ",
        description:
          "ផ្ទាំងគ្រប់គ្រង និងការវិភាគដើម្បីជួយអ្នកយល់ពីនិន្នាការជ្រើសរើស និងបង្កើនប្រសិទ្ធភាពយុទ្ធសាស្ត្ររបស់អ្នក។",
      },
    ],
  },
};

const featureIcons = [
  <LucideSparkles key="0" />,
  <LucideFileText key="1" />,
  <LucideMessageSquare key="2" />,
  <LucideBriefcase key="3" />,
  <LucideUsers key="4" />,
  <LucideSearch key="5" />,
];

/* -------------------------------- Main Component ------------------------------- */
export function ProductContent() {
  /* ----------------------------------- Utils ----------------------------------- */
  const { language } = useLanguageStore();
  const t = content[language] ?? content.en;

  /* --------------------------------- Render UI --------------------------------- */
  return (
    <StaticPageShell
      pageNumber="02"
      title={t.pageTitle}
      subtitle={t.subtitle}
      tocHeading={t.tocHeading}
      toc={t.toc}
      icon={<LucideSmartphone />}
      heroVisual={
        <StaticPageArtworkSlot
          icon={<LucideSmartphone />}
          label={t.pageTitle}
        />
      }
    >
      {/* Mobile App Section */}
      <StaticSection
        id="mobile-app"
        number="01"
        icon={<LucideSmartphone />}
        title={t.mobileTitle}
      >
        <TypographyP>{t.mobileIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.mobileBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
        <StaticNote icon={<LucideDownload />}>{t.mobileDownload}</StaticNote>
      </StaticSection>

      {/* Web Platform Section */}
      <StaticSection
        id="web-platform"
        number="02"
        icon={<LucideMonitor />}
        title={t.webTitle}
      >
        <TypographyP>{t.webIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.webBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
      </StaticSection>

      {/* Apsara Agentic AI Section */}
      <StaticSection
        id="agentic-ai"
        number="03"
        icon={<LucideBrain />}
        title={t.aiTitle}
      >
        <TypographyP>{t.aiIntro}</TypographyP>
        <ul className="mt-1 flex flex-col gap-2">
          {t.aiBullets.map((b, i) => (
            <StaticBullet key={i}>{b}</StaticBullet>
          ))}
        </ul>
        <StaticNote icon={<LucideSparkles />}>{t.aiNote}</StaticNote>
      </StaticSection>

      {/* Key Features Grid Section */}
      <StaticSection
        id="key-features"
        number="04"
        icon={<LucideGlobe />}
        title={t.featuresTitle}
      >
        <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {t.features.map((f, i) => (
            <StaticCard
              key={i}
              icon={featureIcons[i]}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </StaticSection>
    </StaticPageShell>
  );
}
