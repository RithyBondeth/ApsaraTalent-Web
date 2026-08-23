import type { ReactNode } from "react";

export interface ILandingPhoneProps {
  children: ReactNode;
  /** The screen's own header, rendered under the status bar. */
  bar: ReactNode;
  /** Which bottom-tab item reads as current. */
  activeTab?: number;
}

export interface ILandingLaptopProps {
  children: ReactNode;
}
