import { IApplication } from "@/utils/interfaces/application/application.interface";
import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IApplicantCardProps {
  application: IApplication;
  isUpdating: boolean;
  onAdvance: (applicationId: string, status: TApplicationStatus) => void;
  onReject: (application: IApplication) => void;
}
