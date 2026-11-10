export interface IJobHideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown in the title so the admin can see what they are removing. */
  jobTitle: string;
  companyName: string;
  saving: boolean;
  onSubmit: (reason: string) => void;
}
