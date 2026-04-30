export interface IResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  sending: boolean;
  onSendReset: () => void;
  sent: boolean;
}
