import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import React from "react";

export interface ICompanyCardProps extends ICompany {
    onViewClick: () => void;
    onSaveClick: () => void;
    onLikeClick: () => void | Promise<void>;
    onLikeClickDisable: boolean;
    onProfileImageClick: (e: React.MouseEvent) => void;
    hideSaveButton?: boolean;
}
