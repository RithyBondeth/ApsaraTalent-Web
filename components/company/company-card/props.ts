import { ICompany } from "@/utils/interfaces/user-interface/company.interface";

export interface ICompanyCardProps extends ICompany {
    onViewClick: () => void;
    onSaveClick: () => void;
}
