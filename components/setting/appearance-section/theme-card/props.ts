import { TTheme } from "@/utils/types/app/theme.type";

export interface IThemeCardProps {
  value: TTheme;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
