import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface IPageBannerStat {
  /** Short lowercase noun — "candidates", "new this week". */
  label: string;
  /** Pre-formatted for display; the banner does not format numbers itself. */
  value: ReactNode;
  icon: LucideIcon;
}

export interface IPageBannerProps {
  /** Small uppercase kicker above the title. */
  eyebrow: string;
  title: string;
  /** Plain copy, or light inline emphasis — no block elements: it renders in a <p>. */
  subtitle?: ReactNode;
  /**
   * Up to three counts shown alongside the copy. Omit while the page is still
   * loading rather than passing zeroes — a real "0" and "not loaded yet" look
   * identical otherwise, and the banner reflows when the data lands.
   */
  stats?: IPageBannerStat[];
  /**
   * Controls that belong to the banner rather than the page below it — the
   * search filters, for instance. Rendered full width under the copy so it
   * clears the stats column.
   */
  children?: ReactNode;
  className?: string;
}

export interface IPageBannerSkeletonProps {
  /**
   * How many stat placeholders to draw. Leave at 0 for pages that withhold
   * `stats` until their data lands — drawing a stats column the banner will
   * not have is the same reflow the placeholder exists to prevent.
   */
  stats?: number;
  /** Placeholder for whatever the real banner puts in its children slot. */
  children?: ReactNode;
  className?: string;
}
