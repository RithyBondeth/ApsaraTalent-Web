import { IEmployee } from "@/utils/interfaces/user/employee.interface";

export interface ICreateInterviewDialogProps {
  currentId: string;
  currentCompanyMatching: IEmployee[] | null;
}
