import { ICompany } from "@/utils/interfaces/user";

export interface ICompanyDialogProps extends ICompany {
  open: boolean;
  setOpen: (open: boolean) => void;
}
