import { IUser } from "@/utils/interfaces/user.interface";

export interface IUserDialogProps extends IUser {
    open: boolean;
    setOpen: (open: boolean) => void;
}