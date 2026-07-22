export interface ISwitcherProps {
  className?: string;
  /** Renders without the fixed positioning wrapper (for embedding in headers) */
  inline?: boolean;
}

export type TAnimationKind = "language" | "theme" | null;

export interface IThemeViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}

export type TThemeTransitionDocument = Document & {
  startViewTransition?: (
    update: () => void | Promise<void>,
  ) => IThemeViewTransition;
};
