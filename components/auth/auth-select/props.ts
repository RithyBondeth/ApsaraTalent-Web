import type { ReactNode } from "react";

interface IAuthSelectOption {
  value: string;
  label: string;
}

export interface IAuthSelectProps {
  label: string;
  options: IAuthSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  icon?: ReactNode;
  error?: string;
  className?: string;
}
