import { ICompany } from "@/utils/interfaces/company.interface";

export interface ICompanyDialogProps extends ICompany {
    open: boolean;
    setOpen: (open: boolean) => void;
}