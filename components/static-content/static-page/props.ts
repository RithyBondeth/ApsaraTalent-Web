import type { ReactNode } from "react";
import type { IPageBannerStat } from "@/components/utils/layout/page-banner/props";

interface IStaticPageTocItem {
  id: string;
  label: string;
}

export interface IStaticPageShellProps {
  pageNumber: string;
  title: string;
  subtitle: ReactNode;
  tocHeading: string;
  toc: IStaticPageTocItem[];
  /**
   * Up to three facts about the document itself — when it was last revised, how
   * many sections, how long it takes to read. Same contract as PageBanner's:
   * omit rather than pass placeholders.
   */
  stats?: IPageBannerStat[];
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
