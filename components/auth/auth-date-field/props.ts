import type { ReactNode } from "react";

export interface IAuthDateFieldProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  icon?: ReactNode;
  error?: string;
  dateFormat?: string;
  className?: string;
}
