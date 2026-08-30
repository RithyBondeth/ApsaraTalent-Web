import { ICompany } from "@/utils/interfaces/user/company.interface";
import React from "react";

export interface ICompanyCardProps extends ICompany {
  onViewClick: () => void;
  onSaveClick: () => void;
  onSaveClickDisable?: boolean;
  onLikeClick: () => void | Promise<void>;
  onLikeClickDisable: boolean;
  onProfileImageClick: (e: React.MouseEvent) => void;
  hideSaveButton?: boolean;
  /** "grid" applies the square feed-card treatment. */

  /** If provided, the View button renders as a prefetching <Link> instead of a <button> */
  viewHref?: string;
}
