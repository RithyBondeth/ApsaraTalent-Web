import { IApplication } from "@/utils/interfaces/application/application.interface";

export interface IApplicationCardProps {
  application: IApplication;
  isWithdrawing: boolean;
  onWithdraw: (applicationId: string) => void;
}
