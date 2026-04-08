import {
  LucideCalendarCheck,
  LucideFileText,
  LucideGlobe,
  LucideHandshake,
  LucideIcon,
  LucideMessageCircle,
  LucideSearch,
} from "lucide-react";

export const landingFeatureKeys: {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}[] = [
  {
    icon: LucideSearch,
    titleKey: "featureSmartMatching",
    descKey: "featureSmartMatchingDesc",
  },
  {
    icon: LucideFileText,
    titleKey: "featureResumeBuilder",
    descKey: "featureResumeBuilderDesc",
  },
  {
    icon: LucideMessageCircle,
    titleKey: "featureRealTimeChat",
    descKey: "featureRealTimeChatDesc",
  },
  {
    icon: LucideCalendarCheck,
    titleKey: "featureInterviewScheduling",
    descKey: "featureInterviewSchedulingDesc",
  },
  {
    icon: LucideHandshake,
    titleKey: "featureCompanyProfiles",
    descKey: "featureCompanyProfilesDesc",
  },
  {
    icon: LucideGlobe,
    titleKey: "featureBilingual",
    descKey: "featureBilingualDesc",
  },
] as const;

export const landingStepKeys: {
  number: string;
  titleKey: string;
  descKey: string;
}[] = [
  { number: "01", titleKey: "step1Title", descKey: "step1Description" },
  { number: "02", titleKey: "step2Title", descKey: "step2Description" },
  { number: "03", titleKey: "step3Title", descKey: "step3Description" },
] as const;
