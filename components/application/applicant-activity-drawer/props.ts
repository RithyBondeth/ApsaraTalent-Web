import { IApplication } from "@/utils/interfaces/application/application.interface";

export type TActivityTab = "notes" | "history";

export interface IApplicantActivityDrawerProps {
  application: IApplication | null;
  initialTab?: TActivityTab;
  onClose: () => void;
}
