export interface ISwitcherProps {
  className?: string;
  /** Renders without the fixed positioning wrapper (for embedding in headers) */
  inline?: boolean;
  /** Grid cells are used by the editorial landing navigation. */
  variant?: "pill" | "grid";
}

export type TAnimationKind = "language" | "theme" | null;

interface IThemeViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}

export type TThemeTransitionDocument = Document & {
  startViewTransition?: (
    update: () => void | Promise<void>,
  ) => IThemeViewTransition;
};
