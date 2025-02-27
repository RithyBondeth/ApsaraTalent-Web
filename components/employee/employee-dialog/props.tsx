import { IEmployee } from "@/utils/interfaces/employee.interface";

export interface IEmployeeDialogProps extends IEmployee {
    open: boolean;
    setOpen: (open: boolean) => void;
}