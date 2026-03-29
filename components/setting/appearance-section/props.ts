import { TTheme } from "@/utils/types/app";

export interface IAppearanceSectionProps {
  theme: TTheme;
  onThemeChange: (theme: TTheme) => void;
}
