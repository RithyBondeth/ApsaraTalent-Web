import { TTheme } from "@/utils/types/app/theme.type";

export interface IAppearanceSectionProps {
  theme: TTheme;
  onThemeChange: (theme: TTheme) => void;
}
