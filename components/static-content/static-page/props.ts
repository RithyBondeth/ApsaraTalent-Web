import type { ReactNode } from "react";

interface IStaticPageTocItem {
  id: string;
  label: string;
}

export interface IStaticPageShellProps {
  pageNumber: string;
  pageTotal?: string;
  title: string;
  subtitle: ReactNode;
  tocHeading: string;
  toc: IStaticPageTocItem[];
  icon: ReactNode;
  meta?: ReactNode;
  heroVisual?: ReactNode;
  children: ReactNode;
}

export interface IStaticSectionProps {
  id: string;
  number: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export interface IStaticBulletProps {
  children: ReactNode;
}

export interface IStaticCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

export interface IStaticStepProps {
  step: number;
  title: string;
  description: string;
}

export interface IStaticNoteProps {
  icon: ReactNode;
  children: ReactNode;
}

export interface IStaticPageArtworkSlotProps {
  icon: ReactNode;
  label: string;
}
