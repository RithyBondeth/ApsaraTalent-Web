import { IEmployee } from "@/utils/interfaces/user/employee.interface";

export interface IEmployeeDialogProps extends IEmployee {
  open: boolean;
  setOpen: (open: boolean) => void;
}
