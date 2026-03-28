import { TTheme } from "@/utils/types/theme.type";

export interface IAppearanceSectionProps {
  theme: TTheme;
  onThemeChange: (theme: TTheme) => void;
}
