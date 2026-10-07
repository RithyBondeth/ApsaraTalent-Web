import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  /** The stage of an application this employee already has for the job. */
  existingStatus?: TApplicationStatus;
  /** Renders the trigger full-width, for the position card's footer. */
  fullWidth?: boolean;
}
