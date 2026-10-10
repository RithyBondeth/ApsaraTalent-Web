export interface IDangerZoneSectionProps {
  /** Called when the user confirms account deletion. */
  onRequestDeletion: () => void;
  /**
   * True while a delete request is in flight — disables both actions so the
   * user cannot start an export the same moment their account is going away.
   */
  processing: boolean;
}
