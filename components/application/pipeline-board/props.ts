import { IApplication } from "@/utils/interfaces/application/application.interface";
import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IPipelineBoardProps {
  applications: IApplication[];
  selectedIds: Set<string>;
  updatingId: string | null;
  onToggleSelect: (applicationId: string) => void;
  onAdvance: (applicationId: string, status: TApplicationStatus) => void;
  onReject: (application: IApplication) => void;
  onOpenActivity: (application: IApplication) => void;
}
