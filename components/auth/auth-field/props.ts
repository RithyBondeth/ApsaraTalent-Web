import type { InputHTMLAttributes, ReactNode } from "react";

export interface IAuthFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label: string;
  icon?: ReactNode;
  error?: string;
}
