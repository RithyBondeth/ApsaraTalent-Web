import { ReactNode } from "react";

export interface ILazyActionButtonProps {
  label: string;
  compact?: boolean;
  icon: ReactNode;
  interview?: boolean;
  onClick: () => void;
}