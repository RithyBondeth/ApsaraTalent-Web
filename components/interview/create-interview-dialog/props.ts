import { IEmployee } from "@/utils/interfaces/user/employee.interface";

export interface ICreateInterviewDialogProps {
  currentId: string;
  currentCompanyMatching: IEmployee[] | null;
  /** Pre-select this employee and auto-open the dialog (used when navigating from matching page) */
  initialEmployeeId?: string;
}
