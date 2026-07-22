import type { StaticImageData } from "next/image";

export interface IAuthBrandPanelProps {
  image?: StaticImageData;
  imageAlt?: string;
  eyebrowKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  className?: string;
}
