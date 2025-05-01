import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import React from "react";

export interface ICompanyCardProps extends ICompany {
    onViewClick: () => void;
    onSaveClick: () => void;
    onProfileImageClick: (e: React.MouseEvent) => void;
}
