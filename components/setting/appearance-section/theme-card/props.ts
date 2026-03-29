import { TTheme } from "@/utils/types/app";

export interface IThemeCardProps {
  value: TTheme;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
