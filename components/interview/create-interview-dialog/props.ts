import { IEmployee } from "@/utils/interfaces/user";

export interface ICreateInterviewDialogProps {
  currentId: string;
  currentCompanyMatching: IEmployee[] | null;
}
