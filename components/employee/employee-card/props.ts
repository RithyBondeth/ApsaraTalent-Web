import { IEmployee } from "@/utils/interfaces/user/employee.interface";

export interface IEmployeeCardProps extends IEmployee {
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
