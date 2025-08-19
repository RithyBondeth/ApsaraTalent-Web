import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";

export interface IEmployeeCardProps extends IEmployee {
    onViewClick: () => void;
    onSaveClick: () => void;
    onLikeClick: () => void | Promise<void>;
    onLikeClickDisable: boolean;
    onProfileImageClick: (e: React.MouseEvent) => void;
}