export interface IAiMatchExplanationModalProps {
  eid: string;
  cid: string;
  companyName: string;
  /** When true the trigger shows icon-only on mobile (< sm) and full label on sm+. */
  compact?: boolean;
}
