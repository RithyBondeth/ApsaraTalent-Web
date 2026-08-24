import { TTheme } from "@/utils/types/app/theme.type";

export interface IAppearanceSectionProps {
  theme: TTheme;
  /**
   * The click event is forwarded so the theme reveal can grow from the card the
   * person actually pressed, matching the navbar and the public-page switcher.
   */
  onThemeChange: (theme: TTheme, event: React.MouseEvent<HTMLElement>) => void;
}
