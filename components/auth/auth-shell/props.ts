import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

export interface IAuthShellProps {
  children: ReactNode;
  image?: StaticImageData;
  imageAlt?: string;
  eyebrowKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  wide?: boolean;
  className?: string;
}
