import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";

export interface IEmployeeCardProps extends IEmployee {
    onViewClick: () => void;
    onSaveClick: () => void;
}