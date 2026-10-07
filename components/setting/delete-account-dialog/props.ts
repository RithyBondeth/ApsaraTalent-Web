export interface IDeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms — the dialog closes itself after. */
  onConfirm: () => Promise<boolean>;
  /** True while the confirmation request is in flight. */
  processing: boolean;
}
