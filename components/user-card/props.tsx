import { IUser } from "@/utils/interfaces/user.interface";

export interface IUserCardProps extends IUser {
    onViewClick: () => void;
    onSaveClick: () => void;
}