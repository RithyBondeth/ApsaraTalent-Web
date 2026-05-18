export type T2FADialogMode = "enable" | "disable";

export interface ITwoFactorDialogProps {
  open: boolean;
  mode: T2FADialogMode;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
