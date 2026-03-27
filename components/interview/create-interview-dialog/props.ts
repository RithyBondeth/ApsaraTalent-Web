import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";

export interface ICreateInterviewDialogProps {
  currentId: string;
  currentCompanyMatching: IEmployee[] | null;
}
