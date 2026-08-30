import type React from "react";
import type { IPageBannerStat } from "@/components/utils/layout/page-banner/props";

export interface ISearchPageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  supportingText: string;
  /** Result counts, once a search has run. Omit while loading. */
  stats?: IPageBannerStat[];
  children: React.ReactNode;
}
