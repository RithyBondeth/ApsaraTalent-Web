import { IEmployee } from "@/utils/interfaces/user";

export interface IEmployeeCardProps extends IEmployee {
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
