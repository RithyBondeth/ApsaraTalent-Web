import type { StaticImageData } from "next/image";
import type React from "react";

export interface ISearchPageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  supportingText: string;
  mutedText: string;
  image: StaticImageData;
  imageAlt: string;
  visualIcon: React.ReactNode;
  children: React.ReactNode;
}
