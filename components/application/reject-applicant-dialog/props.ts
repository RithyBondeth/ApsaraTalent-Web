import { IApplication } from "@/utils/interfaces/application/application.interface";

export interface IRejectApplicantDialogProps {
  /** The applicant being rejected; null closes the dialog. */
  application: IApplication | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: (applicationId: string, reason: string) => void;
}
