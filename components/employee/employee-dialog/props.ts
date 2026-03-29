import { IEmployee } from "@/utils/interfaces/user";

export interface IEmployeeDialogProps extends IEmployee {
  open: boolean;
  setOpen: (open: boolean) => void;
}
