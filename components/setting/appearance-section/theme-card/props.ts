import { TTheme } from "@/utils/types/app/theme.type";

export interface IThemeCardProps {
  value: TTheme;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  /** Receives the event so the theme reveal can start from this card. */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}
