export interface ISavedSearchesSectionProps {
  /**
   * Only rendered for employees; the setting page owns this decision and
   * hides the whole section for companies rather than have the component
   * decide from a role prop it does not otherwise use.
   */
  className?: string;
}
