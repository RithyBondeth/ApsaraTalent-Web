import { IEmployee } from "@/utils/interfaces/employee.interface";

export interface IEmployeeCardProps extends IEmployee {
    onViewClick: () => void;
    onSaveClick: () => void;
}