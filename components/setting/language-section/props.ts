import { TLanguage } from "@/utils/types/app";

export interface ILanguageCardProps {
  value: TLanguage;
  flag: string;
  label: string;
  nativeLabel: string;
  active: boolean;
  onClick: () => void;
}

export interface ILanguageSectionProps {
  language: TLanguage;
  onLanguageChange: (language: TLanguage) => void;
}
