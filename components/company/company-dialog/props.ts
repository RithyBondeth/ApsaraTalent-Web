import { ICompany } from "@/utils/interfaces/user/company.interface";

export interface ICompanyDialogProps extends ICompany {
  open: boolean;
  setOpen: (open: boolean) => void;
}
