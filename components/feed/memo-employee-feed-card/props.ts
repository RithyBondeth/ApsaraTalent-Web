import { IEmployee } from "@/utils/interfaces/user/employee.interface";

export interface IMemoEmployeeFeedCardProps {
  employee: IEmployee;
  companyId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (companyId: string, employeeId: string) => void;
  onSave: (companyId: string, employeeId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
}
