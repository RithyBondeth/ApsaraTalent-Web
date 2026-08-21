export type TBenefitValueKind = "benefit" | "value";

export interface IBenefitValueChipProps {
  /** Which of the two company facets this chip carries. Drives the colour. */
  kind: TBenefitValueKind;
  label: string;
  /**
   * Renders a remove control. Supply only on the authoring surfaces (profile
   * edit mode, signup wizard) — the read-only views pass nothing.
   */
  onRemove?: () => void;
  /** Accessible name for the remove control, e.g. "Remove Unlimited PTO". */
  removeLabel?: string;
  className?: string;
}
