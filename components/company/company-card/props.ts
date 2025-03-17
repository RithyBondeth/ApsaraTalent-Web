import { ICompany } from "@/utils/interfaces/company.interface";

export interface ICompanyCardProps extends ICompany {
    onViewClick: () => void;
    onSaveClick: () => void;
}
