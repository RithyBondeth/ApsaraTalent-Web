import type { ReactNode } from "react";

/** The four semantic status families declared in app/globals.css. */
export type TStatus = "success" | "warning" | "info" | "destructive";

export type TStatusPillVariant = "subtle" | "solid";

export interface IStatusPillProps {
  status: TStatus;
  /**
   * `subtle` (default) tints the surface and colours the label — the right
   * choice inside dense lists. `solid` fills with the status colour and is
   * reserved for the one thing on screen that has to be noticed first.
   */
  variant?: TStatusPillVariant;
  /** Renders a filled dot before the label. */
  dot?: boolean;
  children: ReactNode;
  className?: string;
}
