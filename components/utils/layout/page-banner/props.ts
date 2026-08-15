import type { TPixelGlyph } from "@/components/utils/brand/pixel-icon/glyphs";
import type { ReactNode } from "react";

export interface IPageBannerStat {
  /** Short lowercase noun — "candidates", "new this week". */
  label: string;
  /** Pre-formatted for display; the banner does not format numbers itself. */
  value: ReactNode;
  icon: TPixelGlyph;
}

export interface IPageBannerProps {
  /** Small uppercase kicker above the title. */
  eyebrow: string;
  title: string;
  subtitle?: string;
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
