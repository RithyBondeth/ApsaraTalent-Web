import type { ReactNode } from "react";

export interface IAuthShellProps {
  children: ReactNode;
  eyebrowKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  wide?: boolean;
  className?: string;
}
