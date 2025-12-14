import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";

export interface IEmployeeDialogProps extends IEmployee {
  open: boolean;
  setOpen: (open: boolean) => void;
}
