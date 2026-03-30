import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import React from "react";

export interface ICompanyCardProps extends ICompany {
  onViewClick: () => void;
  onSaveClick: () => void;
  onLikeClick: () => void | Promise<void>;
  onLikeClickDisable: boolean;
  onProfileImageClick: (e: React.MouseEvent) => void;
  hideSaveButton?: boolean;
  /** "grid" removes outer border/rounded for seamless grid layout */
  variant?: "default" | "grid";
  /** If provided, the View button renders as a prefetching <Link> instead of a <button> */
  viewHref?: string;
}
