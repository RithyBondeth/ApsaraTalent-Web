export interface IDeletionScheduledBannerProps {
  /** ISO timestamp — when the account was requested for deletion. */
  requestedAt: string;
  /** True while the cancel request is in flight. */
  processing: boolean;
  onCancel: () => void;
}
